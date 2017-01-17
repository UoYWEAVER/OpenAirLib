import AudioLoader from '../core/loaders/audio-loader.js';
// import CompoundNode from '../core/compound-node.js';
import KXOmnitone from '../kx-omnitone/kx-omnitone.js';

/*
  open-air-lib.js
  K Brown
  University of York
  M Paradis
  BBC Audio Research

  OpenAirLibNode

*/

export default class OpenAirLibNode {

// LOCAL TEST constructor(context, urlbase = 'http://localhost:3000', test = false) {
//  constructor(context, urlbase = 'oadev.york.ac.uk/irserver', test = false) {
  constructor(context, urlbase = 'www.openairlib.net/irserver', test = false) {
    this._context = context;
    this._url_base = urlbase;
    this._url_suffix_filefromurl = '/filefromrurl?d=';

    this._input = context.createGain();
    this._output = context.createGain();
    this._output.channelCountMode = 'explicit';
    this._output.channelCount = 2;

    this._info = {};
    this._info.rurl = '';
    this._info.nchans = 0; // of the loaded IR
    this._info.sr = 0;
    this._info.length = 0; // n frames
    this._convs = [];
    this._LOGSRMM = false;

    // TEST
    if (test) {
      const testOsc = context.createOscillator();
      testOsc.connect(this._output);
      testOsc.start();
    }
  }

  // return the input node
  get input() {
    return this._input;
  }

  // return the output node
  get output() {
    return this._output;
  }

	// connect this output node to another specified node
  connect(node) {
    this._output.connect(node);
  }

	// disconnect tbis output node from any nodes it is connected to
  disconnect() {
    this._output.disconnect();
  }

	// get this gain value (output gain)
  get gain() {
    return this._output.gain.value;
  }

	// set this gain value (output gain)
  set gain(gain) {
    this._output.gain.value = gain;
  }

	// get an array containing zero to two convolver nodes used by the current audio
	// graph (if any)
  get convs() { // so can set normalise etc, array of convs, (can be len 0 if uninitd)
    return this._convs;
  }

  // get the RURL (if any) of the currently loaded IR
  get rURL() {
    return this._info.rurl;
  }

	// get the number of channels in the currently loaded IR
  get nChans() { // of IR
    return this._info.nchans;
  }

	// get the length in frames of the currently loaded IR,
  // where a frame is one or more samples at a particular instrant in time,
	// the number of samples in a frame depending on the number of channels in the IR
  get length() {
    return this._info.length;
  }

	// get the original sample rate of the currently loaded IR
  get sampleRate() {
    return this._info.sampleRate;
  }

  _isValidNChans(nchans) {
    return ((nchans === 1) | (nchans === 2) | (nchans === 4));
    // WAA conv does not support others unless split manually...
    // https://webaudio.github.io/web-audio-api/#idl-def-ConvolverNode
  }

	// internal function called within successful load()
  _constructIOGraph(ninputchans, bufnchans, irbuffer) {
    this._output.gain.value = 0; // vol down first

    /*
      latest WAA discussion / proposal
      https://github.com/WebAudio/web-audio-api/issues/942
      has convolver explicitly set to channelCount 2 so >2-chans-in gets downmixed
      to 2 or mono-in gets upmixed to 2. If IR itself is 1 it gets internally duplicated to 2.
      IR of 4 is for true stereo. conv output will always be stereo.
      however not sure when above will be implemented in browsers?
      at pres ie eo Sept 2016,
      OLD DIAGRAM: https://webaudio.github.io/web-audio-api/#Convolution-channel-configurations

      Probably only curr & future safe course of action is to use one or two, 2-chan convolvers
      if IR is one chan, dup it explicitly into 2 chan buffer use one conv
      if IR is 2 chan just use it in the one conv
      if IR is 4 chan split into 2 sep 2 chan buffers & use 2 convolvers.

      output node will always be 2 chans, but if IR is 4 chan, use omnitone to render back down
      to 2 chan (binaural). intermediate step will split each of the conv s to 2 then use a 4 chan
      merger to supply single 4 chan data stream to omnione.
    */

    // src: force upmix if < 2 or downmix if > 2 chans
    // if chans is already 2 will just be an extra gain node
    // if _auxin already existed, recreate will implicitly disconnect w/o danger of throw
    // if not connected
    this._auxin = this._context.createGain();
    this._auxin.channelCountMode = 'explicit';
    this._auxin.channelCount = 2;
    this.input.connect(this._auxin);

    // create/destroy convs if necc so correct count
    if (this._convs.length === 0) {
      // always need at least one (stereo)convolver...
      this._convs.push(this._context.createConvolver());
    }
    if (this._convs.length === 2 && bufnchans < 4) {
      this._convs[1] = undefined;
      this._convs.pop();
    }
    if (this._convs.length === 1 && bufnchans === 4) {
      this._convs.push(this._context.createConvolver());
    }

    // may now need to split/duplicate the IRbuffer dep on irbuffer.numberOfChannels

    // now load IRs into convs as necc

    if (bufnchans === 2) { // simple case: stereo
      this._convs[0].buffer = irbuffer;
      this._auxin.connect(this._convs[0]);
      this._convs[0].connect(this._output);
      // dont return - need to reenable output gain
    } else {
      let tmpbuf;
      let tmparray;
      const abo = {}; // AudioBufferOptions - mandatory Oct 2016+ spec
      abo.length = irbuffer.length;
      abo.sampleRate = irbuffer.sampleRate;
      abo.numberOfChannels = 2;
      try {
        tmpbuf = this._context.createBuffer(abo);
      } catch (err) {
        tmpbuf = this._context.createBuffer(
          abo.numberOfChannels, abo.length, abo.sampleRate);
      }
      if (bufnchans === 1) {
        tmparray = new Float32Array(abo.length);
        // dup irbuffer into both chans
        irbuffer.copyFromChannel(tmparray, 0, 0);
        tmpbuf.copyToChannel(tmparray, 0, 0);
        tmpbuf.copyToChannel(tmparray, 1, 0);
        this._convs[0].buffer = tmpbuf;
        this._auxin.connect(this._convs[0]);
        this._convs[0].connect(this._output);
        // dont return - need to reenable output gain
      }
      if (bufnchans === 4) {
        // copy 0 and 1 from 4chanbuffer to 0 and 1 in stereo buffer
        tmparray = new Float32Array(abo.length);
        irbuffer.copyFromChannel(tmparray, 0, 0);
        tmpbuf.copyToChannel(tmparray, 0, 0);
        irbuffer.copyFromChannel(tmparray, 1, 0);
        tmpbuf.copyToChannel(tmparray, 1, 0);
        this._convs[0].buffer = tmpbuf;

				// create another for 2nd convolver JIC it doesnt copy the data... TBA
        try {
          tmpbuf = this._context.createBuffer(abo);
        } catch (err) {
          tmpbuf = this._context.createBuffer(abo.numberOfChannels, abo.length, abo.sampleRate);
        }
        // copy 2 and 3 from 4chanbuffer to 0 and 1 in stereo buffer
        irbuffer.copyFromChannel(tmparray, 2, 0);
        tmpbuf.copyToChannel(tmparray, 0, 0);
        irbuffer.copyFromChannel(tmparray, 3, 0);
        tmpbuf.copyToChannel(tmparray, 1, 0);
        this._convs[1].buffer = tmpbuf;

        this._auxin.connect(this._convs[0]);
        this._auxin.connect(this._convs[1]);

        if (this._split1 === undefined) {
          this._split1 = this._context.createChannelSplitter(2);
        }
        if (this._split2 === undefined) {
          this._split2 = this._context.createChannelSplitter(2);
        }

        this._convs[0].connect(this._split1);
        this._convs[1].connect(this._split2);
        if (this._merge4 === undefined) {
          this._merge4 = this._context.createChannelMerger(4);
        }

        if (this._FOADecoder === undefined) {
          // ALL OALib 4 chan IRs are currently WXYZ, also no chan ordering stats avail from SQL
          // so have to assume WXYZ FuMa is the std, & always map as such.
          const channelMap = [0, 3, 1, 2]; // W=0,Y=1,Z=2,X=3->WXYZ ie 0312 remap
          this._FOADecoder = new KXOmnitone.createFOADecoder(this._context, channelMap);
          this._FOADecoder.initialize().then(() => {
            this._split1.connect(this._merge4, 0, 0);
            this._split1.connect(this._merge4, 1, 1);
            this._split2.connect(this._merge4, 0, 2);
            this._split2.connect(this._merge4, 1, 3);
            this._merge4.connect(this._FOADecoder.input);
            this._FOADecoder.output.connect(this._output);
          })
          .catch(() => {
            console.log('couldnt init foasystem');
            // just use Wchan, mono for now!!! will be upmixed to stereo i think
            // poss fall back to dual cardioid no-hrtf from jsambisonics? TOSUSS
            this._split1.connect(this._output, 0);
          });
        } // end of setupfoadecoder
      } // end of bufnchans == 4
    } // end else not 2 chans
    this._output.gain.value = 1; // vol back up
  }


	// load an Impulse response from openairlib.net by specifying its relative url (
	// obtained from previous call to one of the OpenAirLibInfo methods.
	// returns a promise
  load(rurl) {
    const loader = new AudioLoader(this._context);
    const debserver = this._url_base;
    const requrl = `${debserver}${this._url_suffix_filefromurl}${rurl}`;
    const pr = loader.load(requrl);

    pr.then((result) => {
      if (result instanceof AudioBuffer) {
        const bufnchans = result.numberOfChannels;
        if (!this._isValidNChans(bufnchans)) {
          return Promise.reject(new Error('AudioLoader result unsupported'));
        }
        this._info.nchans = bufnchans;
        this._info.rurl = rurl;
        this._info.sampleRate = result.sampleRate;
        // should always be context sr due to auto resmapling on decode???
        this._info.length = result.length;
        if (this._info.sr !== this._context.sampleRate) {
          if (this._LOGSRMM) {
            console.log('sr mismatch');
          }
        }
        const ninputchans = this.input.numberOfChannels;
        this._constructIOGraph(ninputchans, bufnchans, result);
      } else {
        return Promise.reject(new Error('AudioLoader result was not an audio buffer'));
      }
      return Promise.resolve('loaded ok');
    });
    return pr;
  }

}

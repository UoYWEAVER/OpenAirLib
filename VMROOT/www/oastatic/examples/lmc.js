/*
  lmc.js
  K Brown
  University of York
  160703

  live input and convolution
  Dynamically accessed urllist from node server on OA
  WAA eg at http://googlechrome.github.io/web-audio-samples/samples/audio/convolution-effects.html
  Note curr spec says buffer of a convolver CAN be changed dynamically ( unlike an ABSN ) but
  normalize only takes effect when buffer is set/changed
  - see end of https://github.com/WebAudio/web-audio-api/issues/122

  160705 - oanodeserver.js now modifies urls for full server path (only tested on KBMAC)

  160714 - wip check bus chans for loaded IRs with dev console...

  ver 2
  160801 mod for rel paths only returned but can query server for root
  TODO - convert to using openairlib and openairinfo once tests complete.

*/
'use strict';

(function nmtest() {

  //const oaserver = 'http://oadev.york.ac.uk/irserver';
  const oaserver = 'http://www.openairlib.net/irserver';

  let oainfo = new WeavrLib.effects.OpenAirLibInfo(oaserver);
  let result = oainfo.urlBase();
  console.log(result);

  let myArr; // holder for all IR json info
  let listloaded = false;

  let context;
  let oanode;

  let liveStream;
  let gainmic2op;
  let gainmic2conv;
  //let gainconv2op; not needed: OpenAirNode has its own output gain element internal
  let micrdy;
  let selectedind;
  // const lastusednumchans;
  //const LOCALROOT = 'file:///Users/kennethbrown/Desktop/Local/WEAVER/ASSETS/www.openairlib.net';
  const DEBVERBOSETEST=true;


  function consoleLogFileInfo(fileinfo) {
    console.log ('' +
    fileinfo.fid + ', ' +
    fileinfo.nid + ', ' +
    fileinfo.uid + ', ' +
    fileinfo.title + ', ' +
    fileinfo.filename + ', ' +
    fileinfo.fs + ', ' +
    fileinfo.chans + ', ' +
    fileinfo.kftype + ', ' +
    fileinfo.rt60_1K + ', ' +
    fileinfo.SrcCat + ', ' +
    fileinfo.GenVal + ', ' +
    fileinfo.FrPg + ', ' +
    fileinfo.email + ', ' +
    fileinfo.cc_license
    );
  }

  function popList() {

    function popListWithArr() {
      /* TODO: decode json into inner html of OpenAirIRnamesDiv
      <div><span>
      <button class='stdButton' id='poplist'>poplist</button>
      <button class='stdButton' id='getinfo'>get info</button>
      <button class='stdButton' id='useir'>useIR</button>
      </span></div>

      <div id='OpenAirIRnamesDiv'>
      <select class='placeholder' id='OpenAirIRnames'>
      </select>
      </div>
      */
      const nlines = myArr.length;
      if (nlines <= 0) {
        return;
      }

      // X01 means index 0 = OFF
      //           index 1 = mic only no conv / IR

      const selh = `<select id = 'OpenAirIRnames'>`;
      const opth = `<option value = '`;
      const optm = `'>`;
      const optt = `</option>`;
      const selt = `</select>`;

      let ihtxt = '';
      let lineurl = '';
      let linedisp = '';

      /*
        fields should be resp (IFF query in app.js is compat with ../queries/query014b.sql:
        fid,nid,uid,filename,fs,chans,kftype,email,cc_license,filepath,descn
      */
      ihtxt += selh;

      // list 0 off
      lineurl = '';
      linedisp = 'OFF';
      ihtxt += opth;
      ihtxt += lineurl;
      ihtxt += optm;
      ihtxt += linedisp;
      ihtxt += optt;
      // list 1 mic only
      lineurl = '';
      linedisp = 'MIC';
      ihtxt += opth;
      ihtxt += lineurl;
      ihtxt += optm;
      ihtxt += linedisp;
      ihtxt += optt;

      for (let linei = 0; linei < nlines; linei++) {
        lineurl = myArr[linei].filepath;
        linedisp = myArr[linei].filename;
        ihtxt += opth;
        ihtxt += lineurl;
        ihtxt += optm;
        ihtxt += linedisp;
        ihtxt += optt;
      }
      ihtxt += selt;

      let tmp = document.getElementById('OpenAirIRnamesDiv');
      tmp.innerHTML = ihtxt;

      tmp = document.getElementById('poplist');
      tmp.style.visibility = 'hidden';

      tmp = document.getElementById('OpenAirIRnames');
      tmp.addEventListener('change', infoAndSel);

      infoAndSel();
    } // eo inner func

    if (myArr !== undefined && myArr.length > 0) {
       popListWithArr();
       //enableusebuttons();
    }

  } // eo poplist()

  function infoAndSel() {
    getInfo();
    useIR();
  }

  /*
    fileinfo.fid,
    fileinfo.nid,
    fileinfo.uid,
    fileinfo.filename,
    fileinfo.fs,
    fileinfo.chans
    ,fileinfo.kftype -- dev
    ,users.init as 'email'
    ,creativecommons_lite.license AS 'cc_license'
    ,fileinfo.filepath
    ,content_field_description.field_description_value AS 'descn'
  */


  function getInfo() {
    let tmp = document.getElementById('OpenAirIRnames');
    if (tmp === undefined) {
      return;
    }

    const ind = tmp.selectedIndex;

    tmp = document.getElementById('tainfo');
    if (tmp === undefined) {
      return;
    }
    let infobj = {};

    // ADJUST FOR LIVE TEST: OFF/MIC
    if (ind === 0) {
      infobj.mode = 'OFF';
    } else if (ind === 1) {
      infobj.mode = 'MIC';
    } else {
      infobj = myArr[ind - 2];
    }

    const infotxt = formInfo(infobj); // get text from obj
    tmp.innerText = infotxt;
  }

  function formInfo(obj) {
    let str = '';
    let p;
    for (p in obj) {
      if (obj.hasOwnProperty(p)) {
        if ((p + '' === 'chans') &&
          (!validnumchans(obj.chans))) {
          str += p + '::' + obj[p] + ' (invalid for WAA)\n';
        } else {
          str += p + '::' + obj[p] + '\n';
        }
      }
    }
    return str;
  }

  function useIR() {
    const tmp = document.getElementById('OpenAirIRnames');
    if (tmp === undefined) {
      return;
    }
    selConvSource();
  }

  /*
  function enableusebuttons() {
    let tmp;
    tmp = document.getElementById('getinfo');
    tmp.style.visibility = 'visible'; // vs 'hidden'

    tmp = document.getElementById('useir');
    tmp.style.visibility = 'visible';
  }
  */

  function selConvSource() {
    // let urllist = [];
    const e = document.getElementById('OpenAirIRnames');
    let ind = e.selectedIndex;

    stop();

    if (ind === undefined) {
      ind = 0;
    }

    const rurl = e.options[ind].value;

    // inspect & compare with debmyurlroot...

    selectedind = ind;

    // also see the trygo func: no need to test conv buffer if only mic reqd
    if (selectedind === 0) { // special case: all off
      console.log('-off-');
      return;
    }
    if (selectedind === 1) { // special case: no conv at all
      console.log('-direct-');
      gainmic2op.gain.value = 1.0;
      return;
    }
    if (selectedind > 1) { // inds 0 and 1 dont need IR
      // normalize? - when
      oanode.load(rurl)
      .then( () => {
        checkvarious();
        console.log("oanode.load(rurl) worked");
        gainmic2conv.gain.value = 1.0;
        oanode.gain = 1.0; // === outputs[0].gain.value
        return 0;
      })
      .catch( err => {
        console.log("oanode.load(rurl) failed");
      });
    }
  }

  function stop() {
    gainmic2op.gain.value = 0.0;
    gainmic2conv.gain.value = 0.0;
    //oanode._outputs[0].gain.value = 0.0;
    oanode.gain = 0.0; // oanode has shortcut to above
  }


  function validnumchans(inpc) {
    return (inpc === 1) | (inpc === 2) | (inpc === 4);
  }


  function checkvarious() {
    // remember re-select always does a stop() first!

    const debcheckri = true;
    if (debcheckri) {
      const ri = {
        sr: {},
        nc: {},
      };
      ri.sr.src = liveStream.context.sampleRate;
      ri.sr.dest = context.sampleRate;
      ri.nc.src = liveStream.channelCount;
      ri.nc.dest = context.destination.channelCount;
      fNOP();
      // TODO - resample & route if necc
    }

    const numchans = oanode.nChans;
    if (!validnumchans(numchans)) {
      console.log('INVALID NUM CHANS [' + numchans + ']');
      return;
    }
    console.log('IR[' + numchans + '] len samps @ ' + oanode.sampleRate + ' = ' + oanode.length);
  }


  // we may want to check there is not more than one mic & allow sel ?
  // ?http://www.html5rocks.com/en/tutorials/getusermedia/intro/ x MediaStreamTrack.getSources() is deprecated,
  // use MediaDevices.enumerateDevices()
  function initMicNOPROM() {
    if (!navigator.getUserMedia) {
      window.alert('getUserMedia not supported on your browser!');
      return;
    }
    const adevices = [];
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      console.log('enumerateDevices() not supported.');
      return;
    }

    // List cameras and microphones.
    navigator.mediaDevices.enumerateDevices()
    .then(function (devices) {
      devices.forEach(function (device) {
        console.log(device.kind + ': ' + device.label +
                    ' id = ' + device.deviceId);
        if (device.kind === 'audioinput' && device.deviceId === 'default') {
          // Strangely there can be duplicates of the default in the returned arrray
          adevices.push(device);
        } else {
          fNOP();
        }
      });
      if (adevices.length >= 1) {
        initmic2(adevices[0]);
      }
    })
    .catch(function (err) {
      console.log(err.name + ': ' + err.message);
    });

    function initmic2(audioSource) {
      const constraints = {
        audio: {
          sourceId: audioSource.deviceId,
        },
        video: false,
      };

      navigator.getUserMedia(
        constraints,
        function (stream) {
          liveStream = context.createMediaStreamSource(stream);
          liveStream.connect(gainmic2op);
          liveStream.connect(gainmic2conv);
          micrdy = true;
        },
        function (err) {
          console.log('The following gUM error occured: ' + err);
          micrdy = false;
        }
      );
    }
  }

  function fNOP() {}

  function init() {

    let tmp;
    tmp = document.getElementById('poplist');
    tmp.addEventListener('click', popList);
    tmp.style.visibility = 'hidden'; // vs 'visible'

    /*
    tmp = document.getElementById('getinfo');
    tmp.addEventListener('click', getInfo);
    tmp.style.visibility = 'hidden'; // vs 'visible'

    tmp = document.getElementById('useir');
    tmp.addEventListener('click', useIR);
    tmp.style.visibility = 'hidden'; // vs 'visible'
    */

    const debmyurlroot = window.location.href;

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();

    oanode = new WeaverLib.effects.OpenAirLibNode(context, oaserver);

    gainmic2op = context.createGain();
    gainmic2op.gain.value = 0.0;
    gainmic2conv = context.createGain();
    gainmic2conv.gain.value = 0.0;
    gainmic2op.connect(context.destination);
    gainmic2conv.connect(oanode.input);
    oanode.connect(context.destination);

    // devolve all connections to oanode into selconvSource WIP ~272

    navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia ||
      navigator.webkitGetUserMedia;
    /*
    chrome currently uses webkitGetUserMedia
    moz still allows depricated mozGUM but would prefer mediaDevices.GUM after enumerate devices
    safari doesnt support GUM at all.
    */
    if (!navigator.getUserMedia) {
      throw(new Error('getUserMedia not supported on your browser!'));
    }
    const adevices = [];
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      throw( new Errror('enumerateDevices() not supported.'));
    }

    // List cameras and microphones.
    const prom = navigator.mediaDevices.enumerateDevices();
    prom.then( devices => {
      devices.forEach( device => {
        console.log(device.kind + ': ' + device.label +
                     ' id = ' + device.deviceId);
        if (device.kind === 'audioinput' && device.deviceId === 'default') {
          // Strangely there can be duplicates of the default in the returned arrray
          adevices.push(device);
        } else {
          fNOP();
        }
      });
      if (adevices.length >= 1) {
        const audioSource = adevices[0];
        const constraints = {
          audio: {
            sourceId: audioSource.deviceId,
          },
          video: false,
        };
        navigator.getUserMedia(
          constraints,
          (stream => {
            liveStream = context.createMediaStreamSource(stream);
            liveStream.connect(gainmic2op);
            liveStream.connect(gainmic2conv);
            micrdy = true;
            return 0;
          }),
          (err => {
            micrdy = false;
            return Promise.reject('The following gUM error occured: ' + err);
          })
        );
      }
    })
    .catch( err => {
      return Promise.reject(err);
    });
    return prom;
  }


  // some generic handlers
  const onaccept = val => {
    console.log(`accept ${val}`);
    return 0;
  };

  const onreject = val => {
    console.log(`reject ${val}`);
    return 0;
  };

  const onacceptlist = vals => {
    // console.log(`accept ${vals}`); // Array[N] of Objects
    let len = vals.length;
    let i;
    myArr=[];
    for (i=0; i<len; i++) {
      let fileinfo = vals[i];
      consoleLogFileInfo(fileinfo);
      myArr.push(fileinfo);
    }
    listloaded = true;
    let tmp;
    tmp = document.getElementById('poplist');
    tmp.addEventListener('click', popList);
    tmp.style.visibility = 'visible'; // vs 'visible'
    return 0;
  };

  init()
  .then(oainfo.ver())
  .then(oainfo.list().then(onacceptlist))
  .catch(onreject);


}());

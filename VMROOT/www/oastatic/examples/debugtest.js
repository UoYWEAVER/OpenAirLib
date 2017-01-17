// debugtest.js
// OpenAirLib and OpenAirLibInfo tester
// K Brown and M Paradis
// test browse & debug debugtest.html
// note the async promises in test2 wont complete in sequence : this code is designed purely for debug-stepping through, and breakpointing

// sync

const WinAudioContext = window.AudioContext || window.webkitAudioContext;
let context = new WinAudioContext();

// open air node
let openairnode;
const loctestserver = 'http://localhost:3000';
//const oaserver = 'http://oadev.york.ac.uk/irserver';
const oaserver = 'http://www.openairlib.net/irserver';
// oaserver = loctestserver;
const oaserverstatic = `${oaserver}/oastatic`;
let dotesttone=true;
openairnode = new WeaverLib.effects.OpenAirLibNode(context, oaserver, dotesttone );

// step through as necc in debugger
openairnode.gain = 0;
openairnode.connect(context.destination);
// should hear test tone as gain == 1
openairnode.gain = 1;
openairnode.disconnect(context.destination);
openairnode.connect(context.destination);
openairnode.gain = 0;


openairnode = new WeaverLib.effects.OpenAirLibNode(context, oaserver ); // should default to false
openairnode.gain = 1;
// should not hear test tone.

// test2 - test all openairlibinfo functions
let openairinfo;
openairinfo = new WeaverLib.effects.OpenAirLibInfo(oaserver);

let result;

var dotests = [false, false, false, false, false, false, false];
dotests =     [true,  true,  true,  true,  true,  true,  true];



if(dotests[0]) {
  result = openairinfo.urlBase();
  console.log(result);
}

// eo sync, start of async

// some generic handlers
const onaccept = (val) => {
  console.log(`accept ${val}`);
};

const onreject = (val) => {
  console.log(`reject ${val}`);
};

const onrejectverbose = (val) => {
  const objtypestr = Object.prototype.toString.call(val);
  if (objtypestr === '[object Error]') {
    console.error(val);
  } else {
    console.log(`rejectverbose ${val}`);
  }
};

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

const onacceptlist = (vals) => {
  // console.log(`accept ${vals}`); // Array[N] of Objects
  let len = vals.length;
  let i;
  for (i=0; i<len; i++) {
    let fileinfo = vals[i];
    consoleLogFileInfo(fileinfo);
  }
};

// start of async tests

if(dotests[1]) {
  openairinfo.ver()
  .then(onaccept)
  .catch(onreject);
}

if(dotests[1]) {
  openairinfo.localRoot()
  .then(onaccept)
  .catch(onreject);
}

/* these all passed but periodically uncomment & recheck
*/
if(dotests[2]) {
  openairinfo.list()
  .then(onacceptlist)
  .catch(onreject);
}

if(dotests[3]) {
  var searchstr = 'Minster';
  openairinfo.search(searchstr)
  .then(onaccept)
  .catch(onreject);
}

if(dotests[4]) {
  var relurl = 'sites/default/files/auralization/data/audiolab/' +
    'york-minster/stereo/minster1_000_ortf_48k.wav';
  openairinfo.byrUrl(relurl)
  .then(onaccept)
  .catch(onreject);
}
//*/

if(dotests[5]) {
    console.log('test load triwave with new loader');

    const loader = new WeaverLib.core.AudioLoader(context);
    const requrl = `http://oadev.york.ac.uk/irserver/oastatic/10HzTri48k.wav`;
    //const requrl = `http://oadev.york.ac.uk/irserver/oastatic/10HzTri44k1.wav`;
    console.dir(requrl);

    const pr = loader.load(requrl);
    pr.then((result) => {
      if (result instanceof AudioBuffer) {
        const bufnchans = result.numberOfChannels;
        console.log('loaded ok, chans=' + bufnchans + ', sr=' + result.sampleRate );
      } else {
        console.log('AudioLoader result was not an audio buffer');
      }
    })
    .catch( (err) => {
      console.error(err);
    });
    /* this works post 14:55 161019 after edit audio-loader.js
    WAS
    return super._loadOne(url).then((data) => this._decode(data));
    NOW
    return super._loadOne(url).then((data) => {return this._decode(data)});
    BUT when change back to org it now WORKS????????

    */

}

///*

let mss;
let bsn;

// test3 - function to check can access result data from result object - OK
const dotest3 = fileinfo => {
  console.log(fileinfo.fid);
  console.log(fileinfo.nid);
  console.log(fileinfo.uid);
  console.log(fileinfo.title);
  console.log(fileinfo.filename);
  console.log(fileinfo.fs);
  console.log(fileinfo.chans);
  console.log(fileinfo.kftype);
  console.log(fileinfo.rt60_1K);
  console.log(fileinfo.SrcCat);
  console.log(fileinfo.GenVal);
  console.log(fileinfo.FrPg);
  console.log(fileinfo.email);
  console.log(fileinfo.cc_license);
  console.log(fileinfo.filepath); // should be relative at this stage
  const rurl = fileinfo.filepath;
  console.log(fileinfo.photopath);
  console.log(fileinfo.descn);
  return Promise.resolve(rurl);
};

// test4
const dotest4a = (rurl) => {
  console.log('start test4a with ');
  console.dir(rurl); // std google console truncates centre of v long urls!

  // recreate node in non-test-tone mode
  openairnode = new WeaverLib.effects.OpenAirLibNode(context, oaserver, false);
  openairnode.gain = 0;
  const prom = openairnode.load(rurl)
  .then((result) => {
    console.log(`test4a openairnode.load( url ) .then with ${result}`); // should be 'loaded ok'
    openairnode.connect(context.destination);
  })
  .catch((err) => {
    console.log(`test4a failed with ${err}`);
  });
  return prom;
};

const dotest4b = () => {
  console.log('start test4b');
  const audioloader = new WeaverLib.core.AudioLoader(context);
  const prom = audioloader.load(`${oaserverstatic}/10HzTri48k.wav`)
  .then((result) => {
    console.log(`test4b then ${result}`); // should be audio buffer
    bsn = context.createBufferSource();
    bsn.buffer = result;
    bsn.loop = true;
    const oaip = openairnode.input;
    oaip.gain = 0.85;
    openairnode.gain = 0.85; // output gain
    bsn.connect(oaip);

    // test other openairlibnode functions - debug step through these
    let val;
    val = openairnode.gain;
    console.log(`${val}`);
    val = openairnode.convs;
    console.log(`${val}`);
    val = openairnode.rURL;
    console.log(`${val}`);
    val = openairnode.nChans;
    console.log(`${val}`);
    val = openairnode.length;
    console.log(`${val}`);
    val = openairnode.sampleRate;
    console.log(`${val}`);
//    val = openairnode.contextNChans; <REMOVED - context doesnt have this property, only nodes do.
//    console.log(`${val}`);
    val = openairnode.input.channelCount;
    console.log(`${val}`);
    val = openairnode.output.channelCount;
    console.log(`${val}`);

  })
  .catch((err) => {
    console.log('test4b failed with');
    console.error(err);
  });
  return prom;
};

const dotest4c = () => {
  bsn.start(0);
  // see if can hear test sig convolved?
  console.log('start test4c');
  return Promise.resolve(0);
};

var fid
//fid = 444; // mono sportscentre
//fid = 491; // stereo Minster
fid = 98212; // BFormat Minster

openairinfo.byFid(fid)
.then((val) => {
  if (val !== undefined) {
    onaccept(val);
    // err checking
    let retval;
    let objtypestr = Object.prototype.toString.call(val);
    if (objtypestr === '[object Array]') {
      const len = val.length;
      if (len > 1) {
        console.log(`warning [val] len byFid should be 1 but len was ${len}: using [0]`);
        retval = val[0]; // return first
      } else if (len === 0) {
        throw new Error('[val] len was 0');
      } else {
        retval = val[0]; // ok one result
      }
    } else {
      throw new Error(`val not an array: type ${objtypestr}`);
    }
    console.log(`filepath:${retval.filepath}`);
    return retval;
  } else {
    throw new Error('val undefined');
  }
})
.then(dotest3)
.then(dotest4a)
.then(dotest4b)
.then(dotest4c)
.then(() => {
  console.log('Finshed Async');
  return Promise.resolve(0);
})
.catch(onrejectverbose);

//*/

console.log('Finshed Sync');

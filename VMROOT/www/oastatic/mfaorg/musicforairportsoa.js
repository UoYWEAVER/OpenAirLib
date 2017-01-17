/*

thanks to Tero Parviainen
http://teropa.info/blog/2016/07/28/javascript-systems-music.html

LOCAL TEST: infrastructure
from WEAVER/nodetest004 run node app < will start openair db server on 3000 >
from Teropa/code_mfa run serve –p 3001 –C <cant run serve 1st so it gets default port 3000 otherwise
would need to edit const oaserver (see below) from 3000 to 3001>

Now should be able to access this mfaviz js (via code_mfa/index.html) via localhost:3001 in chrome

HISTORY

160818 00:30
- musicforairportsnewviz successfully works (still using its own fetch etc)
- oa objects successflly created OK (test w debug)
- oainfo sync call to getURLBase WORKS
- oainfo.list .then sucessfully called: logs:'Database acquired 208 entries'
160902
- now uses an OpenAirLibNode as convolver node.
- uses OpenAirLibInfo to list for debug purposes
- select BFIDS[0,1,2 or 3] for HM,MH,KnP,YM resp, or view the list & info & select one.
- then get an rurl byFid(fid) as a promise, then call the oanod's load()  method with the rurl
- this requests that rurl from the server (currently at localhost:3000)
- NOTE: when connecting to an openairnode connect to thenode.input not thenode

- problems with 404 errs on fetch() - remove spaces and hashes from sample file paths - now no 404 or decode errs
- but 20/9/16 - no sample sounds??
*/

const VERBOSE_TEST = 1;

const SAMPLE_LIBRARY = {
  'GrandPiano': [
    {note: 'A',  octave: 4, file: 'Samples/GrandPiano/piano-f-a4.wav'},
    {note: 'A',  octave: 5, file: 'Samples/GrandPiano/piano-f-a5.wav'},
    {note: 'A',  octave: 6, file: 'Samples/GrandPiano/piano-f-a6.wav'},
    {note: 'C',  octave: 4, file: 'Samples/GrandPiano/piano-f-c4.wav'},
    {note: 'C',  octave: 5, file: 'Samples/GrandPiano/piano-f-c5.wav'},
    {note: 'C',  octave: 6, file: 'Samples/GrandPiano/piano-f-c6.wav'},
    {note: 'D#',  octave: 4, file: 'Samples/GrandPiano/piano-f-dsh4.wav'},
    {note: 'D#',  octave: 5, file: 'Samples/GrandPiano/piano-f-dsh5.wav'},
    {note: 'D#',  octave: 6, file: 'Samples/GrandPiano/piano-f-dsh6.wav'},
    {note: 'F#',  octave: 4, file: 'Samples/GrandPiano/piano-f-fsh4.wav'},
    {note: 'F#',  octave: 5, file: 'Samples/GrandPiano/piano-f-fsh5.wav'},
    {note: 'F#',  octave: 6, file: 'Samples/GrandPiano/piano-f-fsh6.wav'}
  ]
};

const OCTAVE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const LOOPS = [
  {instrument: 'GrandPiano', note: 'F4',  duration: 19.7, delay: 4},
  {instrument: 'GrandPiano', note: 'Ab4', duration: 17.8, delay: 8.1},
  {instrument: 'GrandPiano', note: 'C5',  duration: 21.3, delay: 5.6},
  {instrument: 'GrandPiano', note: 'Db5', duration: 18.5, delay: 12.6},
  {instrument: 'GrandPiano', note: 'Eb5', duration: 20.0, delay: 9.2},
  {instrument: 'GrandPiano', note: 'F5',  duration: 20.0, delay: 14.1},
  {instrument: 'GrandPiano', note: 'Ab5', duration: 17.7, delay: 3.1}
];

const LANE_COLOR = 'rgba(220, 220, 220, 0.3)';
const SOUND_COLOR = '#ED146F';


let audioContext = new AudioContext();
let loader = new WeaverLib.core.Loader();

// open air initial insert: test only @ pres
let openairnode;
const loctestserver = 'http://localhost:3000';
const oaserver = 'http://www.openairlib.net/irserver';
// oaserver = loctestserver;
const oaserverstatic = `${oaserver}/oastatic`;
openairnode = new WeaverLib.effects.OpenAirLibNode(audioContext, oaserver);

let openairinfo;
openairinfo = new WeaverLib.effects.OpenAirLibInfo(oaserver);
let result;
result = openairinfo.urlBase();
console.log(result);

let oaDataBase;

openairinfo.list()
.then(val => {
  oaDataBase = val;
  console.log('Database acquired %i entries', val.length );
})
.catch( err => {
  console.error( err );
});

let sampleCache = {}; // TODO i think!!!

let canvas = document.getElementById('music-for-airports');
let context = canvas.getContext('2d');

// Control variable, set to start time when playing begins
let playingSince = null;

function fetchSampleNOCACHE(path) {
  const fpath = encodeURIComponent(path);
  const prom = fetch(fpath)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer));
  return prom;
}

function fNOP() {}

function kfetch(xfpath) {
  // wrapper to debug test fetch
  var retval;
    retval = fetch(xfpath);
//  retval = loader.load(xfpath);
  return retval;
}

// use sampleCache
//https://www.sitepoint.com/implementing-memoization-in-javascript/
function fetchSample(path) {
  let fpath;
  // see http://stackoverflow.com/questions/75980/when-are-you-supposed-to-use-escape-instead-of-encodeuri-encodeuricomponent
  //fpath = encodeURIComponent(path);
  // doesnt encode the # so rename all sharp files to 'sh' not '#' & done encode
  fpath = path;
  
  if (sampleCache[fpath] !== undefined) {
    return( Promise.resolve(sampleCache[fpath]) );
  } else {
    fNOP(); // to fetch file
  }
  const prom = kfetch(fpath)
    .then(response => {
      return response.arrayBuffer(); // ?why brackets?
    })
    .then(arrayBuffer => {
      return audioContext.decodeAudioData(arrayBuffer);
    })
    .then(decodedAudioData => {
      sampleCache[fpath] = decodedAudioData;
      if (VERBOSE_TEST) {
        console.log('cached:' + fpath);
      }
      //return Promise.resolve(decodedAudioData);
      return (decodedAudioData);
    })
    .catch(err => {
      console.log('error fetching' + fpath);
      console.error(err);
    });
  return prom;
}

function noteValue(note, octave) {
  return octave * 12 + OCTAVE.indexOf(note);
}

function getNoteDistance(note1, octave1, note2, octave2) {
  return noteValue(note1, octave1) - noteValue(note2, octave2);
}

function getNearestSample(sampleBank, note, octave) {
  let sortedBank = sampleBank.slice().sort((sampleA, sampleB) => {
    let distanceToA = Math.abs(getNoteDistance(note, octave, sampleA.note, sampleA.octave));
    let distanceToB = Math.abs(getNoteDistance(note, octave, sampleB.note, sampleB.octave));
    return distanceToA - distanceToB;
  });
  return sortedBank[0];
}

function flatToSharp(note) {
  switch (note) {
    case 'Bb': return 'A#';
    case 'Db': return 'C#';
    case 'Eb': return 'D#';
    case 'Gb': return 'F#';
    case 'Ab': return 'G#';
    default:   return note;
  }
}

function getSample(instrument, noteAndOctave) {
  let [, requestedNote, requestedOctave] = /^(\w[b\#]?)(\d)$/.exec(noteAndOctave);
  requestedOctave = parseInt(requestedOctave, 10);
  requestedNote = flatToSharp(requestedNote);
  let sampleBank = SAMPLE_LIBRARY[instrument];
  let nearestSample = getNearestSample(sampleBank, requestedNote, requestedOctave);
  return fetchSample(nearestSample.file).then(audioBuffer => ({
    audioBuffer: audioBuffer,
    distance: getNoteDistance(requestedNote, requestedOctave, nearestSample.note, nearestSample.octave)
  }));
}

function playSample(instrument, note, destination, delaySeconds = 0) {
  getSample(instrument, note).then(({audioBuffer, distance}) => {
    let playbackRate = Math.pow(2, distance / 12);
    let bufferSource = audioContext.createBufferSource();

    bufferSource.buffer = audioBuffer;
    bufferSource.playbackRate.value = playbackRate;

    const oaip = destination.input;
    oaip.gain = 0.85;
    destination.gain = 0.85; // output gain

    bufferSource.connect(oaip);
    bufferSource.start(audioContext.currentTime + delaySeconds);
  });
}

function render() {
  context.clearRect(0, 0, 1000, 1000);

  context.strokeStyle = '#888';
  context.lineWidth = 1;
  context.moveTo(325, 325);
  context.lineTo(650, 325);
  context.stroke();

  context.lineWidth = 30;
  context.lineCap = 'round';
  let radius = 280;
  for (const {duration, delay} of LOOPS) {
    const size = Math.PI * 2 / duration;
    const offset = playingSince ? audioContext.currentTime - playingSince : 0;
    const startAt = (delay - offset) * size;
    const endAt = (delay + 0.01 - offset) * size;

    context.strokeStyle = LANE_COLOR;
    context.beginPath();
    context.arc(325, 325, radius, 0, 2 * Math.PI);
    context.stroke();

    context.strokeStyle = SOUND_COLOR;
    context.beginPath();
    context.arc(325, 325, radius, startAt, endAt);
    context.stroke();

    radius -= 35;
  }
  if (playingSince) {
    requestAnimationFrame(render);
  } else {
    context.fillStyle = 'rgba(0, 0, 0, 0.3)';
    context.strokeStyle = 'rgba(0, 0, 0, 0)';
    context.beginPath();
    context.moveTo(235, 170);
    context.lineTo(485, 325);
    context.lineTo(235, 455);
    context.lineTo(235, 170);
    context.fill();
  }
}

function startLoop({instrument, note, duration, delay}, nextNode) {
  playSample(instrument, note, nextNode, delay);
  return setInterval(
    () => playSample(instrument, note, nextNode, delay),
    duration * 1000
  );
}

/* OLD METHOD fetchSample('Samples/AirportTerminal.wav').then(convolverBuffer => {
  let convolver, runningLoops;
  canvas.addEventListener('click', () => {
    if (playingSince) {
      convolver.disconnect();
      runningLoops.forEach(l => clearInterval(l));
      playingSince = null;
    } else {
      convolver = audioContext.createConvolver();
      convolver.buffer = convolverBuffer;
      convolver.connect(audioContext.destination);
      playingSince = audioContext.currentTime;
      runningLoops = LOOPS.map(loop => startLoop(loop, convolver));
    }
    render();
  });
*/


// TO SUSS: for now use stereos but todo : use BF->hrtf->stereo? TBD?
// poss user selects speakers or headphones...
// & poss can rotate if BF? - use omnitone TBD
const BFIDS = [
  98298,  // HamMau
  98285,  // MaesHowe
  54217,  // koli summer 2 4w
  98212,    // YMinst
 ];
const STIDS = [
  642,
  98284,
  54160, // mono
  491
]

const fid = STIDS[1]; // @ pres edit this to select a signal to conv with

openairinfo.byFid(fid)
.then(val => {
  if (val !== undefined) {
    // err checking
    let fileinfo;
    let objtypestr = Object.prototype.toString.call(val);
    if (objtypestr === '[object Array]') {
      const len = val.length;
      if (len > 1) {
        console.log(`warning [val] len byFid should be 1 but len was ${len}: using [0]`);
        fileinfo = val[0]; // return first
      } else if (len === 0) {
        throw new Error('[val] len was 0');
      } else {
        fileinfo = val[0]; // ok one result
      }
    } else {
      throw new Error(`val not an array: type ${objtypestr}`);
    }
    if (VERBOSE_TEST) {
      console.log(`Info for fid:${fileinfo.fid}`);
      console.log(fileinfo.fid);
      //console.log(fileinfo.nid);
      //console.log(fileinfo.uid);
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
      console.log(fileinfo.photopath);
      console.log(fileinfo.descn);
    }
    return Promise.resolve(fileinfo.filepath);
  } else {
    throw new Error('val undefined');
  }
})
.then(theurl => {
  openairnode.load( theurl ).then(() => {
    let runningLoops;
    canvas.addEventListener('click', () => {
      if (playingSince) {
        openairnode.disconnect();
        runningLoops.forEach(l => clearInterval(l));
        playingSince = null;
      } else {
        openairnode.connect(audioContext.destination);
        playingSince = audioContext.currentTime;
        runningLoops = LOOPS.map(loop => startLoop(loop, openairnode));
      }
      render();
    });
    render();
  });
})
.catch(err => {
  console.log('failed with');
  console.error(err);
});

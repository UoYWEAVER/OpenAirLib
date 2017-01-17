/*

musicforairportsoa.js
Tero Parviainen
modified by K Brown
University of York
2016


thanks to Tero Parviainen
http://teropa.info/blog/2016/07/28/javascript-systems-music.html

Notes

LOCAL TEST: infrastructure
serve from oastatic
http://localhost:3000/code_mfa/mfaoa.html

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
161104
- look into change sample/shape/animate size/ change generative algorithm
161107
- look into change sample - add BaroqueBassoon
170117 path mow mfa and js file now mfaoa.js. Ed to use weaverlib.js and WeaverLib
*/

const VERBOSE_TEST = 0;

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
  ],
  'BaroqueBassoon': [
    {note: 'A',  octave: 4, file: 'Samples/BaroqueBassoon[Anechoic]/b2-sc-tt-split-01.wav'},
    {note: 'B',  octave: 4, file: 'Samples/BaroqueBassoon[Anechoic]/b2-sc-tt-split-02.wav'},
    {note: 'C',  octave: 4, file: 'Samples/BaroqueBassoon[Anechoic]/b2-sc-tt-split-03.wav'},
    {note: 'D',  octave: 4, file: 'Samples/BaroqueBassoon[Anechoic]/b2-sc-tt-split-04.wav'},
    {note: 'E',  octave: 4, file: 'Samples/BaroqueBassoon[Anechoic]/b2-sc-tt-split-05.wav'},
    {note: 'F',  octave: 4, file: 'Samples/BaroqueBassoon[Anechoic]/b2-sc-tt-split-06.wav'},
    {note: 'G',  octave: 4, file: 'Samples/BaroqueBassoon[Anechoic]/b2-sc-tt-split-07.wav'}
  ],
  'SpeeJ1': [
    {note: 'A',  octave: 4, file: 'Samples/speeJ1/01.wav'},
    {note: 'B',  octave: 4, file: 'Samples/speeJ1/02.wav'},
    {note: 'C',  octave: 4, file: 'Samples/speeJ1/03.wav'},
    {note: 'D',  octave: 4, file: 'Samples/speeJ1/04.wav'},
    {note: 'E',  octave: 4, file: 'Samples/speeJ1/05.wav'},
    {note: 'F',  octave: 4, file: 'Samples/speeJ1/06.wav'},
    {note: 'G',  octave: 4, file: 'Samples/speeJ1/07.wav'}
  ],
  'Koli': [
    {note: 'C',  octave: 4, file: 'Samples/Koli/146804__ldezem__6-ppo-konserni-tuntematon-noudettu-2012.wav'},
    {note: 'F',  octave: 5, file: 'Samples/Koli/23250__schulze__girl-from-finland-counts-1-to-6.wav'},
  ]

};

const OCTAVE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const LOOPSBB1 = [
  {instrument: 'BaroqueBassoon', note: 'Db4',  midinote: 61, duration: 11.7, delay: 4},
  {instrument: 'BaroqueBassoon', note: 'Eb4', midinote: 63, duration: 11.8, delay: 8.1},
  {instrument: 'BaroqueBassoon', note: 'Gb4',  midinote: 66, duration: 12.3, delay: 5.6},
  {instrument: 'BaroqueBassoon', note: 'Ab4', midinote: 68, duration: 13.5, delay: 12.6},
  {instrument: 'BaroqueBassoon', note: 'Bb4', midinote: 70, duration: 14.0, delay: 9.2},
  {instrument: 'BaroqueBassoon', note: 'Db5',  midinote: 73, duration: 15.0, delay: 14.1},
  {instrument: 'BaroqueBassoon', note: 'Eb5', midinote: 75, duration: 16.7, delay: 3.1}

];

const LOOPSBB2 = [
  {instrument: 'SpeeJ1', note: 'A4',  midinote: 69, duration: 2, delay: 0.0},
  {instrument: 'SpeeJ1', note: 'B4', midinote: 71, duration: 3, delay: 0.3},
  {instrument: 'SpeeJ1', note: 'C4',  midinote: 72, duration: 5/2, delay: 0.6},
  {instrument: 'SpeeJ1', note: 'D4', midinote: 74, duration: 7/2, delay: 0.9},
  {instrument: 'SpeeJ1', note: 'E4', midinote: 76, duration: 11/4, delay: 1.2},
  {instrument: 'SpeeJ1', note: 'F4',  midinote: 77, duration: 13/4, delay: 1.5},
  {instrument: 'SpeeJ1', note: 'G4', midinote: 79, duration: 17/4, delay: 1.8}
];

const LOOPSBB3 = [
  {instrument: 'Koli', note: 'F3',  midinote: 65, duration: 19.7, delay: 4},
  {instrument: 'Koli', note: 'Ab4', midinote: 68, duration: 17.8, delay: 8.1},
  {instrument: 'Koli', note: 'C5',  midinote: 72, duration: 21.3, delay: 5.6},
  {instrument: 'Koli', note: 'Db5', midinote: 73, duration: 28.5, delay: 12.6},
  {instrument: 'Koli', note: 'Eb5', midinote: 75, duration: 30.0, delay: 9.2},
  {instrument: 'Koli', note: 'F5',  midinote: 77, duration: 30.1, delay: 14.1},
  {instrument: 'Koli', note: 'Ab6', midinote: 80, duration: 31.7, delay: 3.1}
];

const BB4FAC = 3;
const LOOPSBB4 = [
  {instrument: 'SpeeJ1', note: 'A4',  midinote: 69, duration: 2*BB4FAC, delay: 0.0},
  {instrument: 'SpeeJ1', note: 'B4', midinote: 71, duration: 3*BB4FAC, delay: 0.3},
  {instrument: 'SpeeJ1', note: 'C4',  midinote: 72, duration: 5/2*BB4FAC, delay: 0.6},
  {instrument: 'SpeeJ1', note: 'D4', midinote: 74, duration: 7/2*BB4FAC, delay: 0.9},
  {instrument: 'SpeeJ1', note: 'E4', midinote: 76, duration: 11/4*BB4FAC, delay: 1.2},
  {instrument: 'SpeeJ1', note: 'F4',  midinote: 77, duration: 13/4*BB4FAC, delay: 1.5},
  {instrument: 'SpeeJ1', note: 'G4', midinote: 79, duration: 17/4*BB4FAC, delay: 1.8}
];

/*
const LOOPSSPARE1 = [
  {instrument: 'GrandPiano', note: 'F4',  midinote: 65, midinote: 65, duration: 19.7, delay: 4},
  {instrument: 'GrandPiano', note: 'Ab4', midinote: 68, duration: 17.8, delay: 8.1},
  {instrument: 'GrandPiano', note: 'C5',  midinote: 72, duration: 21.3, delay: 5.6},
  {instrument: 'GrandPiano', note: 'Db5', midinote: 73, duration: 18.5, delay: 12.6},
  {instrument: 'GrandPiano', note: 'Eb5', midinote: 75, duration: 20.0, delay: 9.2},
  {instrument: 'GrandPiano', note: 'F5',  midinote: 77, duration: 20.0, delay: 14.1},
  {instrument: 'GrandPiano', note: 'Ab5', midinote: 80, duration: 17.7, delay: 3.1}
];

const LOOPSSPARE2 = [
  {instrument: 'BaroqueBassoon', note: 'F4',  midinote: 65, duration: 19.7, delay: 4},
  {instrument: 'BaroqueBassoon', note: 'Ab4', midinote: 68, duration: 17.8, delay: 8.1},
  {instrument: 'BaroqueBassoon', note: 'C5',  midinote: 72, duration: 21.3, delay: 5.6},
  {instrument: 'BaroqueBassoon', note: 'Db5', midinote: 73, duration: 18.5, delay: 12.6},
  {instrument: 'BaroqueBassoon', note: 'Eb5', midinote: 75, duration: 20.0, delay: 9.2},
  {instrument: 'BaroqueBassoon', note: 'F5',  midinote: 77, duration: 20.0, delay: 14.1},
  {instrument: 'BaroqueBassoon', note: 'Ab5', midinote: 80, duration: 17.7, delay: 3.1}
];
*/


let LOOPS;

const minmidinote = 61;
const maxmidinote = 80;

let audioContext = new AudioContext();
let loader = new WeaverLib.core.Loader();

// open air initial insert: test only @ pres
let openairnode;
const loctestserver = 'http://localhost:3000';
//const oaserver = 'http://oadev.york.ac.uk/irserver';
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

let sampleCache = {};

const canvas = document.getElementById('music-for-airports');

const Cwd = canvas.width;
const Cht = canvas.height;
const context = canvas.getContext('2d');
const currbackgroundIm = new Image();

let canvBG = document.createElement('canvas');
canvBG.width = Cwd;
canvBG.height = Cht;
let canvOLD = document.createElement('canvas');
canvOLD.width = Cwd;
canvOLD.height = Cht;
let canvNEW = document.createElement('canvas');
canvNEW.width = Cwd;
canvNEW.height = Cht;
const canvC = document.createElement('canvas');
canvC.width = Cwd;
canvC.height = Cht;

xpClear( canvOLD );
xpClear( canvNEW );
xpClear( canvC );
let bgcached = false;

let curind1 = 0;

// Control variable, set to start time when playing begins
let playingSince = null;
let runningloops = undefined;
let bufferSources = [];
let loopids=[];

function startloops() {
  openairnode.connect(audioContext.destination);
  playingSince = audioContext.currentTime;
  runningLoops = LOOPS.map(loop => {
    loopids.push(startLoop(loop, openairnode));
  });
  render();
}

canvas.addEventListener('click', () => {
  if (playingSince) {
    reset();
    playingsince = null;
  } else {
    startloops();
  }
});

function zapBS() {
  for( bs in bufferSources ) {
    bufferSources[bs].stop();
  }
  while (bufferSources.length){
    bufferSources.pop();
  }
  bufferSources = [];
  for( id in loopids ) {
    clearInterval(loopids[id]);
  }
  loopids = [];
}

function reset() {
  if (runningloops !== undefined) {
    runningLoops.forEach(l => clearInterval(l));
    runningloops = undefined;
  }
  if (openairnode !== undefined) {
      openairnode.disconnect();
  }
  playingSince = null;
  zapViz();
  zapBS();
}

function xpClear( xcanv ) {
  const dcontext = xcanv.getContext('2d');
  dcontext.globalAlppha = 1.0;
  dcontext.fillStyle = 'rgba(0, 0, 0, 0.0)';
  dcontext.clearRect(0, 0, Cwd, Cht);
}

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
  const  retval = fetch(xfpath);
  // retval = loader.load(xfpath);
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
      return response.arrayBuffer();
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
  if( sampleBank === undefined || Object.prototype.toString.call( sampleBank ) !== '[object Array]' ) {
    console.log( 'DEV ERROR 197' );
    return undefined;
  }
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
  if ( sampleBank === undefined ) {
    throw new Error("sampleBank === undefined");
  }

  let nearestSample = getNearestSample(sampleBank, requestedNote, requestedOctave);
  if ( nearestSample === undefined ) {
    throw new Error("nearestSample === undefined");
  }
  if ( nearestSample.file === undefined ) {
    throw new Error("nearestSample.file === undefined");
  }
  return fetchSample(nearestSample.file).then(audioBuffer => ({
    audioBuffer: audioBuffer,
    distance: getNoteDistance(requestedNote, requestedOctave, nearestSample.note, nearestSample.octave)
  }));
}

function playSample(instrument, note, destination, delaySeconds = 0) {
  getSample(instrument, note)
  .then(({audioBuffer, distance}) => {
    let playbackRate = Math.pow(2, distance / 12);
    let bufferSource = audioContext.createBufferSource();

    bufferSource.buffer = audioBuffer;
    bufferSource.playbackRate.value = playbackRate;

    const oaip = destination.input;
    oaip.gain = 0.85;
    destination.gain = 0.85; // output gain

    bufferSource.connect(oaip);
    bufferSource.start(audioContext.currentTime + delaySeconds);
    bufferSources.push(bufferSource);
  })
  .catch((err) => {
    console.log("playSample problem: i="+instrument+", n="+note+", d="+distance);
    console.error(err);
  });
}

function soundWidth( orgrad, maxw, minw, phase, item ) {
  if ( item == 0 ) {
    fNOP();
  }
  const wval = orgrad*((1/(((1-phase)*2)+0.01))-0.99);
  let retval = Math.max( wval, minw );
  retval = Math.min( retval, maxw );
  if( phase < .01 ) {
    retval = orgrad;
  }
  return retval;
}

function genColourNU( amt, opac, origcolourstr, mode ) {
  // mode 'shifthue'
  // mode 'shiftopac'
  // mode 'both'
  let rgbc = new RGBColor( origcolourstr );
  const hsl = rgb2hsl( rgbc.r, rgbc.g, rgbc.b );
  if (mode == undefined) {
    hsl.h += (amt*360);
    const tmp = rem(hsl.h, 360);
    hsl.h = Math.floor(tmp);
  }
  const rgb = hsl2rgb( hsl.h, hsl.s, hsl.l );
  const rgbs = "#"+rgb.r+rgb.g+rgb.b;
  rgbc = new RGBColor( rgbs );
  rgbc.setAlpha(Math.floor(opac*255));
  return rgbc.toRGBA();
}

function rem( nnn, mod ) {
  let t1 = nnn/mod;
  t1 = Math.floor(t1);
  return nnn-(t1*mod);
}

//const LANE_COLORA = 'rgba(220, 220, 220, 0.5)';
//const LANE_COLOR = 'rgb(255, 210, 220)';
const laneopac = 0.35;
const aRbLaneColours = [
  `rgba(209,   0,   0, ${laneopac})`,
  `rgba(255, 102,  34, ${laneopac})`,
  `rgba(255, 218,  33, ${laneopac})`,
  `rgba( 51, 221,   0, ${laneopac})`,
  `rgba( 17,  51, 204, ${laneopac})`,
  `rgba( 34,   0, 102, ${laneopac})`,
  `rgba( 51,   0,  68, ${laneopac})`
];
const aRbColours = [
  [209,   0,   0], //r
  [255, 102,  34], //o
  [255, 218,  33], //y
  [ 51, 221,   0], //g
  [ 17,  51, 204], //b
  [ 34,   0, 102], //i
  [ 51,   0,  68]  //v
];
const aIndColours = [ // hm/mh/koli/ym resp
  [ 51,   0,  68],  //v
  [ 17,  51, 204], //b
  [ 51, 221,   0], //g
  [255, 218,  33], //y
];
const mutators = [
[1,1,1,-1],
[1,1,-1,-1],
[1,-1,1,-1],
[-1,-1,1,-1]
];


function roundArray( ar ) {
  const retval=[];
  for( let i=0; i< ar.length; i++ ) {
    retval[i] = Math.round( ar[i] );
  }
  return retval;
}

function makeCStrColourRGB( rgbT ) {
  rgbT = roundArray( rgbT );
  return `rgb(${rgbT[0]},${rgbT[1]},${rgbT[2]})`;
}

function makeCStrColourRGBA( rgbQ ) {
  const rgbZ = roundArray( rgbQ );
  return `rgba(${rgbZ[0]},${rgbZ[1]},${rgbZ[2]},${rgbQ[3]})`;
}


// note see http://www.w3schools.com/cssref/css_colors_legal.asp can directly do hsl with hsla(120, 60%, 70%, 0.3)
function genDotColour( ring06, phase01, thisind1, opac ) {
  // this sets dort colour same as ring colour...
  let rgbc = aRbColours[ring06];
  // OR - key it on thisind1
  rgbc = aIndColours[thisind1-1];
  const hsl = rgb2hsl( rgbc[0], rgbc[1], rgbc[2] );
  let hslH = hsl.h; // MOD HUE HERE!!!
  hslH = hslH + 0.1 * ring06/6;
  if (hslH > 1) {
    hslH = hslH-1;
  }
  const rgb = hsl2rgb( hslH, hsl.s, hsl.l );
  const thresh = .01;
  if (phase01 < thresh) {
    rgb.r=255;
    rgb.g=255;
    rgb.b=255;
    opac = 1.0;
  }
  const rgba = makeCStrColourRGBA([rgb.r, rgb.g, rgb.b, opac]);
  return rgba;
}

const SOUND_COLORA = 'rgba(30, 0, 250, 0.5)';
const SOUND_COLOR = 'rgb(30, 0, 250)';


function render() {
  if (chkCacheBG()) {
    doDraw(canvNEW.getContext('2d'));
    postDraw();
  }
  if (playingSince) {
    requestAnimationFrame(render);
  } else {
    context.fillStyle = 'rgba(0, 0, 0, 0.5)';
    context.strokeStyle = 'rgba(0, 0, 0, 0)';
    context.beginPath();
    context.moveTo(235, 170);
    context.lineTo(485, 325);
    context.lineTo(235, 455);
    context.lineTo(235, 170);
    context.fill();
  }
}

function dropAlpha(ctx, iasub ) {
  const lastImage = ctx.getImageData(0,0,Cwd,Cht);
  const pixelData = lastImage.data;

  const len=pixelData.length;
  // rgba[0],rgba[1]...rgba[l-1]
  for (i=3; i<len; i += 4) {
    pixelData[i] -= iasub;
    if (pixelData[i] < 0) {
      pixelData[i] = 0;
    }
  }
  ctx.putImageData(lastImage,0,0);
}

function mutateRGBA(ctx, rgbaMUT ) {
  const lastImage = ctx.getImageData(0,0,Cwd,Cht);
  const pixelData = lastImage.data;

  const len=pixelData.length;
  let ind=0;
  // rgba[0],rgba[1]...rgba[l-1]
  for (let i=0; i<len; ) {
    pixelData[i++] += rgbaMUT[0];
    pixelData[i++] += rgbaMUT[1];
    pixelData[i++] += rgbaMUT[2];
    if (pixelData[i] < rgbaMUT[3]) {
      pixelData[i++] = 0;
    } else {
      pixelData[i++] += rgbaMUT[3];
    }
  }
  ctx.putImageData(lastImage,0,0);
}

function postDraw() {
  const canvCctx = canvC.getContext('2d');
  canvCctx.drawImage( canvBG, 0, 0, Cwd, Cht );
  canvCctx.drawImage( canvOLD, 0, 0, Cwd, Cht );
  canvCctx.drawImage( canvNEW, 0, 0, Cwd, Cht );
  context.drawImage( canvC, 0, 0, Cwd, Cht );

  const canvOLDctx = canvOLD.getContext('2d');
  //dropAlpha(canvOLDctx, 1 );
  mutateRGBA(canvOLDctx, mutators[curind1-1] );
  canvOLDctx.drawImage( canvNEW, 0, 0, Cwd, Cht );
  xpClear( canvNEW );
}

function chkCacheBG() {
  return bgcached;
}

function drawBG(dcontext) {
  dcontext.strokeStyle = '#888';
  dcontext.lineWidth = 1;
  dcontext.moveTo(Cwd/2, Cht/2);
  dcontext.lineTo(Cwd*.9, Cht/2);
  dcontext.stroke();

  dcontext.lineCap = 'round';
  let currringradius = 280;
  const sndlinelen = 0.01;
  const nn = LOOPS.length;
  dcontext.lineWidth = 30;
  for (let i=0;i<nn; i++) {
    // lane rings
    //dcontext.strokeStyle = genColour( i/7, 0.4, LANE_COLOR );
    let ss = aRbLaneColours[i];
    dcontext.strokeStyle = ss;
    dcontext.beginPath();
    dcontext.arc(Cwd/2, Cht/2, currringradius, 0, 2 * Math.PI);
    dcontext.stroke();
    currringradius -= 35;
  }
}

function doDraw(dcontext) {
  let currringradius = 280;
  const sndlinelen = 0.01;
  dcontext.lineCap = 'round';
  dcontext.lineWidth = 30;
  let i=0;
  // sound dots/capsules
  for (const {duration, delay, note, midinote} of LOOPS) {
    const size = Math.PI * 2 / duration;
    const offset = playingSince ? audioContext.currentTime - playingSince : 0;
    const startAt = (delay - offset) * size;
    const endAt = (delay + sndlinelen - offset) * size;

    const coffset = rem(startAt, 2*Math.PI);
    const phase = 1-(coffset/(2*Math.PI)); // map to 0:1 from rotn round circle from 3Oclock
    let opac = (1-phase)*0.8; // scale down & offset up so never hits min or max opacity
    opac = opac+0.2;
    if( i === 0 ) {
      fNOP(); // so can debug breakpont
    }
    const soundwidth = soundWidth(30, 50, 8, phase, i);
    dcontext.lineWidth = soundwidth;
    const ss = genDotColour( i, phase, curind1, opac );
    dcontext.strokeStyle = ss;
    dcontext.beginPath();
    dcontext.arc(Cwd/2, Cht/2, currringradius, startAt, endAt);
    dcontext.stroke();

    currringradius -= 35;
    i++;
  }
}

function startLoop({instrument, note, duration, delay}, nextNode) {
  playSample(instrument, note, nextNode, delay);
  return setInterval(
    () => playSample(instrument, note, nextNode, delay),
    duration * 1000
  );
}

function populateInfo(infobj) {
  tmp = document.getElementById('tainfo');
  if (tmp === undefined) {
    return;
  }
  const infotxt = formInfo(infobj); // get text from obj
  tmp.innerText = infotxt;
}

function formInfo(obj) {
  const ignores = [
    "nid",
    "fid",
    "uid",
    "kftype",
    "email",
    "frpg"
  ];
  function toignore( pp ) {
    let pi;
    for (pi in ignores) {
      if ( ignores[pi] === pp ) {
        return true;
      }
    }
    return false;
  }
  let str = '';
  let p;
  for (p in obj) {
    if ( toignore(p) ) {
      continue;
    }
    if (obj.hasOwnProperty(p)) {
      if ( p === 'descn' ) {str+='\n'};
      str += p + '::' + obj[p] + '\n';
    }
  }
  return str;
}

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
];
const NAMES = [
  'HamMausu.  ',
  'MaesHowe   ',
  'Koli N.P.  ',
  'Yrk Minstr.',
];

let fid;
let eventadded = false;

function newIR(index0) {
  fid = BFIDS[index0];
  let prom = openairinfo.byFid(fid);
  prom.then(val => {
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
      populateInfo(fileinfo);
      return Promise.resolve(fileinfo.filepath);
    } else {
      throw new Error('val undefined');
    }
  })
  .then(theurl => {
    openairnode.load( theurl ).then(() => {
      //loop openairnode.convs[ALL].normalise = true; // OK - defaults to true anyway!
      return Promise.resolve(0);
    });
  })
  .catch(err => {
    console.log('NewIR failed with');
    console.error(err);
  });
  return prom;
}

function setPressed( indorcode ) {
  let aebuts = document.getElementsByTagName('button');
  if (indorcode == 0 ) {
    for ( let i=0; i<aebuts.length; i++ ) {
      let me = aebuts[i];
      me.style.backgroundColor = 'white';
    }
  } else {
    aebuts[indorcode-1].style.backgroundColor = '#eeeeee';
  }
}


function zapViz() {
  xpClear( canvOLD );
  xpClear( canvNEW );
}

function setCanvBG(ind1) {
  const cfns = [
    "hmc-bw.jpg",
    "mh-bw.jpg",
    "koli-bw.jpg",
    "ym-bw.jpg"
  ];
  bgcached = false;
  currbackgroundIm.onload = function () {
    zapViz();
    console.log('Im.onload');
    try {
      const dcontext = canvBG.getContext('2d');
      dcontext.drawImage(currbackgroundIm,0,0,Cwd,Cht);
      drawBG(dcontext);
      bgcached = true;
    }
    catch(err) {
      console.log('Im.onload threw');
    }
  };
  console.log('Im.changesource');
  currbackgroundIm.src = "./images_bw/"+cfns[ind1-1];
  console.log('Im.sourcechganged');
}


function procClick( ind1 ) {
  reset();
  setPressed(0);
  setPressed(ind1);
  curind1 = ind1;
  setCanvBG(ind1);
  if (ind1 == 1 )
    LOOPS = LOOPSBB1;
  if (ind1 == 2 )
    LOOPS = LOOPSBB2;
  if (ind1 == 3 )
    LOOPS = LOOPSBB3;
  if (ind1 == 4 )
    LOOPS = LOOPSBB4;
  newIR(ind1-1).then(() => {
    startloops();
  });
}

let aebuts;
let ebutx;
aebuts = document.getElementsByTagName( 'button' );
for ( let i=0; i<aebuts.length; i++ ) {
  let me = aebuts[i];
  me.style.backgroundColor = 'white';
  me.innerText = NAMES[i];
  me.addEventListener( 'click', function () {
    procClick(i+1);
  });
}

ebutx = document.getElementById( 'b2' );
ebutx.click();

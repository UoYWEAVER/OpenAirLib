//ytr.js

kglobs.urls = [];

// CONFIG vid urls and Shoot locs:
kglobs.urls[0] = "ytr_sherlock_S1b_G.mp4";  // A29
kglobs.urls[1] = "ytr_sherlock_S1b_UC.mp4"; // A23
kglobs.urls[2] = "ytr_sherlock_S1b_DC.mp4"; // A22
kglobs.urls[3] = "ytr_sherlock_S1b_S.mp4";  // G13

kglobs.OMNITONE_GAIN = 24.0; // db, *** CONFIG GAIN ***

// eo config

var buildAG;
var rotateAG;

// *** MISC HOOK FUNCS 

function xmlvideoready() {

  if ( kglobs.krp === undefined ) {
    console.log("xmlvideoready:!kglobs.krp yet");
    return;
  }  
  if (kglobs.krp.krpano === undefined) {
    console.log("xmlvideoready:!kglobs.krp.krpano yet");
    return;
  } else {
    //kglobs.krp.krpano.call("trace(view.hlookat);trace(view.vlookat);trace(view.fov);");
    //kglobs.krp.krpano.get();
    console.log("xmlvideoready");
  }    

  if (kglobs.krp.video === undefined) {
    console.log("xmlvideorady:!kglobs.krp.video yet");
    return;
  }
  
  //kglobs.krp.krpano.call("trace(xmlonviewchange)");
  
  if (kglobs.agbuilt === undefined) {
    try {
      var view = kglobs.krp.krpano.get("view");
      buildAG();
    }
    catch(err) {
      kglobs.agbuilt = false;
      console.log("xmlvideoready buildAG threw");
    }  
  }
  xmlonbutton1();
}

function xmlonbutton1() {
  console.log("xmlbutton1");
  dokrpbutton(0);
}
function xmlonbutton2() {
  console.log("xmlbutton2");
  dokrpbutton(1);
}
function xmlonbutton3() {
  console.log("xmlbutton3");
  dokrpbutton(2);
}
function xmlonbutton4() {
  console.log("xmlbutton4");
  dokrpbutton(3);
}

function dokrpbutton(index0) {
  if (kglobs.krp===undefined) {
    console.log("dokrpbutton:!kglobs.krp");
    return;
  }
  if (!kglobs.krp.ready) {
    console.log("dokrpbutton:!kglobs.krp.ready");
    return;
  }
  if (!kglobs.krp.video===undefined) {
    console.log("dokrpbutton:!kglobs.krp.video");
    return;
  }
  console.log("dokrpbutton:kglobs.krp.ready:index0="+index0);
  krpano = kglobs.krp.krpano; 
  var cmd;
  
  function enableButtons() {
    for (var butno = 1; butno <= 4; butno++ ) {
      if ( butno-1 == index0 ) {
        cmd = `set(plugin[button${butno}].alpha, "0.6")`;
      } else {
        cmd = `set(plugin[button${butno}].alpha, "1.0")`;
      }
      krpano.call(cmd);
      cmd = `set(plugin[button${butno}].enabled,"true")`;
      krpano.call(cmd);
    }
  }
  
//  if ( kglobs.krp.videordyeventadded === undefined ) { 
//    kglobs.krp.video.addEventHandler( "canplay", enableButtons );
//    kglobs.krp.videordyeventadded = true;
//  }

  kglobs.krp.video.oncanplay = enableButtons;
  
  // disable buttons to stop re-presses
  for (var butno = 1; butno <= 4; butno++ ) {
    cmd = `set(plugin[button${butno}].enabled,"false")`;
    krpano.call(cmd);
    if ( butno-1 == index0 ) {
      cmd = `set(plugin[button${butno}].alpha, "0.6")`;
    } else {
      cmd = `set(plugin[button${butno}].alpha, "0.2")`;
    }
    krpano.call(cmd);
  }
  // play vid
  cmd = `plugin[video].playvideo('${kglobs.urls[index0]}')`;
  krpano.call(cmd);
  
  //window.setTimeout( enableButtons, 1500 );   
  // (online suggests 150mS OK)
  //console.log("WIP");
}




// WITH WHICH EVENTUALLY TO ROTATE AUDIO
function xmlonviewchange() {
  // hhm this seems to be more like frame change???

  // gets called once before krp ready so return if not!
  if ( kglobs.krp === undefined )
    return;
  
  if ( kglobs.krp.krpano === undefined ) {
    console.log("xmlonviewchange:!kglobs.krp.krpano yet");
    return;
  } 

  if (kglobs.krp.video === undefined) {
    console.log("xmlonviewchange:!kglobs.krp.video yet");
    return;
  }
  
  //kglobs.krp.krpano.call("trace(xmlonviewchange)");
  
  var view = kglobs.krp.krpano.get("view");

  if( kglobs.ptr === undefined ) {
    kglobs.ptr = {};
    kglobs.ptr.oPan  = 0;
    kglobs.ptr.oTilt = 0;
    kglobs.ptr.oRoll = 0;
    kglobs.ptr.pan  = 0;
    kglobs.ptr.tilt = 0;
    kglobs.ptr.roll = 0;
    // note these are always same 'phase' as lookats & rolls returned from krpano!
    //
  }
  
  kglobs.ptr.pan  = view.hlookat;
  kglobs.ptr.tilt = view.vlookat;
  kglobs.ptr.roll = view.camroll;
  
  if(kglobs.ptr.pan != kglobs.ptr.oPan ||
    kglobs.ptr.roll != kglobs.ptr.oRoll ||
    kglobs.ptr.tilt != kglobs.ptr.oTilt) {
    
    if ( kglobs.agbuilt === undefined ) {
      try {
        buildAG();
      }
      catch(err) {
        kglobs.agbuilt = false;
        console.log("xmlonviewchange buildAG threw");
      }  
    }
    if (kglobs.agbuilt === true) {
      try {
        var LOG_PTR = true;
        if (LOG_PTR) {
          console.log( "Pan:" + kglobs.ptr.pan + " Tilt:" + kglobs.ptr.tilt + " Roll:" + kglobs.ptr.roll );
        }
        
        var PANDIRADJ = -1;
        var TILTDIRADJ = -1;
        var ROLLDIRADJ = -1;
        var ipan = kglobs.ptr.pan * PANDIRADJ;
        var itilt = kglobs.ptr.tilt * TILTDIRADJ;
        var iroll = kglobs.ptr.roll * ROLLDIRADJ;
        // CHANGE SIGNS HERE AS NECC WRT GRAPHICS vals
        rotateAG( ipan, itilt, iroll );
      }
      catch(err) {
        console.log("xmlonviewchange rotateAG threw");
      }
    }  
           
    kglobs.ptr.oPan = kglobs.ptr.pan;
    kglobs.ptr.oTilt = kglobs.ptr.tilt;
    kglobs.ptr.oRoll = kglobs.ptr.roll;
    console.log("xmlonviewchange change detected");
  }
} 

// ? may need to check SN3D conv been done correctly, inc condon-shortley phase inversions ?  
  
function buildAGStd() {
  kglobs.aud = {};
  kglobs.aud.ac = new( AudioContext );
  
  var videlem = kglobs.krp.video;
  var options={};
  options.HRTFSetUrl = kglobs.libpath+"/resources";
  options.postGainDB = kglobs.OMNITONE_GAIN;
  kglobs.aud.omdecoder = Omnitone.createFOADecoder(kglobs.aud.ac, videlem, options );
  kglobs.aud.omdecoder.initialize()
  .then( () => {
    kglobs.agbuilt = true;
  });
}

function rotateAG_m3d(xpan, xtilt, xroll) { // as omnitone demo except includes roll
  if (xroll != 0 && (kglobs.warn_Roll !== false)) {
    console.log('rotateAG_m3:roll not handled<report once only>');
    // test mode via buttons ALLOW roll though
    kglobs.warn_Roll = false;
  }
  if (kglobs.aud.rotmat === undefined) {
    kglobs.aud.rotmat = mat3.create();
  }
  var order = 'YXZ';
  var orientation4 = getPoseArray4(xtilt, xpan, xroll, order);
  var rotationQuaternion = new THREE.Quaternion();
  quat.invert(rotationQuaternion, orientation4);
  mat3.fromQuat(kglobs.aud.rotmat, rotationQuaternion);
  kglobs.aud.omdecoder.setRotationMatrix(kglobs.aud.rotmat);
}

function getPoseArray4(phi, theta, roll, order) {
  var gips = {};
  
  gips.orientation = new THREE.Quaternion();
  gips.orientationOut = new Float32Array(4);
  
  gips.euler = new THREE.Euler();
  var degtorad = Math.PI / 180.0;

  gips.euler.set(phi*degtorad, theta*degtorad, roll*degtorad, order);
  gips.orientation = new THREE.Quaternion();
  gips.orientation.setFromEuler(gips.euler);

  gips.orientationOut[0] = gips.orientation.x;
  gips.orientationOut[1] = gips.orientation.y;
  gips.orientationOut[2] = gips.orientation.z;
  gips.orientationOut[3] = gips.orientation.w;
  return gips.orientationOut;
}


function fNOP() {;}

// *** DEV CONFIG ***
buildAG = buildAGStd;
rotateAG = rotateAG_m3d;

fNOP();
// eo dev config




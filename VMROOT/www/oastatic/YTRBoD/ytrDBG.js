//ytr.js

kglobs.urls = [];

/* TEST COMPARE AAC vs mapped vorbis encoding
ie
 $FFMPATH/ffmpeg -i $NOAVFILE -i $AMBFILE -c:v copy -c:a aac $OPVFILE
VS
 $FFMPATH/ffmpeg -i $NOAVFILE -guess_layout_max 4 -i $AMBFILE \
  -map_channel 1.0.0 -map_channel 1.0.1 -map_channel 1.0.2 -map_channel 1.0.3 -c:v copy -c:a libvorbis $OPVFILE
*/

//kglobs.urls[0] = "ytr_sherlock_S1b_G.mp4";

kglobs.urls[0] = "test1d.kava.amb.mp4";
kglobs.urls[1] = "outputAmbixVorbis.mp4";

//kglobs.urls[1] = "ytr_sherlock_S1b_UC.mp4";
kglobs.urls[2] = "ytr_sherlock_S1b_amv_UC.mp4";
kglobs.urls[3] = "ytr_sherlock_S1b_UC.mp4";

// results: both above pairs performed equally well on mac/chrome/local
// not tested vorbis on android 

//kglobs.urls[2] = "ytr_sherlock_S1b_DC.mp4";
//kglobs.urls[3] = "ytr_sherlock_S1b_S.mp4";

kglobs.overriding = false;

function churl(index){
  kglobs.overriding = false;
  var tstkrpano=document.getElementById("krpanoSWFObject");
  //var cmd = `plugin[video].playvideo('${kglobs.urls[index]}')`;
  //krpano.call(cmd);
  if(!kglobs.krp.ready) {
    console.log("churl:!kglobs.krp.ready");
    return;
  }
    
  console.log("churl:kglobs.krp.ready:index="+index);
  krpano = kglobs.krp.krpano; 

  var cmd = `plugin[video].playvideo('${kglobs.urls[index]}')`;
  krpano.call(cmd);

  /* this works but abouve would be better?
  switch ( index ) {
    case "0":
      krpano.call("plugin[video].playvideo('ytr_sherlock_S1b_G.mp4')");
      break;
    case "1":
      krpano.call("plugin[video].playvideo('ytr_sherlock_S1b_UC.mp4')");
      break;
    case "2":
      krpano.call("plugin[video].playvideo('ytr_sherlock_S1b_DC.mp4')");
      break;
    case "3":
      krpano.call("plugin[video].playvideo('ytr_sherlock_S1b_S.mp4')");
      break;    
  }
  */
}

function chazelro(indexaz,indexel,indexro){
  if(!kglobs.krp.ready) {
    console.log("chazelro:!kglobs.krp.ready");
    return;
  }
  console.log("chazelro:indexaz="+indexaz+", indexel="+indexel+", indexro="+indexro);
  kglobs.overriding = true;
  var angles = [0, 90, 180, -90];
  var tangles = [0, 45, 80, -45, -80];
  if( kglobs.ptr === undefined ) {
    kglobs.ptr = {};
    kglobs.ptr.oPan  = undefined;
    kglobs.ptr.oTilt = undefined;
    kglobs.ptr.oRoll = undefined;
    kglobs.ptr.pan  = 0;
    kglobs.ptr.tilt = 0;
    kglobs.ptr.roll = 0;
  }
  if( indexaz !== undefined ) {
    kglobs.ptr.pan  = angles[indexaz];
  }
  if( indexel !== undefined ) {
    kglobs.ptr.tilt  = tangles[indexel];
  }
  if( indexro !== undefined ) {
    kglobs.ptr.roll  = angles[indexro];
  }
  xmlonviewchange();
}

$(document).ready(function() {
  var buttons = document.getElementsByTagName("button");
  if( buttons.length != 17 ) {
    console.log("bad buttons in html: found "+buttons.length+", expected 17");
  }
  for (var i = 0; i < 4; i += 1) {
      buttons[i].onclick = function(e) {
          churl(this.value);
      };
  }
  // az
  for (var i = 4; i < 8; i += 1) {
      buttons[i].onclick = function(e) {
          chazelro(this.value-4,undefined,undefined);
      };
  }
  // roll
  for (var i = 8; i < 12; i += 1) {
      buttons[i].onclick = function(e) {
          chazelro(undefined,undefined,this.value-8);
      };
  }
  // el
  for (var i = 12; i < 17; i += 1) {
      buttons[i].onclick = function(e) {
          chazelro(undefined,this.value-12,undefined);
      };
  }

});

var buildAG;
var rotateAG;

// *** MISC HOOK FUNCS 

function xmlvideoready() {

  if ( kglobs.krp === undefined ) {
    console.log("xmlvideoready:!kglobs.krp yet");
    return;
  }  
  if ( kglobs.krp.krpano === undefined ) {
    console.log("xmlvideoready:!kglobs.krp.krpano yet");
    return;
  } else {
    kglobs.krp.krpano.call("trace(view.hlookat);trace(view.vlookat);trace(view.fov);");
    kglobs.krp.krpano.get();
    console.log("xmlvideoready");
  }    

  if (kglobs.krp.video === undefined) {
    console.log("xmlvideorady:!kglobs.krp.video yet");
    return;
  }
  
  //kglobs.krp.krpano.call("trace(xmlonviewchange)");
  
  if ( kglobs.agbuilt === undefined ) {
    try {
      var view = kglobs.krp.krpano.get("view");
      buildAG();
    }
    catch(err) {
      kglobs.agbuilt = false;
      console.log("xmlvideoready buildAG threw");
    }  
  }
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
  
  if( kglobs.overriding === true ) {
    view.hlookat = kglobs.ptr.pan
    view.vlookat = kglobs.ptr.tilt;
    view.camroll = kglobs.ptr.roll;
  } else {
    kglobs.ptr.pan  = view.hlookat;
    kglobs.ptr.tilt = view.vlookat;
    kglobs.ptr.roll = view.camroll;
  }
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
    if ( kglobs.overriding === true ) {
      console.log("xmlonviewchange override detected");
      kglobs.overriding = false;
    }else{
      console.log("xmlonviewchange change detected");
    }
  }
} 

// these currently NU or never called anyway???
function videoready() {
  kglobs.krp.krpano.call("trace(videoready)");
  console.log("videoready");
}
function onvideoready() {
  kglobs.krp.krpano.call("trace(onvideoready)");
  console.log("onvideoready");
}

/*  function CP_onviewchanged_callback_NU()
  {
      var view = krpano.get("view");

      pan  = view.hlookat;
      tilt = view.vlookat;
      roll = view.camroll;
      if(pan != oPan || roll != oRoll || tilt != oTilt)
      {
          createMat4ADM();
          krpano.call(plugin.onupdateview, plugin);
          oPan = pan;
          oTilt = tilt;
          oRoll = roll;
      }
  } */


// ? may need to check SN3D conv been done correctly, inc condon-shortley phase inversions ?  
  
function buildAGStd() {
  kglobs.aud = {};
  kglobs.aud.ac = new( AudioContext );
  
  var videlem = kglobs.krp.video;
  var options={};
  options.HRTFSetUrl = kglobs.libpath+"/resources";
  kglobs.aud.omdecoder = Omnitone.createFOADecoder(kglobs.aud.ac, videlem, options );
  kglobs.aud.omdecoder.initialize()
  .then( () => {
    kglobs.agbuilt = true;
    console.log('videlem.vol:'+videlem.volume);
    //videlem.volume = 2; // cant do: vol range 0:1 only (so defaulting at max!)
  });
}

function buildAGKX() {
  kglobs.aud = {};
  kglobs.aud.ac = new( AudioContext );
  
  var videlem = kglobs.krp.video;
  kglobs.aud.vidsource = kglobs.aud.ac.createMediaElementSource( videlem );
  kglobs.aud.vidsource.channelInterpretation = 'discrete'; // ???
  kglobs.aud.vidsource.channelCountMode = 'explicit';
  kglobs.aud.vidsource.channelCount = 4;
  kglobs.aud.vidgain = kglobs.aud.ac.createGain();
  kglobs.aud.vidgain.channelInterpretation = 'discrete';
  kglobs.aud.vidgain.channelCountMode = 'explicit';
  kglobs.aud.vidgain.channelCount = 4;
  kglobs.aud.vidsource.connect( kglobs.aud.vidgain );
  
  fNOP(); // CHECK channelCount: should be 4 for both
  console.log( "kglobs.aud.vidsource.channelCount:"+kglobs.aud.vidsource.channelCount );
  console.log( "kglobs.aud.vidgain.channelCount:"+kglobs.aud.vidgain.channelCount );
  
  var options={};
  options.HRTFSetUrl = kglobs.libpath+"/resources";
  //options.channelMap = [0, 2, 3, 1]; //wyzx from wxyz
  //options.channelMap = [0, 3, 1, 2]; //wxyz from wyzx
  options.channelMap = [0, 1, 2, 3];
  
  kglobs.aud.omdecoder = KXOmnitone.createFOADecoder(kglobs.aud.ac, options );
  kglobs.aud.omdecoder.initialize()
  .then( () => {
    kglobs.aud.vidgain.connect( kglobs.aud.omdecoder.input );
    kglobs.aud.omdecoder.output.connect( kglobs.aud.ac.destination );  
    kglobs.agbuilt = true;
    console.log('vol:'+kglobs.aud.vidgain.gain.value);
    kglobs.aud.vidgain.gain.value = 2;
    console.log('vol:'+kglobs.aud.vidgain.gain.value);
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
buildAG = buildAGKX;
rotateAG = rotateAG_m3d;

fNOP();
// eo dev config




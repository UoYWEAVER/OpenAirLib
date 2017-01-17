var kutils = kutils || {};
!function() {

    kutils.maps01 = function( s, smin, smax ) {
    	var result;
    	result = (s-smin) / ( smax-smin );
    	return result;
    }
    
   kutils.scale01to = function( s01, dmin, dmax ) {
    	var result;
    	result = (s01*(dmax-dmin)) + dmin;
    	return result;
    }

   kutils.assert = function( bval ) {
   		if ( bval != true ) {
   			console.log( "assert fail " + bval );
   			error(); // undefined func will break???
   		}
    }
    
    kutils.gencolour = function( step, numOfSteps ) {
		// This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
		// Adam Cole, 2011-Sept-14
		// HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
		var r, g, b;
		var h = step / numOfSteps;
		var i = ~~(h * 6);
		var f = h * 6 - i;
		var q = 1 - f;
		switch(i % 6){
			case 0: r = 1; g = f; b = 0; break;
			case 1: r = q; g = 1; b = 0; break;
			case 2: r = 0; g = 1; b = f; break;
			case 3: r = 0; g = q; b = 1; break;
			case 4: r = f; g = 0; b = 1; break;
			case 5: r = 1; g = 0; b = q; break;
		}
		var c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
		return (c);
	}


	kutils.mapsdrange = function ( s, smin, smax, dmin, dmax ) {
		var norms = kutils.maps01( s, smin, smax );
		var result = kutils.scale01to( norms, dmin, dmax );
		return result;	
	}

	kutils.clipsdrange = function ( s, smin, smax, dmin, dmax ) {
		s = kutils.clipto( s, smin, smax );		
		s = kutils.maps01( s, smin, smax );
		var result = kutils.scale01to( s, dmin, dmax );
		return result;	
	}

	kutils.clipto = function ( s, smin, smax ) {
		s = Math.max( s,smin );
		s = Math.min( s,smax );
		return s;
	}

	// //load a sound UNTESTED
	kutils.loadSound = function( context, buffer, url ) {
		var request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.responseType = 'arraybuffer';

		// // When loaded decode the data
		request.onload = function() {
			context.decodeAudioData(request.response, function(buffer) {
			}, onError);
		}
		request.send();
		
		/* chrome:  "Cross origin requests are only supported for protocol schemes: http, data, chrome, chrome-extension, https, chrome-extension-resource."
			can use python to setup http server for a particular folder & use localhost
			also need to start chrome in special dev mode!
			
			or put the file on an https server 
			
			I think safari DOES allow local files though
			Not sure about firefox.
		*/
		function onError(e) {
			console.log(e);
		}
	}


/* jic need: from smus ----- */

	function equalPowerCrossfade(percent) { // surely frac not percent???
		var gains = {};
		// Use an equal-power crossfading curve:
		gains.g1 = Math.cos( percent * 0.5 * Math.PI );
		gains.g2 = Math.cos( (1.0 - percent) * 0.5 * Math.PI );
		return gains;
	}
	
/*	window.requestAnimationFrame = (function() {
		return window.requestAnimationFrame  ||
		window.webkitRequestAnimationFrame ||
  		window.mozRequestAnimationFrame    ||
  		window.oRequestAnimationFrame      ||
  		window.msRequestAnimationFrame     ||
  		function(callback){
  			var FPS = 30;
  			window.setTimeout(callback, 1000 / FPS);
		};
	})();
*/

/*
	function getLiveInput() {
	  // Only get the audio stream.
	  navigator.webkitGetUserMedia({audio: true}, onStream, onStreamError);
	};

	function onStream(stream) {
	  // Wrap a MediaStreamSourceNode around the live input stream.
	  var input = context.createMediaStreamSource(stream);
	  // Connect the input to a filter.
	  var filter = context.createBiquadFilter();
	  filter.frequency.value = 60.0;
	  filter.type = filter.NOTCH;
	  filter.Q = 10.0;

	  var analyser = context.createAnalyser();

	  // Connect graph.
	  input.connect(filter);
	  filter.connect(analyser);

	  // Set up an animation.
	  requestAnimationFrame(render);
	};

	function onStreamError(e) {
	  console.error(e);
	};

	function render() {
	  // Visualize the live audio input.
	  requestAnimationFrame(render);
	};
*/






// eo kutils	
}();




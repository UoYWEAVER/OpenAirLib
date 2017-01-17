function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onfin = callback;
  this.bufferList = [];
  this.attemptCount = 0;
  this.loadFlags=[];
  this.DEBUG=true;
}

BufferLoader.prototype.incAttempts = function( self ) {
	self.attemptCount++;
	if ( self.attemptCount === self.urlList.length ) {
		self.onfin();
	}
}


// rehash to call calllback whether any have failed or not
BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var self = this; // rename to fix context change of 'this' within deferred functions - becomes caller eg window etc

  request.onload = function() {

    // Asynchronously decode the audio file data in request.response
    self.context.decodeAudioData(
    
      request.response,

      // success call: save in relev buffer list slot
      function(buffer) {
        if ( buffer === undefined || buffer === 0 ) {
          console.log('error decoding file data: ' + url);
          self.loadFlags[index] = false;
        } else {
          self.loadFlags[index] = true;
          if ( self.DEBUG === true ) {
          	console.log('Decoded file OK: ' + url + ' N ' + (self.attemptCount+1) );
          }
        }
        self.bufferList[index] = buffer;
        self.incAttempts(self);
      },
      
      function(error) {
        console.log('decodeAudioData error ' + error + ' index=' + index + ' url=' + url );
        self.incAttempts(self);
      }
      
    );
  }

  request.onerror = function() {
    console.log('BufferLoader: XHR error');
    self.incAttempts(self);
  }

  request.send();
}

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; i++) {
  	this.loadBuffer(this.urlList[i], i);
  }
}

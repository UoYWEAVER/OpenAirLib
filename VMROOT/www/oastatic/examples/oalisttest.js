// listtest.js
// OpenAirLibInfo list tester
// K Brown

//const oaserver = 'http://oadev.york.ac.uk/irserver';
const oaserver = 'http://www.openairlib.net/irserver';

let openairinfo = new WeaverLib.effects.OpenAirLibInfo(oaserver);
let result = openairinfo.urlBase();
console.log(result);

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

// some generic handlers
const onaccept = val => {
  console.log(`accept ${val}`);
};

const onreject = val => {
  console.log(`reject ${val}`);
};

const onacceptlist = vals => {
  // console.log(`accept ${vals}`); // Array[N] of Objects
  let len = vals.length;
  let i;
  for (i=0; i<len; i++) {
    let fileinfo = vals[i];
    consoleLogFileInfo(fileinfo);   
  }
};

openairinfo.ver()
.then(onaccept)
.catch(onreject);

openairinfo.list()
.then(onacceptlist)
.catch(onreject);



# OpenAirLib #

This repo contains
 WeaverLib-js
  which contains
   OpenAirLibNode, 
   OpenAirLibInfo,
   and KXOmnitone classes,

VMROOT
 a tree structure of files mirroring latest node server and examples structure on www.openairlib.net.

 KXOmnitone (in folder omnitone-0.1.6DEV : standalone build) 
 
## WeaverLib-js ##
  JavaScript library, to build run
  $ npm run webpack
  creates weaverlib.js in /dist  

## OpenAirLibInfo ##
 WeaverLib.effects.OpenAirLibInfo
 JavaScript Class to obtain information from oanodeserver described below.
 Example
  const ctx = new AudioContext();
  let rurl;
  const oalinfo = new WeaverLib.effects.OpenAirLibInfo();
  const presults = oalinfo.search('Minster');
  presults.then((results) => {
    rurl = results.filepath;
    console.log(results.rurl);
  });
  
For more involved example see VMROOT/www/oastatic/examples/oalisttest.html
 
## OpenAirLibNode ##
 WeaverLib.effects.OpenAirLibNode
 Wrapper around one or more WAAPI ConvolverNodes to provide 1, 2 or 4 channel (FOA) Impulse response
 loading capabilities from curated IRs hosted on www.openairlib.net.

 Usage in .js

  const ctx = new AudioContext();
  ...
  // create some nodes
  ...
  const oalnode = new WeaverLib.effects.OpenAirLibNode( ctx);
  anothernode.connect(oalnode.input);
  oalnode.output.connect(anothernode2);
  oalnode.load( rurl );
  // where rurl is a filepath fiels from an OpenAirLibInfo result
    
 For more involved example see VMROOT/www/oastatic/examples/debugtest.html

## oanodeserver ##

 The main commands available are as follows (relative to the www.openairlib.net/irserver URL)
 (All commands return JSON objects except where stated.)

  /server: returns the above root-URL.

  /ver: returns the version.

  /list: returns detailed information about all IRs.

  /search?d=titlestringtomatch:
  returns detailed information on each RIR for which the title partially matches the
  search text titlestringtomatch.

  /filefromrurl:
  streams the RIR data if a file exists that matches that RURL (not JSON.)
  
The detailed information returned is an array of
JSON objects each having eighteen fields, including:

  title: the title of the RIR.

  filepath: the relative-URL (RURL) of the 
    RIR (this does not include the root URL portion.)

  fs: sampling frequency.

  chans: number of channels.

  RT60_1K: the 60dB decay time at 1kHz of the RIR.

  cc_license: the Creative Commons license type code.
 

## LICENSE ##
Unless stated in local readme.md or in code header comments, all files license is Apache 2.

## AUTHOR ##
K Brown, University of York.

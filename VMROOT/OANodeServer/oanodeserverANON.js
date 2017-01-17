// oanodeserver.js : 160630 sql works
// 160705 ver 1.0.0 db's differ dep on machine, add svlist and conditional configs...
// 160801 ver 1.0.1  search and returned urls relative  not abs: client knows svr root
// also get by fid now uses '?d=' syntax
// WIP serve actual file for local non cors test
// 160801 1.0.2 script MUST run in www.openairlib.net rot, even if local.
// that way all paths same and relative to rundir. del FILEROOT etc.
// 160919 1.0.3 got working on OADEV (test w "curl localhost:3000/list" - cats list to stdout)

// TODO use template literals instead of string concatenation

// needs node (nodejs on Ubuntu) 4.X +

// 1.0.4 fix throw if select bad data eg filefromrurl?d=<NOT A VALID RELPATH>
// 1.0.5 wip maybe dont need all those try/catches? fs still throws if file not found!
// 1.0.6 fix ffrurl probs
// ANON : as 1.0.6 but removed passwords.

'use strict';

// CONFIG
const KDEBUGVERBOSE  = true;
const KDEBUGVERBOSESEP = true;
const KDEBUGVERBOSEALL = false;
const KDEBUGCATSQLCMD = false;
const KDEBUGCATFIDRESULT = true;
const SETALLOWACCESSCONTROLNOORIGIN = true;
const svrlist = [
  'KBMAC',
  'MPVM',
  'OADEV',
  'OALIB',
];
const SERVER = svrlist[3]; // !!!!!!!!!!!!!CONFIG!!!!!!!!!!!!
// EO Config

let tmp = require('./querysqlfmtstr');
const querysqlfmtstr = tmp.sql;
tmp = [];

// https://www.npmjs.com/package/pg-format
const pgformat = require('pg-format');
const jSearch = {};
jSearch.Mode = 0;
jSearch.TXT = 'SEARCHTXT';
jSearch.URL = 'SEARCHURL';
jSearch.FID = 99999;

let connectionString = '';
let CLILOCAL = 0; // for attempt to allow CORS
let SVRURL = '';
let queryind = 1;

if (SERVER === svrlist[0]) {
  connectionString = 'postgres://localhost:5432/aurelization_database'; // note spelling!
  SVRURL = 'http://localhost:3000';
  CLILOCAL = 1;
} else if (SERVER === svrlist[1]) {
  connectionString = 'postgres://audiolab:*PW*EDIT*ME*@localhost:5432/auralization_database';
  SVRURL = 'https://vm-1454-user.virt.ch.bbc.co.uk';
} else if (SERVER === svrlist[2]) {
  connectionString = 'postgres://audiolab:*PW*EDIT*ME*@localhost:5432/auralization_database';
  SVRURL = 'http://oadev.york.ac.uk/irserver';
  console.log('OADev');
} else if (SERVER === svrlist[3]) {
  connectionString = 'postgres://audiolab:*PW*EDIT*ME*@localhost:5432/auralization_database';
  SVRURL = 'http://www.openairlib.net/irserver'; // CHECK
  console.log('OALIB');
} else {
  console.log('Bad SERVER Config');
  throw new Error('Bad SERVER Config');
}

const exec = require('child_process').exec;
const child = exec('pwd',
    (error, stdout, stderr) => {
        console.log(`stdout: ${stdout}`);
});


const svr_ver = '1.0.7';
console.log(`oanodeserver ${svr_ver} starting...`);


const fs = require('fs');

const express = require('express');
const app = express();

if (CLILOCAL || (SETALLOWACCESSCONTROLNOORIGIN===true)) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); //  or *.wav+*.ogg+*.png+*.jpg etc? what types are there
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
    // allow server local test files in kbtest folder via http://localhost:3000/kbtest/file.wav
  });
}

if (CLILOCAL) {  
  app.use('/kbtest', express.static('kbtest'));
} else {
  app.use('/oastatic', express.static('oastatic'));
}

app.on('error', function (err) {
  console.trace('app.on-error');
  console.error(err.stack);
});

let fidcache = [];

const pg = require('pg');

function mkpgsql() {
  try {
    tmp = pgformat(
      querysqlfmtstr,
      jSearch.Mode,
      jSearch.TXT,
      jSearch.TXT,
      jSearch.TXT,
      jSearch.URL,
      jSearch.FID
    );
    if (KDEBUGVERBOSE) {
      console.log(
        pgformat(
          ' %s %s %s %s %s %s',
          jSearch.Mode,
          jSearch.TXT,
          jSearch.TXT,
          jSearch.TXT,
          jSearch.URL,
          jSearch.FID
        )
      );
    }
  }
  catch(err) {
    console.log(`mkpgsql failed with "${err}"`);
    tmp = "";
  }
  return tmp;
}

if (KDEBUGCATSQLCMD) {
  console.log(mkpgsql());
}

const client = new pg.Client(connectionString);
client.connect();
// todo - use pool & close after each?

function querystub(querysqlstr, res, xqueryind) {
  const results = [];
  const thismode = jSearch.Mode;
  console.log('  About to query mode=' + thismode + ', #' + xqueryind);
  const query = client.query(querysqlstr);
  if (thismode === 0) {
    fidcache = [];
  }

  let rowno = 0;
  const getrowno = function() {
    return ++rowno;
  };

  // Stream results back one row at a time
  query.on('row', function (orgrow) {
    if (KDEBUGVERBOSESEP === true) {
      const r = getrowno();
      console.log(`row #${r}: ${orgrow}`);
    }
    if (thismode === 0) {
      const fid = orgrow.fid;
      fidcache.push(fid);
    }
    results.push(orgrow);
  });

  // After all data is returned, send results - todo ? if pool close conn?
  query.on('end', function () {
    const xxqueryind = xqueryind;
    if (KDEBUGVERBOSEALL === true) {
      console.log(results);
    }
    console.log(`   finished query : ${results.length} rows, #${xxqueryind}`);
    console.log('');
    const jresults = JSON.stringify(results);
    if (KDEBUGCATFIDRESULT && thismode === 3) {
      console.log(`FIDResult json ${jresults}`);
    }
    res.send(jresults);
  });
}

function possbadfid(qfid) {
  if (qfid === undefined) {
    return true;
  }
  const ifid=parseInt(qfid, 10);
  if (ifid === undefined) {
    return true;
  }
  if( isNaN(ifid) ) {
    return true;
  }
  if (fidcache.length === 0) {
    return false;
  }
  let fid = 0;
  for (fid in fidcache) {
    if (fid === ifid) {
      return false;
    }
  }
  return true;
}


// all sql results are json or arrays of json, so encode any that are not directly from sql

app.get('/ver', function (req, res) {
  // test localhost:3000/ver
  console.log('ver');
  res.send(JSON.stringify(`oanodeserver ${svr_ver} active`));
});

app.get('/server', function (req, res) {
  // test localhost:3000/server
  console.log('server');
  res.send(JSON.stringify(`${SVRURL}`));
});

app.get('/list', function (req, res) {
  // test localhost:3000/list
  console.log('list');
  jSearch.Mode = 0;
  try {
    querystub(mkpgsql(), res, queryind++);
  }
  catch(err) {
    console.log(`list failed with "${err}"`);
  }
});// eo app.get list

app.get('/search', function (req, res) {
  // test localhost:3000/search?d=Minster
  try {
    const term = req.query.d;
    console.log(`search:= "${term}"`);
    jSearch.Mode = 1;
    jSearch.TXT = term;
    querystub(mkpgsql(), res, queryind++);
  }
  catch(err) {
    console.log(`search failed with "${err}"`);
  }
}); // eo app.get search

app.get('/rurl', function (req, res) {
  // localhost:3000/rurl?d=sites/default/files/auralization/data/audiolab/york-minster
  // /stereo/minster1_000_ortf_48k.wav
  try {
    const term = req.query.d;
    console.log(`rurl:= "${term}"`);
    jSearch.Mode = 2;
    jSearch.URL = term;
    querystub(mkpgsql(), res, queryind++);
  }
  catch(err) {
    console.log(`rurl failed with "${err}"`);
  }
}); // eo app.get by relative url

app.get('/fid', function (req, res, next) {
  // localhost:3000/fid?d=<fid>
  try {
    let term;
    let ifid;
    term = req.query;
    if (term === undefined) {
      console.log('fid term undefined');
      return next(new Error('term undefined'));
    }
    term = req.query.d;
    if (term === undefined) {
      console.log('fid term.d undefined');
      return next(new Error('term.d undefined'));
    }
    if (typeof term === "string") {
      ifid = parseInt(term, 10);
      if (ifid === undefined || isNaN(ifid) ) {
        console.log('fid term.d NaN');
        return next(new Error('fid term.d NaN'));
      }
      term = ifid;
    }
    if (typeof term !== "number") {
      console.log('fid term.d not a number');
      return next(new Error('term.d NaN'));
    }
    next();
  }
  catch(err) {
    console.log(`fid failed with "${err}"`);
    req.query = {};
    req.query.d=0;
    next();
  }
}); // eo app.get by fid

app.get('/fid', function (req, res) {
  // localhost:3000/fid?d=<fid>
  try {
    let term = req.query.d;
    console.log(`fid:= ${term}`);
    jSearch.Mode = 3;
    jSearch.FID = term;
    if (possbadfid(term)) {
      console.log(`Poss Bad FID ${term}`);
    }
    querystub(mkpgsql(), res, queryind++);
  }
  catch(err) {
    console.log(`fid failed with "${err}"`);
  }
}); // eo app.get by fid

// see http://www.willvillanueva.com/
// the-web-audio-api-from-nodeexpress-to-your-browser/
app.get('/filefromrurl', function (req, res, next) {
  // localhost:3000/filefromrurl?d=sites/default/files/auralization/data/audiolab/york-minster
  // /stereo/minster1_000_ortf_48k.wav
  try {
    let term;
    term = req.query;
    if (term === undefined) {
      console.log('ffurl term undefined');
      return next(new Error('ffurl term undefined'));
    }
    term = req.query.d;
    if (term === undefined) {
      console.log('ffurl term.d undefined');
      return next(new Error('ffurl term.d undefined'));
    }
  }
  catch(err) {
    console.log(`filefromrurl failed with "${err}"`);
    return next(new Error('readStream undefined'));
  }
  next();
}); // eo app.get actual file by rurl middleware

// see http://www.willvillanueva.com/
// the-web-audio-api-from-nodeexpress-to-your-browser/
app.get('/filefromrurl', function (req, res) {
  // localhost:3000/filefromrurl?d=sites/default/files/auralization/data/audiolab/york-minster
  // /stereo/minster1_000_ortf_48k.wav
  let term = req.query.d;
  console.log(`filefromrurl:= "${term}"`);
  // 1.0.2+ always use path relative to rundir...
  // for err checking see https://docs.nodejitsu.com/articles/advanced/streams/how-to-use-fs-create-read-stream/
  const readStream = fs.createReadStream(term);
  if (readStream === undefined) {
    console.log('readStream undefined');
    return next(new Error('readStream undefined'));
  }
  // This will wait until we know the readable stream is actually valid before piping
  readStream.on('error', function(err) {
    console.log('readStream errored');
    console.error(err);
    res.end();
  });
  readStream.on('open', function () {
    // This just pipes the read stream to the response object (which goes to the client)
    // This catches any errors that happen while creating the readable stream (usually invalid names)
    res.set({ 'Content-Type': 'audio/mpeg' });
    readStream.pipe(res);
  });
}); // eo app.get actual file by rurl

app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  console.error(err);
  res.status(500).send('Server Error');
}

/*app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
*/

app.use(errorHandler);

app.listen(3000, function () {
  console.log('oanodeserver listening');
  console.log('');
});



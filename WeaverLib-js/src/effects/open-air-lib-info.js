import Loader from '../core/loaders/loader.js';
/*
  open-air-lib-info.js

  K Brown
  University of York
  M Paradis
  BBC Audio Research

  OpenAirLibInfo
*/

export default class OpenAirLibInfo {

// LOCALTEST constructor(urlbase = 'http://localhost:3000') {
//  constructor(urlbase = 'oadev.york.ac.uk/irserver') {
  constructor(urlbase = 'www.openairlib.net/irserver') {
    this._url_base = urlbase;
    this._url_suffix_server = '/server';
    this._url_suffix_server_ver = '/ver';
    this._url_suffix_list = '/list';
    this._url_suffix_search = '/search?d=';
    this._url_suffix_rurl = '/rurl?d=';
    this._url_suffix_fid = '/fid?d=';
    this._url_suffix_filefromurl = '/filefromrurl?d=';
    this._loader = new Loader('json');
  }

  // returns base url
  urlBase() {
    return this._url_base;
  }

  /* following return promises of decoded json */

  // returns version string from server
  ver() {
    return this._request(this._url_suffix_server_ver);
  }

  // returns server root URL
  localRoot() {
    return this._request(this._url_suffix_server);
  }

  list() {
    return this._request(this._url_suffix_list);
  }

  search(searchstring) {
    const searchstringenc = encodeURIComponent(searchstring);
    return this._request(this._url_suffix_search, searchstringenc);
  }

  byrUrl(rurlstring) {
    const rurlstringenc = encodeURIComponent(rurlstring);
    return this._request(this._url_suffix_rurl, rurlstringenc);
  }

  byFid(fid) {
    const fidstring = encodeURIComponent(fid, toString(10));
    return this._request(this._url_suffix_fid, fidstring);
  }

  /**
   * @private
   * Loads a single request using the XMLHttpRequest API via Loader class.
   * @param  {!string} type+[data]
   *         A single url of data to load.
   * @return {Promise}
   *         A Promise that resolves when the data has been loaded.
   */
  _request(type, data) {
    let url = this._url_base + type;
    if (data !== undefined) {
      url += data;
    }
    return this._loader.load(url);
  }

}

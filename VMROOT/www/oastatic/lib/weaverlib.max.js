(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["WeaverLib"] = factory();
	else
		root["WeaverLib"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!**************************!*\
  !*** ./src/weaverlib.js ***!
  \**************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.effects = exports.core = undefined;
	
	var _index = __webpack_require__(/*! ./core/_index */ 1);
	
	var core = _interopRequireWildcard(_index);
	
	var _index2 = __webpack_require__(/*! ./effects/_index */ 111);
	
	var effects = _interopRequireWildcard(_index2);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	exports.core = core;
	exports.effects = effects;
	exports.default = {
	  core: core,
	  effects: effects
	};

/***/ },
/* 1 */
/*!****************************!*\
  !*** ./src/core/_index.js ***!
  \****************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.AudioLoader = exports.Loader = exports.DocumentParser = undefined;
	
	var _documentParser = __webpack_require__(/*! ./parsers/document-parser */ 2);
	
	var _documentParser2 = _interopRequireDefault(_documentParser);
	
	var _loader = __webpack_require__(/*! ./loaders/loader */ 23);
	
	var _loader2 = _interopRequireDefault(_loader);
	
	var _audioLoader = __webpack_require__(/*! ./loaders/audio-loader */ 77);
	
	var _audioLoader2 = _interopRequireDefault(_audioLoader);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.DocumentParser = _documentParser2.default;
	exports.Loader = _loader2.default;
	exports.AudioLoader = _audioLoader2.default;

/***/ },
/* 2 */
/*!*********************************************!*\
  !*** ./src/core/parsers/document-parser.js ***!
  \*********************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ 3);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ 4);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * A class to parse documents, returning Javascript objects representing their
	 * contents. The structure and content of the returned objects is defined by a
	 * set of datamodels and parsers that must be provided.
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/Document
	 * @example
	 * // When document has the contents:
	 * // <ParentTemplate id="0">
	 * //   <ChildTemplate text="HelloWorld!"></ChildTemplate>
	 * //   <ChildTemplate></ChildTemplate>
	 * // </ParentTemplate>
	 * //
	 * // The result will contain the object:
	 * // {
	 * //   id: 0,
	 * //   childTemplates: [{
	 * //     text: 'HelloWorld!',
	 * //   }, {
	 * //     text: 'Default string.',
	 * //   }],
	 * // }
	 *
	 * const models = {
	 *   ParentTemplate: {
	 *     attributes: [{
	 *     name: 'id',
	 *       type: 'integer',
	 *     }],
	 *     nodes: [{
	 *       name: 'childTemplates',
	 *       node: 'ChildTemplate',
	 *       type: 'ChildTemplate',
	 *       mapping: 'many',
	 *     }],
	 *   },
	 *   ChildTemplate: {
	 *     attributes: [{
	 *       name: 'text',
	 *       type: 'string',
	 *       default: 'Default string.',
	 *     }],
	 *   },
	 * };
	 *
	 * const parsers = {
	 *   integer: (value) => parseInt(value, 10),
	 * }
	 *
	 * const documentParser = new DocumentParser(models, parsers);
	 * const result = documentParser.parse(document);
	 */
	
	var DocumentParser = function () {
	  /**
	   * Constructs a new {@link DocumentParser}.
	   * @param  {!Object[]} models
	   *         A set of data models that represent nodes within the documents to
	   *         be parsed. See {@link DocumentParser} example for model structure.
	   * @param  {?Object[]} parsers
	   *         A set of parsers that convert strings to a desired type. See
	   *         {@link DocumentParser} example for parser structure.
	   */
	
	  function DocumentParser(models) {
	    var parsers = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
	    (0, _classCallCheck3.default)(this, DocumentParser);
	
	    this._models = models;
	    this._parsers = parsers;
	  }
	
	  /**
	   * Parses a document, returning an object representing the document contents.
	   * @param  {!Document} document
	   *         The document to parse.
	   * @return {Object}
	   *         The object representing the parsed document contents.
	   */
	
	
	  (0, _createClass3.default)(DocumentParser, [{
	    key: 'parse',
	    value: function parse(document) {
	      // TODO: Consider adding sanity checks on document etc?
	
	      // Grab the root element and corresponding model, and parse.
	      var rootElement = document.childNodes[0];
	      var rootModel = this._models[rootElement.nodeName];
	
	      return this._parse(rootElement, rootModel);
	    }
	
	    /**
	     * Parses the node, by iterating through the nodes DOM tree. The model
	     * specifies all attributes and child nodes that should be parsed and the
	     * parser that should be used.
	     * @see https://developer.mozilla.org/en-US/docs/Web/API/Node
	     * @private
	     * @param  {!Node} node
	     *         The node to parse.
	     * @param  {!Object} model
	     *         The model to parse the node against.
	     * @return {Object}
	     *         The object representing the parsed nodes contents.
	     */
	
	  }, {
	    key: '_parse',
	    value: function _parse(node, model) {
	      var attrModels = model.attributes || [];
	      var nodeModels = model.nodes || [];
	      var object = {};
	
	      for (var i = 0; i < attrModels.length; i++) {
	        var attrModel = attrModels[i];
	        object[attrModel.name] = this._parseAttribute(node, attrModel);
	      }
	
	      for (var _i = 0; _i < nodeModels.length; _i++) {
	        var nodeModel = nodeModels[_i];
	        object[nodeModel.name] = this._parseNode(node, nodeModel);
	      }
	
	      return object;
	    }
	
	    /**
	     * Parses a single attribute on a node. The attrModel specifies the attribute
	     * and how it should be parsed.
	     * @see https://developer.mozilla.org/en-US/docs/Web/API/Node
	     * @private
	     * @param  {!Node} node
	     *         The node to parse.
	     * @param  {!Object} attrModel
	     *         The model to parse the attribute against.
	     * @return {any}
	     *         The parsed attribute.
	     */
	
	  }, {
	    key: '_parseAttribute',
	    value: function _parseAttribute(node, attrModel) {
	      // Parses a single attribute on the node as specified by the attrModel. If a
	      // parser is found matching the specified type the value is parsed through
	      // it. Otherwise; the value is returned.
	      var value = node.getAttribute(attrModel.name) || attrModel.default;
	      var parser = this._parsers[attrModel.type];
	
	      return parser ? parser.call(null, value) : value;
	    }
	
	    /**
	     * Parses all children of the node as specified by the nodeModel.
	     * @see https://developer.mozilla.org/en-US/docs/Web/API/Node
	     * @private
	     * @param  {!Node} node
	     *         The node to parse.
	     * @param  {!Object} nodeModel
	     *         The model to parse the node against.
	     * @return {any}
	     *         The parsed node.
	     */
	
	  }, {
	    key: '_parseNode',
	    value: function _parseNode(node, nodeModel) {
	      var name = nodeModel.node || nodeModel.name;
	      var nodes = this._getChildNodes(node, name);
	
	      if (nodes.length === 0) {
	        return null;
	      }
	
	      return nodeModel.mapping === 'many' ? this._parseNodeMany(nodes, nodeModel) : this._parseNodeOne(nodes[0], nodeModel);
	    }
	
	    /**
	     * Parses all children of the node as specified by the nodeModel.
	     * @see https://developer.mozilla.org/en-US/docs/Web/API/Node
	     * @private
	     * @param  {!Node} node
	     *         The node to parse.
	     * @param  {!Object} nodeModel
	     *         The model to parse the node against.
	     * @return {any[]}
	     *         The parsed node.
	     */
	
	  }, {
	    key: '_parseNodeMany',
	    value: function _parseNodeMany(nodes, nodeModel) {
	      var childNodes = [];
	
	      for (var i = 0; i < nodes.length; i++) {
	        childNodes.push(this._parseNodeOne(nodes[i], nodeModel));
	      }
	
	      return childNodes;
	    }
	
	    /**
	     * Parses a single child of the node as specified by the nodeModel.
	     * @see https://developer.mozilla.org/en-US/docs/Web/API/Node
	     * @private
	     * @param  {!Node} node
	     *         The node to parse.
	     * @param  {!Object} nodeModel
	     *         The model to parse the node against.
	     * @return {any}
	     *         The parsed node.
	     */
	
	  }, {
	    key: '_parseNodeOne',
	    value: function _parseNodeOne(node, nodeModel) {
	      var model = this._models[nodeModel.type];
	
	      return model ? this._parse(node, model) : this._flattenNodeToAttribute(node, nodeModel);
	    }
	
	    /**
	     * Parses the text content of a node, flattening it to an atrribute.
	     * @see https://developer.mozilla.org/en-US/docs/Web/API/Node
	     * @private
	     * @param  {!Node} node
	     *         The node to parse.
	     * @param  {!Object} nodeModel
	     *         The model to parse the node against.
	     * @return {any}
	     *         The parsed attribute.
	     */
	
	  }, {
	    key: '_flattenNodeToAttribute',
	    value: function _flattenNodeToAttribute(node, nodeModel) {
	      var value = node.textContent || nodeModel.default;
	      var parser = this._parsers[nodeModel.type];
	
	      return parser ? parser.call(null, value) : value;
	    }
	
	    /**
	     * Gets all child nodes with the name equal to the name provided.
	     * @see https://developer.mozilla.org/en-US/docs/Web/API/Node
	     * @private
	     * @param  {!Node} node
	     *         The node to parse.
	     * @param  {!string} name
	     *         The name of the child node(s).
	     * @return {Node[]}
	     *         Array of nodes with the name equal to the name provided.
	     */
	
	  }, {
	    key: '_getChildNodes',
	    value: function _getChildNodes(node, name) {
	      var nodes = [];
	
	      for (var i = 0; i < node.childNodes.length; i++) {
	        var childNode = node.childNodes[i];
	        var childName = childNode.nodeName;
	
	        if (name.toLowerCase() === childName.toLowerCase()) {
	          nodes.push(childNode);
	        }
	      }
	
	      return nodes;
	    }
	  }]);
	  return DocumentParser;
	}();
	
	exports.default = DocumentParser;

/***/ },
/* 3 */
/*!***************************************************!*\
  !*** ./~/babel-runtime/helpers/classCallCheck.js ***!
  \***************************************************/
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	
	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

/***/ },
/* 4 */
/*!************************************************!*\
  !*** ./~/babel-runtime/helpers/createClass.js ***!
  \************************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _defineProperty = __webpack_require__(/*! ../core-js/object/define-property */ 5);
	
	var _defineProperty2 = _interopRequireDefault(_defineProperty);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
	    }
	  }
	
	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();

/***/ },
/* 5 */
/*!***********************************************************!*\
  !*** ./~/babel-runtime/core-js/object/define-property.js ***!
  \***********************************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(/*! core-js/library/fn/object/define-property */ 6), __esModule: true };

/***/ },
/* 6 */
/*!************************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/fn/object/define-property.js ***!
  \************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(/*! ../../modules/es6.object.define-property */ 7);
	var $Object = __webpack_require__(/*! ../../modules/_core */ 10).Object;
	module.exports = function defineProperty(it, key, desc){
	  return $Object.defineProperty(it, key, desc);
	};

/***/ },
/* 7 */
/*!*********************************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/es6.object.define-property.js ***!
  \*********************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(/*! ./_export */ 8);
	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	$export($export.S + $export.F * !__webpack_require__(/*! ./_descriptors */ 18), 'Object', {defineProperty: __webpack_require__(/*! ./_object-dp */ 14).f});

/***/ },
/* 8 */
/*!**************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_export.js ***!
  \**************************************************************/
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(/*! ./_global */ 9)
	  , core      = __webpack_require__(/*! ./_core */ 10)
	  , ctx       = __webpack_require__(/*! ./_ctx */ 11)
	  , hide      = __webpack_require__(/*! ./_hide */ 13)
	  , PROTOTYPE = 'prototype';
	
	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , expProto  = exports[PROTOTYPE]
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(a, b, c){
	        if(this instanceof C){
	          switch(arguments.length){
	            case 0: return new C;
	            case 1: return new C(a);
	            case 2: return new C(a, b);
	          } return new C(a, b, c);
	        } return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if(IS_PROTO){
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library` 
	module.exports = $export;

/***/ },
/* 9 */
/*!**************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_global.js ***!
  \**************************************************************/
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 10 */
/*!************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_core.js ***!
  \************************************************************/
/***/ function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 11 */
/*!***********************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_ctx.js ***!
  \***********************************************************/
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(/*! ./_a-function */ 12);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 12 */
/*!******************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_a-function.js ***!
  \******************************************************************/
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 13 */
/*!************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_hide.js ***!
  \************************************************************/
/***/ function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(/*! ./_object-dp */ 14)
	  , createDesc = __webpack_require__(/*! ./_property-desc */ 22);
	module.exports = __webpack_require__(/*! ./_descriptors */ 18) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 14 */
/*!*****************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_object-dp.js ***!
  \*****************************************************************/
/***/ function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(/*! ./_an-object */ 15)
	  , IE8_DOM_DEFINE = __webpack_require__(/*! ./_ie8-dom-define */ 17)
	  , toPrimitive    = __webpack_require__(/*! ./_to-primitive */ 21)
	  , dP             = Object.defineProperty;
	
	exports.f = __webpack_require__(/*! ./_descriptors */ 18) ? Object.defineProperty : function defineProperty(O, P, Attributes){
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if(IE8_DOM_DEFINE)try {
	    return dP(O, P, Attributes);
	  } catch(e){ /* empty */ }
	  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
	  if('value' in Attributes)O[P] = Attributes.value;
	  return O;
	};

/***/ },
/* 15 */
/*!*****************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_an-object.js ***!
  \*****************************************************************/
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(/*! ./_is-object */ 16);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 16 */
/*!*****************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_is-object.js ***!
  \*****************************************************************/
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 17 */
/*!**********************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_ie8-dom-define.js ***!
  \**********************************************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(/*! ./_descriptors */ 18) && !__webpack_require__(/*! ./_fails */ 19)(function(){
	  return Object.defineProperty(__webpack_require__(/*! ./_dom-create */ 20)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 18 */
/*!*******************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_descriptors.js ***!
  \*******************************************************************/
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(/*! ./_fails */ 19)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 19 */
/*!*************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_fails.js ***!
  \*************************************************************/
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 20 */
/*!******************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_dom-create.js ***!
  \******************************************************************/
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(/*! ./_is-object */ 16)
	  , document = __webpack_require__(/*! ./_global */ 9).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ },
/* 21 */
/*!********************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_to-primitive.js ***!
  \********************************************************************/
/***/ function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(/*! ./_is-object */ 16);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function(it, S){
	  if(!isObject(it))return it;
	  var fn, val;
	  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  throw TypeError("Can't convert object to primitive value");
	};

/***/ },
/* 22 */
/*!*********************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_property-desc.js ***!
  \*********************************************************************/
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },
/* 23 */
/*!************************************!*\
  !*** ./src/core/loaders/loader.js ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _promise = __webpack_require__(/*! babel-runtime/core-js/promise */ 24);
	
	var _promise2 = _interopRequireDefault(_promise);
	
	var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ 3);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ 4);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * A class that provides Promise-based, asynchronous file loading.
	 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
	 * @example
	 * const jsonLoader = new WeaverLib.core.Loader(json);
	 *
	 * jsonLoader.load([
	 *   'url/to/json/1.json',
	 *   'url/to/json/2.json'
	 * ]).then((jsonArray) {
	 *   // Use the json objects (jsonArray[0], jsonArray[1])
	 * }).catch(function(error) {
	 *   console.log(error);
	 * });;
	 */
	
	var Loader = function () {
	  /**
	   * Constructs a new {@link Loader}.
	   * @param  {!string} responseType
	   *         The response type the loader should handle. Valid values are
	   *         arraybuffer, blob, document, json or text.
	   */
	
	  function Loader(responseType) {
	    (0, _classCallCheck3.default)(this, Loader);
	
	    this._responseType = responseType || 'arraybuffer';
	  }
	
	  /**
	   * Loads one or more files asynchronously.
	   * @param  {!(string|string[])} urls
	   *         A single url or list of urls of files to load.
	   * @return {Promise}
	   *         A Promise that resolves when all files have been loaded.
	   */
	
	
	  (0, _createClass3.default)(Loader, [{
	    key: 'load',
	    value: function load(urls) {
	      return urls instanceof Array ? this._loadAll(urls) : this._loadOne(urls);
	    }
	
	    /**
	     * @private
	     * Loads one file asynchronously. Promotes overloading in subclasses to add
	     * pre- and post-load processing.
	     * @param  {!string} url
	     *         A single url of file to load.
	     * @return {Promise}
	     *         A Promise that resolves when the file has been loaded.
	     */
	
	  }, {
	    key: '_loadOne',
	    value: function _loadOne(url) {
	      return this._request(url);
	    }
	
	    /**
	     * @private
	     * Loads multiple files asynchronously. Promotes overloading in subclasses to
	     * add pre- and post-load processing.
	     * @param  {!string[]} urls
	     *         A list of urls of files to load.
	     * @return {Promise}
	     *         A Promise that resolves when all files have been loaded.
	     */
	
	  }, {
	    key: '_loadAll',
	    value: function _loadAll(urls) {
	      var _this = this;
	
	      return _promise2.default.all(urls.map(function (url) {
	        return _this._loadOne(url);
	      }));
	    }
	
	    /**
	     * @private
	     * Loads a single file at the specified URL using the XMLHttpRequest API.
	     * @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
	     * @param  {!string} url
	     *         A single url of file to load.
	     * @return {Promise}
	     *         A Promise that resolves when the file has been loaded.
	     */
	
	  }, {
	    key: '_request',
	    value: function _request(url) {
	      var _this2 = this;
	
	      return new _promise2.default(function (resolve, reject) {
	        var request = new XMLHttpRequest();
	        request.open('GET', url, true);
	        request.responseType = _this2._responseType;
	
	        request.addEventListener('load', function onLoadEvent() {
	          // Any correct response will enter this method including 403
	          // (Forbidden), 404 (Not Found) etc. The only responses that
	          // indicate true success are 200 (OK) and 304 (Not Modified).
	          if (this.status === 200 || this.status === 304) {
	            resolve(request.response);
	          } else {
	            reject(new Error(this.statusText));
	          }
	        });
	
	        request.addEventListener('error', function () {
	          // Transport error has occured.
	          reject(new Error('A transport error has occured.'));
	        });
	
	        request.send();
	      });
	    }
	  }]);
	  return Loader;
	}();
	
	exports.default = Loader;

/***/ },
/* 24 */
/*!********************************************!*\
  !*** ./~/babel-runtime/core-js/promise.js ***!
  \********************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(/*! core-js/library/fn/promise */ 25), __esModule: true };

/***/ },
/* 25 */
/*!*********************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/fn/promise.js ***!
  \*********************************************************/
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(/*! ../modules/es6.object.to-string */ 26);
	__webpack_require__(/*! ../modules/es6.string.iterator */ 27);
	__webpack_require__(/*! ../modules/web.dom.iterable */ 56);
	__webpack_require__(/*! ../modules/es6.promise */ 60);
	module.exports = __webpack_require__(/*! ../modules/_core */ 10).Promise;

/***/ },
/* 26 */
/*!***************************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/es6.object.to-string.js ***!
  \***************************************************************************/
/***/ function(module, exports) {



/***/ },
/* 27 */
/*!**************************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/es6.string.iterator.js ***!
  \**************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(/*! ./_string-at */ 28)(true);
	
	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(/*! ./_iter-define */ 31)(String, 'String', function(iterated){
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , index = this._i
	    , point;
	  if(index >= O.length)return {value: undefined, done: true};
	  point = $at(O, index);
	  this._i += point.length;
	  return {value: point, done: false};
	});

/***/ },
/* 28 */
/*!*****************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_string-at.js ***!
  \*****************************************************************/
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(/*! ./_to-integer */ 29)
	  , defined   = __webpack_require__(/*! ./_defined */ 30);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String(defined(that))
	      , i = toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ },
/* 29 */
/*!******************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_to-integer.js ***!
  \******************************************************************/
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 30 */
/*!***************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_defined.js ***!
  \***************************************************************/
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 31 */
/*!*******************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_iter-define.js ***!
  \*******************************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY        = __webpack_require__(/*! ./_library */ 32)
	  , $export        = __webpack_require__(/*! ./_export */ 8)
	  , redefine       = __webpack_require__(/*! ./_redefine */ 33)
	  , hide           = __webpack_require__(/*! ./_hide */ 13)
	  , has            = __webpack_require__(/*! ./_has */ 34)
	  , Iterators      = __webpack_require__(/*! ./_iterators */ 35)
	  , $iterCreate    = __webpack_require__(/*! ./_iter-create */ 36)
	  , setToStringTag = __webpack_require__(/*! ./_set-to-string-tag */ 52)
	  , getPrototypeOf = __webpack_require__(/*! ./_object-gpo */ 54)
	  , ITERATOR       = __webpack_require__(/*! ./_wks */ 53)('iterator')
	  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
	  , FF_ITERATOR    = '@@iterator'
	  , KEYS           = 'keys'
	  , VALUES         = 'values';
	
	var returnThis = function(){ return this; };
	
	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function(kind){
	    if(!BUGGY && kind in proto)return proto[kind];
	    switch(kind){
	      case KEYS: return function keys(){ return new Constructor(this, kind); };
	      case VALUES: return function values(){ return new Constructor(this, kind); };
	    } return function entries(){ return new Constructor(this, kind); };
	  };
	  var TAG        = NAME + ' Iterator'
	    , DEF_VALUES = DEFAULT == VALUES
	    , VALUES_BUG = false
	    , proto      = Base.prototype
	    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , $default   = $native || getMethod(DEFAULT)
	    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
	    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
	    , methods, key, IteratorPrototype;
	  // Fix native
	  if($anyNative){
	    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
	    if(IteratorPrototype !== Object.prototype){
	      // Set @@toStringTag to native iterators
	      setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if(DEF_VALUES && $native && $native.name !== VALUES){
	    VALUES_BUG = true;
	    $default = function values(){ return $native.call(this); };
	  }
	  // Define iterator
	  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG]  = returnThis;
	  if(DEFAULT){
	    methods = {
	      values:  DEF_VALUES ? $default : getMethod(VALUES),
	      keys:    IS_SET     ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if(FORCED)for(key in methods){
	      if(!(key in proto))redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

/***/ },
/* 32 */
/*!***************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_library.js ***!
  \***************************************************************/
/***/ function(module, exports) {

	module.exports = true;

/***/ },
/* 33 */
/*!****************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_redefine.js ***!
  \****************************************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(/*! ./_hide */ 13);

/***/ },
/* 34 */
/*!***********************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_has.js ***!
  \***********************************************************/
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 35 */
/*!*****************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_iterators.js ***!
  \*****************************************************************/
/***/ function(module, exports) {

	module.exports = {};

/***/ },
/* 36 */
/*!*******************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_iter-create.js ***!
  \*******************************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var create         = __webpack_require__(/*! ./_object-create */ 37)
	  , descriptor     = __webpack_require__(/*! ./_property-desc */ 22)
	  , setToStringTag = __webpack_require__(/*! ./_set-to-string-tag */ 52)
	  , IteratorPrototype = {};
	
	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(/*! ./_hide */ 13)(IteratorPrototype, __webpack_require__(/*! ./_wks */ 53)('iterator'), function(){ return this; });
	
	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ },
/* 37 */
/*!*********************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_object-create.js ***!
  \*********************************************************************/
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject    = __webpack_require__(/*! ./_an-object */ 15)
	  , dPs         = __webpack_require__(/*! ./_object-dps */ 38)
	  , enumBugKeys = __webpack_require__(/*! ./_enum-bug-keys */ 50)
	  , IE_PROTO    = __webpack_require__(/*! ./_shared-key */ 47)('IE_PROTO')
	  , Empty       = function(){ /* empty */ }
	  , PROTOTYPE   = 'prototype';
	
	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function(){
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(/*! ./_dom-create */ 20)('iframe')
	    , i      = enumBugKeys.length
	    , gt     = '>'
	    , iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(/*! ./_html */ 51).appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write('<script>document.F=Object</script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
	  return createDict();
	};
	
	module.exports = Object.create || function create(O, Properties){
	  var result;
	  if(O !== null){
	    Empty[PROTOTYPE] = anObject(O);
	    result = new Empty;
	    Empty[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : dPs(result, Properties);
	};

/***/ },
/* 38 */
/*!******************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_object-dps.js ***!
  \******************************************************************/
/***/ function(module, exports, __webpack_require__) {

	var dP       = __webpack_require__(/*! ./_object-dp */ 14)
	  , anObject = __webpack_require__(/*! ./_an-object */ 15)
	  , getKeys  = __webpack_require__(/*! ./_object-keys */ 39);
	
	module.exports = __webpack_require__(/*! ./_descriptors */ 18) ? Object.defineProperties : function defineProperties(O, Properties){
	  anObject(O);
	  var keys   = getKeys(Properties)
	    , length = keys.length
	    , i = 0
	    , P;
	  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

/***/ },
/* 39 */
/*!*******************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_object-keys.js ***!
  \*******************************************************************/
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(/*! ./_object-keys-internal */ 40)
	  , enumBugKeys = __webpack_require__(/*! ./_enum-bug-keys */ 50);
	
	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

/***/ },
/* 40 */
/*!****************************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_object-keys-internal.js ***!
  \****************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(/*! ./_has */ 34)
	  , toIObject    = __webpack_require__(/*! ./_to-iobject */ 41)
	  , arrayIndexOf = __webpack_require__(/*! ./_array-includes */ 44)(false)
	  , IE_PROTO     = __webpack_require__(/*! ./_shared-key */ 47)('IE_PROTO');
	
	module.exports = function(object, names){
	  var O      = toIObject(object)
	    , i      = 0
	    , result = []
	    , key;
	  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while(names.length > i)if(has(O, key = names[i++])){
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};

/***/ },
/* 41 */
/*!******************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_to-iobject.js ***!
  \******************************************************************/
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(/*! ./_iobject */ 42)
	  , defined = __webpack_require__(/*! ./_defined */ 30);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 42 */
/*!***************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_iobject.js ***!
  \***************************************************************/
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(/*! ./_cof */ 43);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 43 */
/*!***********************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_cof.js ***!
  \***********************************************************/
/***/ function(module, exports) {

	var toString = {}.toString;
	
	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 44 */
/*!**********************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_array-includes.js ***!
  \**********************************************************************/
/***/ function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(/*! ./_to-iobject */ 41)
	  , toLength  = __webpack_require__(/*! ./_to-length */ 45)
	  , toIndex   = __webpack_require__(/*! ./_to-index */ 46);
	module.exports = function(IS_INCLUDES){
	  return function($this, el, fromIndex){
	    var O      = toIObject($this)
	      , length = toLength(O.length)
	      , index  = toIndex(fromIndex, length)
	      , value;
	    // Array#includes uses SameValueZero equality algorithm
	    if(IS_INCLUDES && el != el)while(length > index){
	      value = O[index++];
	      if(value != value)return true;
	    // Array#toIndex ignores holes, Array#includes - not
	    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
	      if(O[index] === el)return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

/***/ },
/* 45 */
/*!*****************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_to-length.js ***!
  \*****************************************************************/
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(/*! ./_to-integer */ 29)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 46 */
/*!****************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_to-index.js ***!
  \****************************************************************/
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(/*! ./_to-integer */ 29)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ },
/* 47 */
/*!******************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_shared-key.js ***!
  \******************************************************************/
/***/ function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(/*! ./_shared */ 48)('keys')
	  , uid    = __webpack_require__(/*! ./_uid */ 49);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ },
/* 48 */
/*!**************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_shared.js ***!
  \**************************************************************/
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(/*! ./_global */ 9)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 49 */
/*!***********************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_uid.js ***!
  \***********************************************************/
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 50 */
/*!*********************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_enum-bug-keys.js ***!
  \*********************************************************************/
/***/ function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

/***/ },
/* 51 */
/*!************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_html.js ***!
  \************************************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(/*! ./_global */ 9).document && document.documentElement;

/***/ },
/* 52 */
/*!*************************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_set-to-string-tag.js ***!
  \*************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	var def = __webpack_require__(/*! ./_object-dp */ 14).f
	  , has = __webpack_require__(/*! ./_has */ 34)
	  , TAG = __webpack_require__(/*! ./_wks */ 53)('toStringTag');
	
	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ },
/* 53 */
/*!***********************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_wks.js ***!
  \***********************************************************/
/***/ function(module, exports, __webpack_require__) {

	var store      = __webpack_require__(/*! ./_shared */ 48)('wks')
	  , uid        = __webpack_require__(/*! ./_uid */ 49)
	  , Symbol     = __webpack_require__(/*! ./_global */ 9).Symbol
	  , USE_SYMBOL = typeof Symbol == 'function';
	
	var $exports = module.exports = function(name){
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};
	
	$exports.store = store;

/***/ },
/* 54 */
/*!******************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_object-gpo.js ***!
  \******************************************************************/
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has         = __webpack_require__(/*! ./_has */ 34)
	  , toObject    = __webpack_require__(/*! ./_to-object */ 55)
	  , IE_PROTO    = __webpack_require__(/*! ./_shared-key */ 47)('IE_PROTO')
	  , ObjectProto = Object.prototype;
	
	module.exports = Object.getPrototypeOf || function(O){
	  O = toObject(O);
	  if(has(O, IE_PROTO))return O[IE_PROTO];
	  if(typeof O.constructor == 'function' && O instanceof O.constructor){
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};

/***/ },
/* 55 */
/*!*****************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_to-object.js ***!
  \*****************************************************************/
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(/*! ./_defined */ 30);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 56 */
/*!***********************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/web.dom.iterable.js ***!
  \***********************************************************************/
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(/*! ./es6.array.iterator */ 57);
	var global        = __webpack_require__(/*! ./_global */ 9)
	  , hide          = __webpack_require__(/*! ./_hide */ 13)
	  , Iterators     = __webpack_require__(/*! ./_iterators */ 35)
	  , TO_STRING_TAG = __webpack_require__(/*! ./_wks */ 53)('toStringTag');
	
	for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
	  var NAME       = collections[i]
	    , Collection = global[NAME]
	    , proto      = Collection && Collection.prototype;
	  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
	  Iterators[NAME] = Iterators.Array;
	}

/***/ },
/* 57 */
/*!*************************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/es6.array.iterator.js ***!
  \*************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(/*! ./_add-to-unscopables */ 58)
	  , step             = __webpack_require__(/*! ./_iter-step */ 59)
	  , Iterators        = __webpack_require__(/*! ./_iterators */ 35)
	  , toIObject        = __webpack_require__(/*! ./_to-iobject */ 41);
	
	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(/*! ./_iter-define */ 31)(Array, 'Array', function(iterated, kind){
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , kind  = this._k
	    , index = this._i++;
	  if(!O || index >= O.length){
	    this._t = undefined;
	    return step(1);
	  }
	  if(kind == 'keys'  )return step(0, index);
	  if(kind == 'values')return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');
	
	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;
	
	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

/***/ },
/* 58 */
/*!**************************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_add-to-unscopables.js ***!
  \**************************************************************************/
/***/ function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ },
/* 59 */
/*!*****************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_iter-step.js ***!
  \*****************************************************************/
/***/ function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ },
/* 60 */
/*!******************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/es6.promise.js ***!
  \******************************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY            = __webpack_require__(/*! ./_library */ 32)
	  , global             = __webpack_require__(/*! ./_global */ 9)
	  , ctx                = __webpack_require__(/*! ./_ctx */ 11)
	  , classof            = __webpack_require__(/*! ./_classof */ 61)
	  , $export            = __webpack_require__(/*! ./_export */ 8)
	  , isObject           = __webpack_require__(/*! ./_is-object */ 16)
	  , anObject           = __webpack_require__(/*! ./_an-object */ 15)
	  , aFunction          = __webpack_require__(/*! ./_a-function */ 12)
	  , anInstance         = __webpack_require__(/*! ./_an-instance */ 62)
	  , forOf              = __webpack_require__(/*! ./_for-of */ 63)
	  , setProto           = __webpack_require__(/*! ./_set-proto */ 67).set
	  , speciesConstructor = __webpack_require__(/*! ./_species-constructor */ 70)
	  , task               = __webpack_require__(/*! ./_task */ 71).set
	  , microtask          = __webpack_require__(/*! ./_microtask */ 73)()
	  , PROMISE            = 'Promise'
	  , TypeError          = global.TypeError
	  , process            = global.process
	  , $Promise           = global[PROMISE]
	  , process            = global.process
	  , isNode             = classof(process) == 'process'
	  , empty              = function(){ /* empty */ }
	  , Internal, GenericPromiseCapability, Wrapper;
	
	var USE_NATIVE = !!function(){
	  try {
	    // correct subclassing with @@species support
	    var promise     = $Promise.resolve(1)
	      , FakePromise = (promise.constructor = {})[__webpack_require__(/*! ./_wks */ 53)('species')] = function(exec){ exec(empty, empty); };
	    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
	    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
	  } catch(e){ /* empty */ }
	}();
	
	// helpers
	var sameConstructor = function(a, b){
	  // with library wrapper special case
	  return a === b || a === $Promise && b === Wrapper;
	};
	var isThenable = function(it){
	  var then;
	  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
	};
	var newPromiseCapability = function(C){
	  return sameConstructor($Promise, C)
	    ? new PromiseCapability(C)
	    : new GenericPromiseCapability(C);
	};
	var PromiseCapability = GenericPromiseCapability = function(C){
	  var resolve, reject;
	  this.promise = new C(function($$resolve, $$reject){
	    if(resolve !== undefined || reject !== undefined)throw TypeError('Bad Promise constructor');
	    resolve = $$resolve;
	    reject  = $$reject;
	  });
	  this.resolve = aFunction(resolve);
	  this.reject  = aFunction(reject);
	};
	var perform = function(exec){
	  try {
	    exec();
	  } catch(e){
	    return {error: e};
	  }
	};
	var notify = function(promise, isReject){
	  if(promise._n)return;
	  promise._n = true;
	  var chain = promise._c;
	  microtask(function(){
	    var value = promise._v
	      , ok    = promise._s == 1
	      , i     = 0;
	    var run = function(reaction){
	      var handler = ok ? reaction.ok : reaction.fail
	        , resolve = reaction.resolve
	        , reject  = reaction.reject
	        , domain  = reaction.domain
	        , result, then;
	      try {
	        if(handler){
	          if(!ok){
	            if(promise._h == 2)onHandleUnhandled(promise);
	            promise._h = 1;
	          }
	          if(handler === true)result = value;
	          else {
	            if(domain)domain.enter();
	            result = handler(value);
	            if(domain)domain.exit();
	          }
	          if(result === reaction.promise){
	            reject(TypeError('Promise-chain cycle'));
	          } else if(then = isThenable(result)){
	            then.call(result, resolve, reject);
	          } else resolve(result);
	        } else reject(value);
	      } catch(e){
	        reject(e);
	      }
	    };
	    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
	    promise._c = [];
	    promise._n = false;
	    if(isReject && !promise._h)onUnhandled(promise);
	  });
	};
	var onUnhandled = function(promise){
	  task.call(global, function(){
	    var value = promise._v
	      , abrupt, handler, console;
	    if(isUnhandled(promise)){
	      abrupt = perform(function(){
	        if(isNode){
	          process.emit('unhandledRejection', value, promise);
	        } else if(handler = global.onunhandledrejection){
	          handler({promise: promise, reason: value});
	        } else if((console = global.console) && console.error){
	          console.error('Unhandled promise rejection', value);
	        }
	      });
	      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
	      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
	    } promise._a = undefined;
	    if(abrupt)throw abrupt.error;
	  });
	};
	var isUnhandled = function(promise){
	  if(promise._h == 1)return false;
	  var chain = promise._a || promise._c
	    , i     = 0
	    , reaction;
	  while(chain.length > i){
	    reaction = chain[i++];
	    if(reaction.fail || !isUnhandled(reaction.promise))return false;
	  } return true;
	};
	var onHandleUnhandled = function(promise){
	  task.call(global, function(){
	    var handler;
	    if(isNode){
	      process.emit('rejectionHandled', promise);
	    } else if(handler = global.onrejectionhandled){
	      handler({promise: promise, reason: promise._v});
	    }
	  });
	};
	var $reject = function(value){
	  var promise = this;
	  if(promise._d)return;
	  promise._d = true;
	  promise = promise._w || promise; // unwrap
	  promise._v = value;
	  promise._s = 2;
	  if(!promise._a)promise._a = promise._c.slice();
	  notify(promise, true);
	};
	var $resolve = function(value){
	  var promise = this
	    , then;
	  if(promise._d)return;
	  promise._d = true;
	  promise = promise._w || promise; // unwrap
	  try {
	    if(promise === value)throw TypeError("Promise can't be resolved itself");
	    if(then = isThenable(value)){
	      microtask(function(){
	        var wrapper = {_w: promise, _d: false}; // wrap
	        try {
	          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
	        } catch(e){
	          $reject.call(wrapper, e);
	        }
	      });
	    } else {
	      promise._v = value;
	      promise._s = 1;
	      notify(promise, false);
	    }
	  } catch(e){
	    $reject.call({_w: promise, _d: false}, e); // wrap
	  }
	};
	
	// constructor polyfill
	if(!USE_NATIVE){
	  // 25.4.3.1 Promise(executor)
	  $Promise = function Promise(executor){
	    anInstance(this, $Promise, PROMISE, '_h');
	    aFunction(executor);
	    Internal.call(this);
	    try {
	      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
	    } catch(err){
	      $reject.call(this, err);
	    }
	  };
	  Internal = function Promise(executor){
	    this._c = [];             // <- awaiting reactions
	    this._a = undefined;      // <- checked in isUnhandled reactions
	    this._s = 0;              // <- state
	    this._d = false;          // <- done
	    this._v = undefined;      // <- value
	    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
	    this._n = false;          // <- notify
	  };
	  Internal.prototype = __webpack_require__(/*! ./_redefine-all */ 74)($Promise.prototype, {
	    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
	    then: function then(onFulfilled, onRejected){
	      var reaction    = newPromiseCapability(speciesConstructor(this, $Promise));
	      reaction.ok     = typeof onFulfilled == 'function' ? onFulfilled : true;
	      reaction.fail   = typeof onRejected == 'function' && onRejected;
	      reaction.domain = isNode ? process.domain : undefined;
	      this._c.push(reaction);
	      if(this._a)this._a.push(reaction);
	      if(this._s)notify(this, false);
	      return reaction.promise;
	    },
	    // 25.4.5.1 Promise.prototype.catch(onRejected)
	    'catch': function(onRejected){
	      return this.then(undefined, onRejected);
	    }
	  });
	  PromiseCapability = function(){
	    var promise  = new Internal;
	    this.promise = promise;
	    this.resolve = ctx($resolve, promise, 1);
	    this.reject  = ctx($reject, promise, 1);
	  };
	}
	
	$export($export.G + $export.W + $export.F * !USE_NATIVE, {Promise: $Promise});
	__webpack_require__(/*! ./_set-to-string-tag */ 52)($Promise, PROMISE);
	__webpack_require__(/*! ./_set-species */ 75)(PROMISE);
	Wrapper = __webpack_require__(/*! ./_core */ 10)[PROMISE];
	
	// statics
	$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
	  // 25.4.4.5 Promise.reject(r)
	  reject: function reject(r){
	    var capability = newPromiseCapability(this)
	      , $$reject   = capability.reject;
	    $$reject(r);
	    return capability.promise;
	  }
	});
	$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
	  // 25.4.4.6 Promise.resolve(x)
	  resolve: function resolve(x){
	    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
	    if(x instanceof $Promise && sameConstructor(x.constructor, this))return x;
	    var capability = newPromiseCapability(this)
	      , $$resolve  = capability.resolve;
	    $$resolve(x);
	    return capability.promise;
	  }
	});
	$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(/*! ./_iter-detect */ 76)(function(iter){
	  $Promise.all(iter)['catch'](empty);
	})), PROMISE, {
	  // 25.4.4.1 Promise.all(iterable)
	  all: function all(iterable){
	    var C          = this
	      , capability = newPromiseCapability(C)
	      , resolve    = capability.resolve
	      , reject     = capability.reject;
	    var abrupt = perform(function(){
	      var values    = []
	        , index     = 0
	        , remaining = 1;
	      forOf(iterable, false, function(promise){
	        var $index        = index++
	          , alreadyCalled = false;
	        values.push(undefined);
	        remaining++;
	        C.resolve(promise).then(function(value){
	          if(alreadyCalled)return;
	          alreadyCalled  = true;
	          values[$index] = value;
	          --remaining || resolve(values);
	        }, reject);
	      });
	      --remaining || resolve(values);
	    });
	    if(abrupt)reject(abrupt.error);
	    return capability.promise;
	  },
	  // 25.4.4.4 Promise.race(iterable)
	  race: function race(iterable){
	    var C          = this
	      , capability = newPromiseCapability(C)
	      , reject     = capability.reject;
	    var abrupt = perform(function(){
	      forOf(iterable, false, function(promise){
	        C.resolve(promise).then(capability.resolve, reject);
	      });
	    });
	    if(abrupt)reject(abrupt.error);
	    return capability.promise;
	  }
	});

/***/ },
/* 61 */
/*!***************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_classof.js ***!
  \***************************************************************/
/***/ function(module, exports, __webpack_require__) {

	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(/*! ./_cof */ 43)
	  , TAG = __webpack_require__(/*! ./_wks */ 53)('toStringTag')
	  // ES3 wrong here
	  , ARG = cof(function(){ return arguments; }()) == 'Arguments';
	
	// fallback for IE11 Script Access Denied error
	var tryGet = function(it, key){
	  try {
	    return it[key];
	  } catch(e){ /* empty */ }
	};
	
	module.exports = function(it){
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
	    // builtinTag case
	    : ARG ? cof(O)
	    // ES3 arguments fallback
	    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

/***/ },
/* 62 */
/*!*******************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_an-instance.js ***!
  \*******************************************************************/
/***/ function(module, exports) {

	module.exports = function(it, Constructor, name, forbiddenField){
	  if(!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)){
	    throw TypeError(name + ': incorrect invocation!');
	  } return it;
	};

/***/ },
/* 63 */
/*!**************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_for-of.js ***!
  \**************************************************************/
/***/ function(module, exports, __webpack_require__) {

	var ctx         = __webpack_require__(/*! ./_ctx */ 11)
	  , call        = __webpack_require__(/*! ./_iter-call */ 64)
	  , isArrayIter = __webpack_require__(/*! ./_is-array-iter */ 65)
	  , anObject    = __webpack_require__(/*! ./_an-object */ 15)
	  , toLength    = __webpack_require__(/*! ./_to-length */ 45)
	  , getIterFn   = __webpack_require__(/*! ./core.get-iterator-method */ 66)
	  , BREAK       = {}
	  , RETURN      = {};
	var exports = module.exports = function(iterable, entries, fn, that, ITERATOR){
	  var iterFn = ITERATOR ? function(){ return iterable; } : getIterFn(iterable)
	    , f      = ctx(fn, that, entries ? 2 : 1)
	    , index  = 0
	    , length, step, iterator, result;
	  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
	  // fast case for arrays with default iterator
	  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
	    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
	    if(result === BREAK || result === RETURN)return result;
	  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
	    result = call(iterator, f, step.value, entries);
	    if(result === BREAK || result === RETURN)return result;
	  }
	};
	exports.BREAK  = BREAK;
	exports.RETURN = RETURN;

/***/ },
/* 64 */
/*!*****************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_iter-call.js ***!
  \*****************************************************************/
/***/ function(module, exports, __webpack_require__) {

	// call something on iterator step with safe closing on error
	var anObject = __webpack_require__(/*! ./_an-object */ 15);
	module.exports = function(iterator, fn, value, entries){
	  try {
	    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
	  // 7.4.6 IteratorClose(iterator, completion)
	  } catch(e){
	    var ret = iterator['return'];
	    if(ret !== undefined)anObject(ret.call(iterator));
	    throw e;
	  }
	};

/***/ },
/* 65 */
/*!*********************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_is-array-iter.js ***!
  \*********************************************************************/
/***/ function(module, exports, __webpack_require__) {

	// check on default Array iterator
	var Iterators  = __webpack_require__(/*! ./_iterators */ 35)
	  , ITERATOR   = __webpack_require__(/*! ./_wks */ 53)('iterator')
	  , ArrayProto = Array.prototype;
	
	module.exports = function(it){
	  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
	};

/***/ },
/* 66 */
/*!*******************************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/core.get-iterator-method.js ***!
  \*******************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	var classof   = __webpack_require__(/*! ./_classof */ 61)
	  , ITERATOR  = __webpack_require__(/*! ./_wks */ 53)('iterator')
	  , Iterators = __webpack_require__(/*! ./_iterators */ 35);
	module.exports = __webpack_require__(/*! ./_core */ 10).getIteratorMethod = function(it){
	  if(it != undefined)return it[ITERATOR]
	    || it['@@iterator']
	    || Iterators[classof(it)];
	};

/***/ },
/* 67 */
/*!*****************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_set-proto.js ***!
  \*****************************************************************/
/***/ function(module, exports, __webpack_require__) {

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var isObject = __webpack_require__(/*! ./_is-object */ 16)
	  , anObject = __webpack_require__(/*! ./_an-object */ 15);
	var check = function(O, proto){
	  anObject(O);
	  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
	};
	module.exports = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	    function(test, buggy, set){
	      try {
	        set = __webpack_require__(/*! ./_ctx */ 11)(Function.call, __webpack_require__(/*! ./_object-gopd */ 68).f(Object.prototype, '__proto__').set, 2);
	        set(test, []);
	        buggy = !(test instanceof Array);
	      } catch(e){ buggy = true; }
	      return function setPrototypeOf(O, proto){
	        check(O, proto);
	        if(buggy)O.__proto__ = proto;
	        else set(O, proto);
	        return O;
	      };
	    }({}, false) : undefined),
	  check: check
	};

/***/ },
/* 68 */
/*!*******************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_object-gopd.js ***!
  \*******************************************************************/
/***/ function(module, exports, __webpack_require__) {

	var pIE            = __webpack_require__(/*! ./_object-pie */ 69)
	  , createDesc     = __webpack_require__(/*! ./_property-desc */ 22)
	  , toIObject      = __webpack_require__(/*! ./_to-iobject */ 41)
	  , toPrimitive    = __webpack_require__(/*! ./_to-primitive */ 21)
	  , has            = __webpack_require__(/*! ./_has */ 34)
	  , IE8_DOM_DEFINE = __webpack_require__(/*! ./_ie8-dom-define */ 17)
	  , gOPD           = Object.getOwnPropertyDescriptor;
	
	exports.f = __webpack_require__(/*! ./_descriptors */ 18) ? gOPD : function getOwnPropertyDescriptor(O, P){
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if(IE8_DOM_DEFINE)try {
	    return gOPD(O, P);
	  } catch(e){ /* empty */ }
	  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
	};

/***/ },
/* 69 */
/*!******************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_object-pie.js ***!
  \******************************************************************/
/***/ function(module, exports) {

	exports.f = {}.propertyIsEnumerable;

/***/ },
/* 70 */
/*!***************************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_species-constructor.js ***!
  \***************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	// 7.3.20 SpeciesConstructor(O, defaultConstructor)
	var anObject  = __webpack_require__(/*! ./_an-object */ 15)
	  , aFunction = __webpack_require__(/*! ./_a-function */ 12)
	  , SPECIES   = __webpack_require__(/*! ./_wks */ 53)('species');
	module.exports = function(O, D){
	  var C = anObject(O).constructor, S;
	  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
	};

/***/ },
/* 71 */
/*!************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_task.js ***!
  \************************************************************/
/***/ function(module, exports, __webpack_require__) {

	var ctx                = __webpack_require__(/*! ./_ctx */ 11)
	  , invoke             = __webpack_require__(/*! ./_invoke */ 72)
	  , html               = __webpack_require__(/*! ./_html */ 51)
	  , cel                = __webpack_require__(/*! ./_dom-create */ 20)
	  , global             = __webpack_require__(/*! ./_global */ 9)
	  , process            = global.process
	  , setTask            = global.setImmediate
	  , clearTask          = global.clearImmediate
	  , MessageChannel     = global.MessageChannel
	  , counter            = 0
	  , queue              = {}
	  , ONREADYSTATECHANGE = 'onreadystatechange'
	  , defer, channel, port;
	var run = function(){
	  var id = +this;
	  if(queue.hasOwnProperty(id)){
	    var fn = queue[id];
	    delete queue[id];
	    fn();
	  }
	};
	var listener = function(event){
	  run.call(event.data);
	};
	// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
	if(!setTask || !clearTask){
	  setTask = function setImmediate(fn){
	    var args = [], i = 1;
	    while(arguments.length > i)args.push(arguments[i++]);
	    queue[++counter] = function(){
	      invoke(typeof fn == 'function' ? fn : Function(fn), args);
	    };
	    defer(counter);
	    return counter;
	  };
	  clearTask = function clearImmediate(id){
	    delete queue[id];
	  };
	  // Node.js 0.8-
	  if(__webpack_require__(/*! ./_cof */ 43)(process) == 'process'){
	    defer = function(id){
	      process.nextTick(ctx(run, id, 1));
	    };
	  // Browsers with MessageChannel, includes WebWorkers
	  } else if(MessageChannel){
	    channel = new MessageChannel;
	    port    = channel.port2;
	    channel.port1.onmessage = listener;
	    defer = ctx(port.postMessage, port, 1);
	  // Browsers with postMessage, skip WebWorkers
	  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
	  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScripts){
	    defer = function(id){
	      global.postMessage(id + '', '*');
	    };
	    global.addEventListener('message', listener, false);
	  // IE8-
	  } else if(ONREADYSTATECHANGE in cel('script')){
	    defer = function(id){
	      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
	        html.removeChild(this);
	        run.call(id);
	      };
	    };
	  // Rest old browsers
	  } else {
	    defer = function(id){
	      setTimeout(ctx(run, id, 1), 0);
	    };
	  }
	}
	module.exports = {
	  set:   setTask,
	  clear: clearTask
	};

/***/ },
/* 72 */
/*!**************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_invoke.js ***!
  \**************************************************************/
/***/ function(module, exports) {

	// fast apply, http://jsperf.lnkit.com/fast-apply/5
	module.exports = function(fn, args, that){
	  var un = that === undefined;
	  switch(args.length){
	    case 0: return un ? fn()
	                      : fn.call(that);
	    case 1: return un ? fn(args[0])
	                      : fn.call(that, args[0]);
	    case 2: return un ? fn(args[0], args[1])
	                      : fn.call(that, args[0], args[1]);
	    case 3: return un ? fn(args[0], args[1], args[2])
	                      : fn.call(that, args[0], args[1], args[2]);
	    case 4: return un ? fn(args[0], args[1], args[2], args[3])
	                      : fn.call(that, args[0], args[1], args[2], args[3]);
	  } return              fn.apply(that, args);
	};

/***/ },
/* 73 */
/*!*****************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_microtask.js ***!
  \*****************************************************************/
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(/*! ./_global */ 9)
	  , macrotask = __webpack_require__(/*! ./_task */ 71).set
	  , Observer  = global.MutationObserver || global.WebKitMutationObserver
	  , process   = global.process
	  , Promise   = global.Promise
	  , isNode    = __webpack_require__(/*! ./_cof */ 43)(process) == 'process';
	
	module.exports = function(){
	  var head, last, notify;
	
	  var flush = function(){
	    var parent, fn;
	    if(isNode && (parent = process.domain))parent.exit();
	    while(head){
	      fn   = head.fn;
	      head = head.next;
	      try {
	        fn();
	      } catch(e){
	        if(head)notify();
	        else last = undefined;
	        throw e;
	      }
	    } last = undefined;
	    if(parent)parent.enter();
	  };
	
	  // Node.js
	  if(isNode){
	    notify = function(){
	      process.nextTick(flush);
	    };
	  // browsers with MutationObserver
	  } else if(Observer){
	    var toggle = true
	      , node   = document.createTextNode('');
	    new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
	    notify = function(){
	      node.data = toggle = !toggle;
	    };
	  // environments with maybe non-completely correct, but existent Promise
	  } else if(Promise && Promise.resolve){
	    var promise = Promise.resolve();
	    notify = function(){
	      promise.then(flush);
	    };
	  // for other environments - macrotask based on:
	  // - setImmediate
	  // - MessageChannel
	  // - window.postMessag
	  // - onreadystatechange
	  // - setTimeout
	  } else {
	    notify = function(){
	      // strange IE + webpack dev server bug - use .call(global)
	      macrotask.call(global, flush);
	    };
	  }
	
	  return function(fn){
	    var task = {fn: fn, next: undefined};
	    if(last)last.next = task;
	    if(!head){
	      head = task;
	      notify();
	    } last = task;
	  };
	};

/***/ },
/* 74 */
/*!********************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_redefine-all.js ***!
  \********************************************************************/
/***/ function(module, exports, __webpack_require__) {

	var hide = __webpack_require__(/*! ./_hide */ 13);
	module.exports = function(target, src, safe){
	  for(var key in src){
	    if(safe && target[key])target[key] = src[key];
	    else hide(target, key, src[key]);
	  } return target;
	};

/***/ },
/* 75 */
/*!*******************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_set-species.js ***!
  \*******************************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var global      = __webpack_require__(/*! ./_global */ 9)
	  , core        = __webpack_require__(/*! ./_core */ 10)
	  , dP          = __webpack_require__(/*! ./_object-dp */ 14)
	  , DESCRIPTORS = __webpack_require__(/*! ./_descriptors */ 18)
	  , SPECIES     = __webpack_require__(/*! ./_wks */ 53)('species');
	
	module.exports = function(KEY){
	  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
	  if(DESCRIPTORS && C && !C[SPECIES])dP.f(C, SPECIES, {
	    configurable: true,
	    get: function(){ return this; }
	  });
	};

/***/ },
/* 76 */
/*!*******************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_iter-detect.js ***!
  \*******************************************************************/
/***/ function(module, exports, __webpack_require__) {

	var ITERATOR     = __webpack_require__(/*! ./_wks */ 53)('iterator')
	  , SAFE_CLOSING = false;
	
	try {
	  var riter = [7][ITERATOR]();
	  riter['return'] = function(){ SAFE_CLOSING = true; };
	  Array.from(riter, function(){ throw 2; });
	} catch(e){ /* empty */ }
	
	module.exports = function(exec, skipClosing){
	  if(!skipClosing && !SAFE_CLOSING)return false;
	  var safe = false;
	  try {
	    var arr  = [7]
	      , iter = arr[ITERATOR]();
	    iter.next = function(){ return {done: safe = true}; };
	    arr[ITERATOR] = function(){ return iter; };
	    exec(arr);
	  } catch(e){ /* empty */ }
	  return safe;
	};

/***/ },
/* 77 */
/*!******************************************!*\
  !*** ./src/core/loaders/audio-loader.js ***!
  \******************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _promise = __webpack_require__(/*! babel-runtime/core-js/promise */ 24);
	
	var _promise2 = _interopRequireDefault(_promise);
	
	var _getPrototypeOf = __webpack_require__(/*! babel-runtime/core-js/object/get-prototype-of */ 78);
	
	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
	
	var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ 3);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ 4);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _possibleConstructorReturn2 = __webpack_require__(/*! babel-runtime/helpers/possibleConstructorReturn */ 82);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _get2 = __webpack_require__(/*! babel-runtime/helpers/get */ 100);
	
	var _get3 = _interopRequireDefault(_get2);
	
	var _inherits2 = __webpack_require__(/*! babel-runtime/helpers/inherits */ 104);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	var _loader = __webpack_require__(/*! ./loader */ 23);
	
	var _loader2 = _interopRequireDefault(_loader);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * A class that provides Promise-based, asynchronous audio loading/decoding.
	 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/decodeAudioData
	 * @example
	 * const context = new AudioContext();
	 * const audioLoader = new WeaverLib.core.AudioLoader(context);
	 *
	 * audioLoader.load([
	 *   'url/to/audio/1.m4a',
	 *   'url/to/audio/2.m4a'
	 * ]).then((decodedAudioArray) => {
	 *   // Use the decoded audio (decodedAudioArray[0], decodedAudioArray[1])
	 * }).catch((error) => {
	 *   console.log(error);
	 * });;
	 */
	
	var AudioLoader = function (_Loader) {
	  (0, _inherits3.default)(AudioLoader, _Loader);
	
	  /**
	   * Constructs a new {@link AudioLoader}.
	   * @param  {!AudioContext} context
	   *         The {@link AudioContext} to associate with the
	   *         {@link CompoundNode}.
	   */
	
	  function AudioLoader(context) {
	    (0, _classCallCheck3.default)(this, AudioLoader);
	
	    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(AudioLoader).call(this, 'arraybuffer'));
	
	    _this._context = context;
	    return _this;
	  }
	
	  /**
	   * Loads and decodes one or more audio files asynchronously.
	   * @override
	   * @param  {!(string|string[])} urls
	   *         A single url or list of urls of audio files to load and decode.
	   * @return {Promise}
	   *         A Promise that resolves when all audio files have been loaded and
	   *         decoded.
	   */
	
	
	  (0, _createClass3.default)(AudioLoader, [{
	    key: 'load',
	    value: function load(urls) {
	      return (0, _get3.default)((0, _getPrototypeOf2.default)(AudioLoader.prototype), 'load', this).call(this, urls);
	    }
	
	    /**
	     * @private
	     * Loads and decodes one audio file asynchronously.
	     * @param  {!string} url
	     *         A single url of an audio file to load and decoded.
	     * @return {Promise}
	     *         A Promise that resolves when the file has been loaded and decoded.
	     */
	
	  }, {
	    key: '_loadOne',
	    value: function _loadOne(url) {
	      var _this2 = this;
	
	      return (0, _get3.default)((0, _getPrototypeOf2.default)(AudioLoader.prototype), '_loadOne', this).call(this, url).then(function (data) {
	        return _this2._decode(data);
	      }); // ORG FAILED but now ok??
	
	      /*
	      //TEST - fails if add newlines but dont *return* this._decode(data);
	      return ( super._loadOne(url)
	        .then((data) => {
	          //this._decode(data)
	          return this._decode(data);
	        })
	      );
	      */
	
	      // return super._loadOne(url).then((data) => {return this._decode(data)});  // FIXED
	    }
	
	    /**
	     * @private
	     * Decodes one audio file asynchronously.
	     * @see https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/decodeAudioData
	     * @param  {!ArrayBuffer} data
	     *         An ArrayBuffer containing the audio data to be decoded.
	     * @return {Promise}
	     *         A Promise that resolves when the audio data has been decoded.
	     */
	
	  }, {
	    key: '_decode',
	    value: function _decode(data) {
	      var _this3 = this;
	
	      return new _promise2.default(function (resolve, reject) {
	        // Data must be copied to avoid issue with firefox losing reference.
	        _this3._context.decodeAudioData(data.slice(0), resolve, reject);
	      });
	    }
	  }]);
	  return AudioLoader;
	}(_loader2.default);
	
	exports.default = AudioLoader;

/***/ },
/* 78 */
/*!************************************************************!*\
  !*** ./~/babel-runtime/core-js/object/get-prototype-of.js ***!
  \************************************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(/*! core-js/library/fn/object/get-prototype-of */ 79), __esModule: true };

/***/ },
/* 79 */
/*!*************************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/fn/object/get-prototype-of.js ***!
  \*************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(/*! ../../modules/es6.object.get-prototype-of */ 80);
	module.exports = __webpack_require__(/*! ../../modules/_core */ 10).Object.getPrototypeOf;

/***/ },
/* 80 */
/*!**********************************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/es6.object.get-prototype-of.js ***!
  \**********************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.9 Object.getPrototypeOf(O)
	var toObject        = __webpack_require__(/*! ./_to-object */ 55)
	  , $getPrototypeOf = __webpack_require__(/*! ./_object-gpo */ 54);
	
	__webpack_require__(/*! ./_object-sap */ 81)('getPrototypeOf', function(){
	  return function getPrototypeOf(it){
	    return $getPrototypeOf(toObject(it));
	  };
	});

/***/ },
/* 81 */
/*!******************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_object-sap.js ***!
  \******************************************************************/
/***/ function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(/*! ./_export */ 8)
	  , core    = __webpack_require__(/*! ./_core */ 10)
	  , fails   = __webpack_require__(/*! ./_fails */ 19);
	module.exports = function(KEY, exec){
	  var fn  = (core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
	};

/***/ },
/* 82 */
/*!**************************************************************!*\
  !*** ./~/babel-runtime/helpers/possibleConstructorReturn.js ***!
  \**************************************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _typeof2 = __webpack_require__(/*! ../helpers/typeof */ 83);
	
	var _typeof3 = _interopRequireDefault(_typeof2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }
	
	  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
	};

/***/ },
/* 83 */
/*!*******************************************!*\
  !*** ./~/babel-runtime/helpers/typeof.js ***!
  \*******************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _iterator = __webpack_require__(/*! ../core-js/symbol/iterator */ 84);
	
	var _iterator2 = _interopRequireDefault(_iterator);
	
	var _symbol = __webpack_require__(/*! ../core-js/symbol */ 87);
	
	var _symbol2 = _interopRequireDefault(_symbol);
	
	var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj; };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};

/***/ },
/* 84 */
/*!****************************************************!*\
  !*** ./~/babel-runtime/core-js/symbol/iterator.js ***!
  \****************************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(/*! core-js/library/fn/symbol/iterator */ 85), __esModule: true };

/***/ },
/* 85 */
/*!*****************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/fn/symbol/iterator.js ***!
  \*****************************************************************/
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(/*! ../../modules/es6.string.iterator */ 27);
	__webpack_require__(/*! ../../modules/web.dom.iterable */ 56);
	module.exports = __webpack_require__(/*! ../../modules/_wks-ext */ 86).f('iterator');

/***/ },
/* 86 */
/*!***************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_wks-ext.js ***!
  \***************************************************************/
/***/ function(module, exports, __webpack_require__) {

	exports.f = __webpack_require__(/*! ./_wks */ 53);

/***/ },
/* 87 */
/*!*******************************************!*\
  !*** ./~/babel-runtime/core-js/symbol.js ***!
  \*******************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(/*! core-js/library/fn/symbol */ 88), __esModule: true };

/***/ },
/* 88 */
/*!**************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/fn/symbol/index.js ***!
  \**************************************************************/
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(/*! ../../modules/es6.symbol */ 89);
	__webpack_require__(/*! ../../modules/es6.object.to-string */ 26);
	__webpack_require__(/*! ../../modules/es7.symbol.async-iterator */ 98);
	__webpack_require__(/*! ../../modules/es7.symbol.observable */ 99);
	module.exports = __webpack_require__(/*! ../../modules/_core */ 10).Symbol;

/***/ },
/* 89 */
/*!*****************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/es6.symbol.js ***!
  \*****************************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var global         = __webpack_require__(/*! ./_global */ 9)
	  , has            = __webpack_require__(/*! ./_has */ 34)
	  , DESCRIPTORS    = __webpack_require__(/*! ./_descriptors */ 18)
	  , $export        = __webpack_require__(/*! ./_export */ 8)
	  , redefine       = __webpack_require__(/*! ./_redefine */ 33)
	  , META           = __webpack_require__(/*! ./_meta */ 90).KEY
	  , $fails         = __webpack_require__(/*! ./_fails */ 19)
	  , shared         = __webpack_require__(/*! ./_shared */ 48)
	  , setToStringTag = __webpack_require__(/*! ./_set-to-string-tag */ 52)
	  , uid            = __webpack_require__(/*! ./_uid */ 49)
	  , wks            = __webpack_require__(/*! ./_wks */ 53)
	  , wksExt         = __webpack_require__(/*! ./_wks-ext */ 86)
	  , wksDefine      = __webpack_require__(/*! ./_wks-define */ 91)
	  , keyOf          = __webpack_require__(/*! ./_keyof */ 92)
	  , enumKeys       = __webpack_require__(/*! ./_enum-keys */ 93)
	  , isArray        = __webpack_require__(/*! ./_is-array */ 95)
	  , anObject       = __webpack_require__(/*! ./_an-object */ 15)
	  , toIObject      = __webpack_require__(/*! ./_to-iobject */ 41)
	  , toPrimitive    = __webpack_require__(/*! ./_to-primitive */ 21)
	  , createDesc     = __webpack_require__(/*! ./_property-desc */ 22)
	  , _create        = __webpack_require__(/*! ./_object-create */ 37)
	  , gOPNExt        = __webpack_require__(/*! ./_object-gopn-ext */ 96)
	  , $GOPD          = __webpack_require__(/*! ./_object-gopd */ 68)
	  , $DP            = __webpack_require__(/*! ./_object-dp */ 14)
	  , $keys          = __webpack_require__(/*! ./_object-keys */ 39)
	  , gOPD           = $GOPD.f
	  , dP             = $DP.f
	  , gOPN           = gOPNExt.f
	  , $Symbol        = global.Symbol
	  , $JSON          = global.JSON
	  , _stringify     = $JSON && $JSON.stringify
	  , PROTOTYPE      = 'prototype'
	  , HIDDEN         = wks('_hidden')
	  , TO_PRIMITIVE   = wks('toPrimitive')
	  , isEnum         = {}.propertyIsEnumerable
	  , SymbolRegistry = shared('symbol-registry')
	  , AllSymbols     = shared('symbols')
	  , OPSymbols      = shared('op-symbols')
	  , ObjectProto    = Object[PROTOTYPE]
	  , USE_NATIVE     = typeof $Symbol == 'function'
	  , QObject        = global.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;
	
	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = DESCRIPTORS && $fails(function(){
	  return _create(dP({}, 'a', {
	    get: function(){ return dP(this, 'a', {value: 7}).a; }
	  })).a != 7;
	}) ? function(it, key, D){
	  var protoDesc = gOPD(ObjectProto, key);
	  if(protoDesc)delete ObjectProto[key];
	  dP(it, key, D);
	  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
	} : dP;
	
	var wrap = function(tag){
	  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
	  sym._k = tag;
	  return sym;
	};
	
	var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
	  return typeof it == 'symbol';
	} : function(it){
	  return it instanceof $Symbol;
	};
	
	var $defineProperty = function defineProperty(it, key, D){
	  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
	  anObject(it);
	  key = toPrimitive(key, true);
	  anObject(D);
	  if(has(AllSymbols, key)){
	    if(!D.enumerable){
	      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
	      D = _create(D, {enumerable: createDesc(0, false)});
	    } return setSymbolDesc(it, key, D);
	  } return dP(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P){
	  anObject(it);
	  var keys = enumKeys(P = toIObject(P))
	    , i    = 0
	    , l = keys.length
	    , key;
	  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P){
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key){
	  var E = isEnum.call(this, key = toPrimitive(key, true));
	  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
	  it  = toIObject(it);
	  key = toPrimitive(key, true);
	  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
	  var D = gOPD(it, key);
	  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it){
	  var names  = gOPN(toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
	  } return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
	  var IS_OP  = it === ObjectProto
	    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
	  } return result;
	};
	
	// 19.4.1.1 Symbol([description])
	if(!USE_NATIVE){
	  $Symbol = function Symbol(){
	    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
	    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
	    var $set = function(value){
	      if(this === ObjectProto)$set.call(OPSymbols, value);
	      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    };
	    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
	    return wrap(tag);
	  };
	  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
	    return this._k;
	  });
	
	  $GOPD.f = $getOwnPropertyDescriptor;
	  $DP.f   = $defineProperty;
	  __webpack_require__(/*! ./_object-gopn */ 97).f = gOPNExt.f = $getOwnPropertyNames;
	  __webpack_require__(/*! ./_object-pie */ 69).f  = $propertyIsEnumerable;
	  __webpack_require__(/*! ./_object-gops */ 94).f = $getOwnPropertySymbols;
	
	  if(DESCRIPTORS && !__webpack_require__(/*! ./_library */ 32)){
	    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }
	
	  wksExt.f = function(name){
	    return wrap(wks(name));
	  }
	}
	
	$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});
	
	for(var symbols = (
	  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
	  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
	).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);
	
	for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);
	
	$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function(key){
	    return has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(key){
	    if(isSymbol(key))return keyOf(SymbolRegistry, key);
	    throw TypeError(key + ' is not a symbol!');
	  },
	  useSetter: function(){ setter = true; },
	  useSimple: function(){ setter = false; }
	});
	
	$export($export.S + $export.F * !USE_NATIVE, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});
	
	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
	})), 'JSON', {
	  stringify: function stringify(it){
	    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
	    var args = [it]
	      , i    = 1
	      , replacer, $replacer;
	    while(arguments.length > i)args.push(arguments[i++]);
	    replacer = args[1];
	    if(typeof replacer == 'function')$replacer = replacer;
	    if($replacer || !isArray(replacer))replacer = function(key, value){
	      if($replacer)value = $replacer.call(this, key, value);
	      if(!isSymbol(value))return value;
	    };
	    args[1] = replacer;
	    return _stringify.apply($JSON, args);
	  }
	});
	
	// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
	$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(/*! ./_hide */ 13)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ },
/* 90 */
/*!************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_meta.js ***!
  \************************************************************/
/***/ function(module, exports, __webpack_require__) {

	var META     = __webpack_require__(/*! ./_uid */ 49)('meta')
	  , isObject = __webpack_require__(/*! ./_is-object */ 16)
	  , has      = __webpack_require__(/*! ./_has */ 34)
	  , setDesc  = __webpack_require__(/*! ./_object-dp */ 14).f
	  , id       = 0;
	var isExtensible = Object.isExtensible || function(){
	  return true;
	};
	var FREEZE = !__webpack_require__(/*! ./_fails */ 19)(function(){
	  return isExtensible(Object.preventExtensions({}));
	});
	var setMeta = function(it){
	  setDesc(it, META, {value: {
	    i: 'O' + ++id, // object ID
	    w: {}          // weak collections IDs
	  }});
	};
	var fastKey = function(it, create){
	  // return primitive with prefix
	  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return 'F';
	    // not necessary to add metadata
	    if(!create)return 'E';
	    // add missing metadata
	    setMeta(it);
	  // return object ID
	  } return it[META].i;
	};
	var getWeak = function(it, create){
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return true;
	    // not necessary to add metadata
	    if(!create)return false;
	    // add missing metadata
	    setMeta(it);
	  // return hash weak collections IDs
	  } return it[META].w;
	};
	// add metadata on freeze-family methods calling
	var onFreeze = function(it){
	  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
	  return it;
	};
	var meta = module.exports = {
	  KEY:      META,
	  NEED:     false,
	  fastKey:  fastKey,
	  getWeak:  getWeak,
	  onFreeze: onFreeze
	};

/***/ },
/* 91 */
/*!******************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_wks-define.js ***!
  \******************************************************************/
/***/ function(module, exports, __webpack_require__) {

	var global         = __webpack_require__(/*! ./_global */ 9)
	  , core           = __webpack_require__(/*! ./_core */ 10)
	  , LIBRARY        = __webpack_require__(/*! ./_library */ 32)
	  , wksExt         = __webpack_require__(/*! ./_wks-ext */ 86)
	  , defineProperty = __webpack_require__(/*! ./_object-dp */ 14).f;
	module.exports = function(name){
	  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
	  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
	};

/***/ },
/* 92 */
/*!*************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_keyof.js ***!
  \*************************************************************/
/***/ function(module, exports, __webpack_require__) {

	var getKeys   = __webpack_require__(/*! ./_object-keys */ 39)
	  , toIObject = __webpack_require__(/*! ./_to-iobject */ 41);
	module.exports = function(object, el){
	  var O      = toIObject(object)
	    , keys   = getKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

/***/ },
/* 93 */
/*!*****************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_enum-keys.js ***!
  \*****************************************************************/
/***/ function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var getKeys = __webpack_require__(/*! ./_object-keys */ 39)
	  , gOPS    = __webpack_require__(/*! ./_object-gops */ 94)
	  , pIE     = __webpack_require__(/*! ./_object-pie */ 69);
	module.exports = function(it){
	  var result     = getKeys(it)
	    , getSymbols = gOPS.f;
	  if(getSymbols){
	    var symbols = getSymbols(it)
	      , isEnum  = pIE.f
	      , i       = 0
	      , key;
	    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
	  } return result;
	};

/***/ },
/* 94 */
/*!*******************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_object-gops.js ***!
  \*******************************************************************/
/***/ function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;

/***/ },
/* 95 */
/*!****************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_is-array.js ***!
  \****************************************************************/
/***/ function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(/*! ./_cof */ 43);
	module.exports = Array.isArray || function isArray(arg){
	  return cof(arg) == 'Array';
	};

/***/ },
/* 96 */
/*!***********************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_object-gopn-ext.js ***!
  \***********************************************************************/
/***/ function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(/*! ./_to-iobject */ 41)
	  , gOPN      = __webpack_require__(/*! ./_object-gopn */ 97).f
	  , toString  = {}.toString;
	
	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];
	
	var getWindowNames = function(it){
	  try {
	    return gOPN(it);
	  } catch(e){
	    return windowNames.slice();
	  }
	};
	
	module.exports.f = function getOwnPropertyNames(it){
	  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
	};


/***/ },
/* 97 */
/*!*******************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_object-gopn.js ***!
  \*******************************************************************/
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys      = __webpack_require__(/*! ./_object-keys-internal */ 40)
	  , hiddenKeys = __webpack_require__(/*! ./_enum-bug-keys */ 50).concat('length', 'prototype');
	
	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
	  return $keys(O, hiddenKeys);
	};

/***/ },
/* 98 */
/*!********************************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/es7.symbol.async-iterator.js ***!
  \********************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(/*! ./_wks-define */ 91)('asyncIterator');

/***/ },
/* 99 */
/*!****************************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/es7.symbol.observable.js ***!
  \****************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(/*! ./_wks-define */ 91)('observable');

/***/ },
/* 100 */
/*!****************************************!*\
  !*** ./~/babel-runtime/helpers/get.js ***!
  \****************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _getPrototypeOf = __webpack_require__(/*! ../core-js/object/get-prototype-of */ 78);
	
	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
	
	var _getOwnPropertyDescriptor = __webpack_require__(/*! ../core-js/object/get-own-property-descriptor */ 101);
	
	var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function get(object, property, receiver) {
	  if (object === null) object = Function.prototype;
	  var desc = (0, _getOwnPropertyDescriptor2.default)(object, property);
	
	  if (desc === undefined) {
	    var parent = (0, _getPrototypeOf2.default)(object);
	
	    if (parent === null) {
	      return undefined;
	    } else {
	      return get(parent, property, receiver);
	    }
	  } else if ("value" in desc) {
	    return desc.value;
	  } else {
	    var getter = desc.get;
	
	    if (getter === undefined) {
	      return undefined;
	    }
	
	    return getter.call(receiver);
	  }
	};

/***/ },
/* 101 */
/*!***********************************************************************!*\
  !*** ./~/babel-runtime/core-js/object/get-own-property-descriptor.js ***!
  \***********************************************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(/*! core-js/library/fn/object/get-own-property-descriptor */ 102), __esModule: true };

/***/ },
/* 102 */
/*!************************************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/fn/object/get-own-property-descriptor.js ***!
  \************************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(/*! ../../modules/es6.object.get-own-property-descriptor */ 103);
	var $Object = __webpack_require__(/*! ../../modules/_core */ 10).Object;
	module.exports = function getOwnPropertyDescriptor(it, key){
	  return $Object.getOwnPropertyDescriptor(it, key);
	};

/***/ },
/* 103 */
/*!*********************************************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/es6.object.get-own-property-descriptor.js ***!
  \*********************************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	var toIObject                 = __webpack_require__(/*! ./_to-iobject */ 41)
	  , $getOwnPropertyDescriptor = __webpack_require__(/*! ./_object-gopd */ 68).f;
	
	__webpack_require__(/*! ./_object-sap */ 81)('getOwnPropertyDescriptor', function(){
	  return function getOwnPropertyDescriptor(it, key){
	    return $getOwnPropertyDescriptor(toIObject(it), key);
	  };
	});

/***/ },
/* 104 */
/*!*********************************************!*\
  !*** ./~/babel-runtime/helpers/inherits.js ***!
  \*********************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _setPrototypeOf = __webpack_require__(/*! ../core-js/object/set-prototype-of */ 105);
	
	var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);
	
	var _create = __webpack_require__(/*! ../core-js/object/create */ 108);
	
	var _create2 = _interopRequireDefault(_create);
	
	var _typeof2 = __webpack_require__(/*! ../helpers/typeof */ 83);
	
	var _typeof3 = _interopRequireDefault(_typeof2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
	  }
	
	  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
	};

/***/ },
/* 105 */
/*!************************************************************!*\
  !*** ./~/babel-runtime/core-js/object/set-prototype-of.js ***!
  \************************************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(/*! core-js/library/fn/object/set-prototype-of */ 106), __esModule: true };

/***/ },
/* 106 */
/*!*************************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/fn/object/set-prototype-of.js ***!
  \*************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(/*! ../../modules/es6.object.set-prototype-of */ 107);
	module.exports = __webpack_require__(/*! ../../modules/_core */ 10).Object.setPrototypeOf;

/***/ },
/* 107 */
/*!**********************************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/es6.object.set-prototype-of.js ***!
  \**********************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.19 Object.setPrototypeOf(O, proto)
	var $export = __webpack_require__(/*! ./_export */ 8);
	$export($export.S, 'Object', {setPrototypeOf: __webpack_require__(/*! ./_set-proto */ 67).set});

/***/ },
/* 108 */
/*!**************************************************!*\
  !*** ./~/babel-runtime/core-js/object/create.js ***!
  \**************************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(/*! core-js/library/fn/object/create */ 109), __esModule: true };

/***/ },
/* 109 */
/*!***************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/fn/object/create.js ***!
  \***************************************************************/
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(/*! ../../modules/es6.object.create */ 110);
	var $Object = __webpack_require__(/*! ../../modules/_core */ 10).Object;
	module.exports = function create(P, D){
	  return $Object.create(P, D);
	};

/***/ },
/* 110 */
/*!************************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/es6.object.create.js ***!
  \************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(/*! ./_export */ 8)
	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	$export($export.S, 'Object', {create: __webpack_require__(/*! ./_object-create */ 37)});

/***/ },
/* 111 */
/*!*******************************!*\
  !*** ./src/effects/_index.js ***!
  \*******************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.OpenAirLibInfo = exports.OpenAirLibNode = undefined;
	
	var _openAirLib = __webpack_require__(/*! ./open-air-lib */ 112);
	
	var _openAirLib2 = _interopRequireDefault(_openAirLib);
	
	var _openAirLibInfo = __webpack_require__(/*! ./open-air-lib-info */ 134);
	
	var _openAirLibInfo2 = _interopRequireDefault(_openAirLibInfo);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.OpenAirLibNode = _openAirLib2.default;
	exports.OpenAirLibInfo = _openAirLibInfo2.default;

/***/ },
/* 112 */
/*!*************************************!*\
  !*** ./src/effects/open-air-lib.js ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _promise = __webpack_require__(/*! babel-runtime/core-js/promise */ 24);
	
	var _promise2 = _interopRequireDefault(_promise);
	
	var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ 3);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ 4);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _audioLoader = __webpack_require__(/*! ../core/loaders/audio-loader.js */ 77);
	
	var _audioLoader2 = _interopRequireDefault(_audioLoader);
	
	var _kxOmnitone = __webpack_require__(/*! ../kx-omnitone/kx-omnitone.js */ 113);
	
	var _kxOmnitone2 = _interopRequireDefault(_kxOmnitone);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/*
	  open-air-lib.js
	  K Brown
	  University of York
	  M Paradis
	  BBC Audio Research
	
	  OpenAirLibNode
	
	*/
	
	var OpenAirLibNode = function () {
	
	  // LOCAL TEST constructor(context, urlbase = 'http://localhost:3000', test = false) {
	  //  constructor(context, urlbase = 'oadev.york.ac.uk/irserver', test = false) {
	  function OpenAirLibNode(context) {
	    var urlbase = arguments.length <= 1 || arguments[1] === undefined ? 'www.openairlib.net/irserver' : arguments[1];
	    var test = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
	    (0, _classCallCheck3.default)(this, OpenAirLibNode);
	
	    this._context = context;
	    this._url_base = urlbase;
	    this._url_suffix_filefromurl = '/filefromrurl?d=';
	
	    this._input = context.createGain();
	    this._output = context.createGain();
	    this._output.channelCountMode = 'explicit';
	    this._output.channelCount = 2;
	
	    this._info = {};
	    this._info.rurl = '';
	    this._info.nchans = 0; // of the loaded IR
	    this._info.sr = 0;
	    this._info.length = 0; // n frames
	    this._convs = [];
	    this._LOGSRMM = false;
	
	    // TEST
	    if (test) {
	      var testOsc = context.createOscillator();
	      testOsc.connect(this._output);
	      testOsc.start();
	    }
	  }
	
	  // return the input node
	
	
	  (0, _createClass3.default)(OpenAirLibNode, [{
	    key: 'connect',
	
	
	    // connect this output node to another specified node
	    value: function connect(node) {
	      this._output.connect(node);
	    }
	
	    // disconnect tbis output node from any nodes it is connected to
	
	  }, {
	    key: 'disconnect',
	    value: function disconnect() {
	      this._output.disconnect();
	    }
	
	    // get this gain value (output gain)
	
	  }, {
	    key: '_isValidNChans',
	    value: function _isValidNChans(nchans) {
	      return nchans === 1 | nchans === 2 | nchans === 4;
	      // WAA conv does not support others unless split manually...
	      // https://webaudio.github.io/web-audio-api/#idl-def-ConvolverNode
	    }
	
	    // internal function called within successful load()
	
	  }, {
	    key: '_constructIOGraph',
	    value: function _constructIOGraph(ninputchans, bufnchans, irbuffer) {
	      var _this = this;
	
	      this._output.gain.value = 0; // vol down first
	
	      /*
	        latest WAA discussion / proposal
	        https://github.com/WebAudio/web-audio-api/issues/942
	        has convolver explicitly set to channelCount 2 so >2-chans-in gets downmixed
	        to 2 or mono-in gets upmixed to 2. If IR itself is 1 it gets internally duplicated to 2.
	        IR of 4 is for true stereo. conv output will always be stereo.
	        however not sure when above will be implemented in browsers?
	        at pres ie eo Sept 2016,
	        OLD DIAGRAM: https://webaudio.github.io/web-audio-api/#Convolution-channel-configurations
	         Probably only curr & future safe course of action is to use one or two, 2-chan convolvers
	        if IR is one chan, dup it explicitly into 2 chan buffer use one conv
	        if IR is 2 chan just use it in the one conv
	        if IR is 4 chan split into 2 sep 2 chan buffers & use 2 convolvers.
	         output node will always be 2 chans, but if IR is 4 chan, use omnitone to render back down
	        to 2 chan (binaural). intermediate step will split each of the conv s to 2 then use a 4 chan
	        merger to supply single 4 chan data stream to omnione.
	      */
	
	      // src: force upmix if < 2 or downmix if > 2 chans
	      // if chans is already 2 will just be an extra gain node
	      // if _auxin already existed, recreate will implicitly disconnect w/o danger of throw
	      // if not connected
	      this._auxin = this._context.createGain();
	      this._auxin.channelCountMode = 'explicit';
	      this._auxin.channelCount = 2;
	      this.input.connect(this._auxin);
	
	      // create/destroy convs if necc so correct count
	      if (this._convs.length === 0) {
	        // always need at least one (stereo)convolver...
	        this._convs.push(this._context.createConvolver());
	      }
	      if (this._convs.length === 2 && bufnchans < 4) {
	        this._convs[1] = undefined;
	        this._convs.pop();
	      }
	      if (this._convs.length === 1 && bufnchans === 4) {
	        this._convs.push(this._context.createConvolver());
	      }
	
	      // may now need to split/duplicate the IRbuffer dep on irbuffer.numberOfChannels
	
	      // now load IRs into convs as necc
	
	      if (bufnchans === 2) {
	        // simple case: stereo
	        this._convs[0].buffer = irbuffer;
	        this._auxin.connect(this._convs[0]);
	        this._convs[0].connect(this._output);
	        // dont return - need to reenable output gain
	      } else {
	        var tmpbuf = void 0;
	        var tmparray = void 0;
	        var abo = {}; // AudioBufferOptions - mandatory Oct 2016+ spec
	        abo.length = irbuffer.length;
	        abo.sampleRate = irbuffer.sampleRate;
	        abo.numberOfChannels = 2;
	        try {
	          tmpbuf = this._context.createBuffer(abo);
	        } catch (err) {
	          tmpbuf = this._context.createBuffer(abo.numberOfChannels, abo.length, abo.sampleRate);
	        }
	        if (bufnchans === 1) {
	          tmparray = new Float32Array(abo.length);
	          // dup irbuffer into both chans
	          irbuffer.copyFromChannel(tmparray, 0, 0);
	          tmpbuf.copyToChannel(tmparray, 0, 0);
	          tmpbuf.copyToChannel(tmparray, 1, 0);
	          this._convs[0].buffer = tmpbuf;
	          this._auxin.connect(this._convs[0]);
	          this._convs[0].connect(this._output);
	          // dont return - need to reenable output gain
	        }
	        if (bufnchans === 4) {
	          // copy 0 and 1 from 4chanbuffer to 0 and 1 in stereo buffer
	          tmparray = new Float32Array(abo.length);
	          irbuffer.copyFromChannel(tmparray, 0, 0);
	          tmpbuf.copyToChannel(tmparray, 0, 0);
	          irbuffer.copyFromChannel(tmparray, 1, 0);
	          tmpbuf.copyToChannel(tmparray, 1, 0);
	          this._convs[0].buffer = tmpbuf;
	
	          // create another for 2nd convolver JIC it doesnt copy the data... TBA
	          try {
	            tmpbuf = this._context.createBuffer(abo);
	          } catch (err) {
	            tmpbuf = this._context.createBuffer(abo.numberOfChannels, abo.length, abo.sampleRate);
	          }
	          // copy 2 and 3 from 4chanbuffer to 0 and 1 in stereo buffer
	          irbuffer.copyFromChannel(tmparray, 2, 0);
	          tmpbuf.copyToChannel(tmparray, 0, 0);
	          irbuffer.copyFromChannel(tmparray, 3, 0);
	          tmpbuf.copyToChannel(tmparray, 1, 0);
	          this._convs[1].buffer = tmpbuf;
	
	          this._auxin.connect(this._convs[0]);
	          this._auxin.connect(this._convs[1]);
	
	          if (this._split1 === undefined) {
	            this._split1 = this._context.createChannelSplitter(2);
	          }
	          if (this._split2 === undefined) {
	            this._split2 = this._context.createChannelSplitter(2);
	          }
	
	          this._convs[0].connect(this._split1);
	          this._convs[1].connect(this._split2);
	          if (this._merge4 === undefined) {
	            this._merge4 = this._context.createChannelMerger(4);
	          }
	
	          if (this._FOADecoder === undefined) {
	            // ALL OALib 4 chan IRs are currently WXYZ, also no chan ordering stats avail from SQL
	            // so have to assume WXYZ FuMa is the std, & always map as such.
	            var channelMap = [0, 3, 1, 2]; // W=0,Y=1,Z=2,X=3->WXYZ ie 0312 remap
	            this._FOADecoder = new _kxOmnitone2.default.createFOADecoder(this._context, channelMap);
	            this._FOADecoder.initialize().then(function () {
	              _this._split1.connect(_this._merge4, 0, 0);
	              _this._split1.connect(_this._merge4, 1, 1);
	              _this._split2.connect(_this._merge4, 0, 2);
	              _this._split2.connect(_this._merge4, 1, 3);
	              _this._merge4.connect(_this._FOADecoder.input);
	              _this._FOADecoder.output.connect(_this._output);
	            }).catch(function () {
	              console.log('couldnt init foasystem');
	              // just use Wchan, mono for now!!! will be upmixed to stereo i think
	              // poss fall back to dual cardioid no-hrtf from jsambisonics? TOSUSS
	              _this._split1.connect(_this._output, 0);
	            });
	          } // end of setupfoadecoder
	        } // end of bufnchans == 4
	      } // end else not 2 chans
	      this._output.gain.value = 1; // vol back up
	    }
	
	    // load an Impulse response from openairlib.net by specifying its relative url (
	    // obtained from previous call to one of the OpenAirLibInfo methods.
	    // returns a promise
	
	  }, {
	    key: 'load',
	    value: function load(rurl) {
	      var _this2 = this;
	
	      var loader = new _audioLoader2.default(this._context);
	      var debserver = this._url_base;
	      var requrl = '' + debserver + this._url_suffix_filefromurl + rurl;
	      var pr = loader.load(requrl);
	
	      pr.then(function (result) {
	        if (result instanceof AudioBuffer) {
	          var bufnchans = result.numberOfChannels;
	          if (!_this2._isValidNChans(bufnchans)) {
	            return _promise2.default.reject(new Error('AudioLoader result unsupported'));
	          }
	          _this2._info.nchans = bufnchans;
	          _this2._info.rurl = rurl;
	          _this2._info.sampleRate = result.sampleRate;
	          // should always be context sr due to auto resmapling on decode???
	          _this2._info.length = result.length;
	          if (_this2._info.sr !== _this2._context.sampleRate) {
	            if (_this2._LOGSRMM) {
	              console.log('sr mismatch');
	            }
	          }
	          var ninputchans = _this2.input.numberOfChannels;
	          _this2._constructIOGraph(ninputchans, bufnchans, result);
	        } else {
	          return _promise2.default.reject(new Error('AudioLoader result was not an audio buffer'));
	        }
	        return _promise2.default.resolve('loaded ok');
	      });
	      return pr;
	    }
	  }, {
	    key: 'input',
	    get: function get() {
	      return this._input;
	    }
	
	    // return the output node
	
	  }, {
	    key: 'output',
	    get: function get() {
	      return this._output;
	    }
	  }, {
	    key: 'gain',
	    get: function get() {
	      return this._output.gain.value;
	    }
	
	    // set this gain value (output gain)
	    ,
	    set: function set(gain) {
	      this._output.gain.value = gain;
	    }
	
	    // get an array containing zero to two convolver nodes used by the current audio
	    // graph (if any)
	
	  }, {
	    key: 'convs',
	    get: function get() {
	      // so can set normalise etc, array of convs, (can be len 0 if uninitd)
	      return this._convs;
	    }
	
	    // get the RURL (if any) of the currently loaded IR
	
	  }, {
	    key: 'rURL',
	    get: function get() {
	      return this._info.rurl;
	    }
	
	    // get the number of channels in the currently loaded IR
	
	  }, {
	    key: 'nChans',
	    get: function get() {
	      // of IR
	      return this._info.nchans;
	    }
	
	    // get the length in frames of the currently loaded IR,
	    // where a frame is one or more samples at a particular instrant in time,
	    // the number of samples in a frame depending on the number of channels in the IR
	
	  }, {
	    key: 'length',
	    get: function get() {
	      return this._info.length;
	    }
	
	    // get the original sample rate of the currently loaded IR
	
	  }, {
	    key: 'sampleRate',
	    get: function get() {
	      return this._info.sampleRate;
	    }
	  }]);
	  return OpenAirLibNode;
	}();
	// import CompoundNode from '../core/compound-node.js';
	
	
	exports.default = OpenAirLibNode;

/***/ },
/* 113 */
/*!****************************************!*\
  !*** ./src/kx-omnitone/kx-omnitone.js ***!
  \****************************************/
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2016 Google Inc. All Rights Reserved.
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *     http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	
	/**
	 * MODIFIED by K Brown
	 * University of York
	 * 2016
	 *
	 * FOADecoder :
	 * Removed use of media tag and context.destination,
	 * Added input and output nodes so can use KXOmnitone as a general element 
	 * in a Web Audio API node graph.
	 */
	
	/**
	 * @fileOverview KXOmnitone library name space and common utilities.
	 */
	
	'use strict';
	
	/**
	 * @class KXOmnitone main namespace.
	 */
	
	var _promise = __webpack_require__(/*! babel-runtime/core-js/promise */ 24);
	
	var _promise2 = _interopRequireDefault(_promise);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var KXOmnitone = {};
	
	// Internal dependencies.
	var AudioBufferManager = __webpack_require__(/*! ./audiobuffer-manager.js */ 114);
	var FOARouter = __webpack_require__(/*! ./foa-router.js */ 127);
	var FOARotator = __webpack_require__(/*! ./foa-rotator.js */ 128);
	var FOAPhaseMatchedFilter = __webpack_require__(/*! ./foa-phase-matched-filter.js */ 129);
	var FOAVirtualSpeaker = __webpack_require__(/*! ./foa-virtual-speaker.js */ 130);
	var FOADecoder = __webpack_require__(/*! ./foa-decoder.js */ 131);
	var Utils = __webpack_require__(/*! ./utils.js */ 126);
	
	/**
	 * Load audio buffers based on the speaker configuration map data.
	 * @param {AudioContext} context      The associated AudioContext.
	 * @param {Map} speakerData           The speaker configuration map data.
	 *                                    { name, url, coef }
	 * @return {Promise}
	 */
	KXOmnitone.loadAudioBuffers = function (context, speakerData) {
	  return new _promise2.default(function (resolve, reject) {
	    new AudioBufferManager(context, speakerData, function (buffers) {
	      resolve(buffers);
	    }, reject);
	  });
	};
	
	/**
	 * Create an instance of FOA Router. For parameters, refer the definition of
	 * Router class.
	 * @return {Object}
	 */
	KXOmnitone.createFOARouter = function (context, channelMap) {
	  return new FOARouter(context, channelMap);
	};
	
	/**
	 * Create an instance of FOA Rotator. For parameters, refer the definition of
	 * Rotator class.
	 * @return {Object}
	 */
	KXOmnitone.createFOARotator = function (context) {
	  return new FOARotator(context);
	};
	
	/**
	 * Create an instance of FOAPhaseMatchedFilter. For parameters, refer the
	 * definition of PhaseMatchedFilter class.
	 * @return {FOAPhaseMatchedFilter}
	 */
	KXOmnitone.createFOAPhaseMatchedFilter = function (context) {
	  return new FOAPhaseMatchedFilter(context);
	};
	
	/**
	 * Create an instance of FOAVirtualSpeaker. For parameters, refer the
	 * definition of VirtualSpeaker class.
	 * @return {FOAVirtualSpeaker}
	 */
	KXOmnitone.createFOAVirtualSpeaker = function (context, options) {
	  return new FOAVirtualSpeaker(context, options);
	};
	
	/**
	 * Create a singleton FOADecoder instance.
	 * @param {AudioContext} context      Associated AudioContext.
	 * @param {Object} options            Options for FOA decoder.
	 * @param {String} options.baseResourceUrl    Base URL for resources.
	 *                                            (HRTF IR files)
	 * @param {Number} options.postGain           Post-decoding gain compensation.
	 *                                            (Default = 26.0)
	 * @param {Array} options.routingDestination  Custom channel layout.
	 * @return {FOADecoder}
	 */
	KXOmnitone.createFOADecoder = function (context, options) {
	  return new FOADecoder(context, options);
	};
	
	module.exports = KXOmnitone;

/***/ },
/* 114 */
/*!************************************************!*\
  !*** ./src/kx-omnitone/audiobuffer-manager.js ***!
  \************************************************/
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2016 Google Inc. All Rights Reserved.
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *     http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	
	/**
	 * @fileOverview Audio buffer loading utility.
	 */
	
	'use strict';
	
	var _map = __webpack_require__(/*! babel-runtime/core-js/map */ 115);
	
	var _map2 = _interopRequireDefault(_map);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Utils = __webpack_require__(/*! ./utils.js */ 126);
	
	/**
	 * Streamlined audio file loader supports Promise.
	 * @param {Object} context          AudioContext
	 * @param {Object} audioFileData    Audio file info as [{name, url}]
	 * @param {Function} resolve        Resolution handler for promise.
	 * @param {Function} reject         Rejection handler for promise.
	 * @param {Function} progress       Progress event handler.
	 */
	function AudioBufferManager(context, audioFileData, resolve, reject, progress) {
	  this._context = context;
	
	  this._buffers = new _map2.default();
	  this._loadingTasks = {};
	
	  this._resolve = resolve;
	  this._reject = reject;
	  this._progress = progress;
	
	  // Iterating file loading.
	  for (var i = 0; i < audioFileData.length; i++) {
	    var fileInfo = audioFileData[i];
	
	    // Check for duplicates filename and quit if it happens.
	    if (this._loadingTasks.hasOwnProperty(fileInfo.name)) {
	      Utils.LOG('Duplicated filename when loading: ' + fileInfo.name);
	      return;
	    }
	
	    // Mark it as pending (0)
	    this._loadingTasks[fileInfo.name] = 0;
	    this._loadAudioFile(fileInfo);
	  }
	}
	
	AudioBufferManager.prototype._loadAudioFile = function (fileInfo) {
	  var xhr = new XMLHttpRequest();
	  xhr.open('GET', fileInfo.url);
	  xhr.responseType = 'arraybuffer';
	
	  var that = this;
	  xhr.onload = function () {
	    if (xhr.status === 200) {
	      that._context.decodeAudioData(xhr.response, function (buffer) {
	        // Utils.LOG('File loaded: ' + fileInfo.url);
	        that._done(fileInfo.name, buffer);
	      }, function (message) {
	        Utils.LOG('Decoding failure: ' + fileInfo.url + ' (' + message + ')');
	        that._done(fileInfo.name, null);
	      });
	    } else {
	      Utils.LOG('XHR Error: ' + fileInfo.url + ' (' + xhr.statusText + ')');
	      that._done(fileInfo.name, null);
	    }
	  };
	
	  // TODO: fetch local resources if XHR fails.
	  xhr.onerror = function (event) {
	    Utils.LOG('XHR Network failure: ' + fileInfo.url);
	    that._done(fileInfo.name, null);
	  };
	
	  xhr.send();
	};
	
	AudioBufferManager.prototype._done = function (filename, buffer) {
	  // Label the loading task.
	  this._loadingTasks[filename] = buffer !== null ? 'loaded' : 'failed';
	
	  // A failed task will be a null buffer.
	  this._buffers.set(filename, buffer);
	
	  this._updateProgress(filename);
	};
	
	AudioBufferManager.prototype._updateProgress = function (filename) {
	  var numberOfFinishedTasks = 0,
	      numberOfFailedTask = 0;
	  var numberOfTasks = 0;
	
	  for (var task in this._loadingTasks) {
	    numberOfTasks++;
	    if (this._loadingTasks[task] === 'loaded') numberOfFinishedTasks++;else if (this._loadingTasks[task] === 'failed') numberOfFailedTask++;
	  }
	
	  if (typeof this._progress === 'function') this._progress(filename, numberOfFinishedTasks, numberOfTasks);
	
	  if (numberOfFinishedTasks === numberOfTasks) this._resolve(this._buffers);
	
	  if (numberOfFinishedTasks + numberOfFailedTask === numberOfTasks) this._reject(this._buffers);
	};
	
	module.exports = AudioBufferManager;

/***/ },
/* 115 */
/*!****************************************!*\
  !*** ./~/babel-runtime/core-js/map.js ***!
  \****************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(/*! core-js/library/fn/map */ 116), __esModule: true };

/***/ },
/* 116 */
/*!*****************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/fn/map.js ***!
  \*****************************************************/
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(/*! ../modules/es6.object.to-string */ 26);
	__webpack_require__(/*! ../modules/es6.string.iterator */ 27);
	__webpack_require__(/*! ../modules/web.dom.iterable */ 56);
	__webpack_require__(/*! ../modules/es6.map */ 117);
	__webpack_require__(/*! ../modules/es7.map.to-json */ 123);
	module.exports = __webpack_require__(/*! ../modules/_core */ 10).Map;

/***/ },
/* 117 */
/*!**************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/es6.map.js ***!
  \**************************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var strong = __webpack_require__(/*! ./_collection-strong */ 118);
	
	// 23.1 Map Objects
	module.exports = __webpack_require__(/*! ./_collection */ 119)('Map', function(get){
	  return function Map(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
	}, {
	  // 23.1.3.6 Map.prototype.get(key)
	  get: function get(key){
	    var entry = strong.getEntry(this, key);
	    return entry && entry.v;
	  },
	  // 23.1.3.9 Map.prototype.set(key, value)
	  set: function set(key, value){
	    return strong.def(this, key === 0 ? 0 : key, value);
	  }
	}, strong, true);

/***/ },
/* 118 */
/*!*************************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_collection-strong.js ***!
  \*************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var dP          = __webpack_require__(/*! ./_object-dp */ 14).f
	  , create      = __webpack_require__(/*! ./_object-create */ 37)
	  , hide        = __webpack_require__(/*! ./_hide */ 13)
	  , redefineAll = __webpack_require__(/*! ./_redefine-all */ 74)
	  , ctx         = __webpack_require__(/*! ./_ctx */ 11)
	  , anInstance  = __webpack_require__(/*! ./_an-instance */ 62)
	  , defined     = __webpack_require__(/*! ./_defined */ 30)
	  , forOf       = __webpack_require__(/*! ./_for-of */ 63)
	  , $iterDefine = __webpack_require__(/*! ./_iter-define */ 31)
	  , step        = __webpack_require__(/*! ./_iter-step */ 59)
	  , setSpecies  = __webpack_require__(/*! ./_set-species */ 75)
	  , DESCRIPTORS = __webpack_require__(/*! ./_descriptors */ 18)
	  , fastKey     = __webpack_require__(/*! ./_meta */ 90).fastKey
	  , SIZE        = DESCRIPTORS ? '_s' : 'size';
	
	var getEntry = function(that, key){
	  // fast case
	  var index = fastKey(key), entry;
	  if(index !== 'F')return that._i[index];
	  // frozen object case
	  for(entry = that._f; entry; entry = entry.n){
	    if(entry.k == key)return entry;
	  }
	};
	
	module.exports = {
	  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
	    var C = wrapper(function(that, iterable){
	      anInstance(that, C, NAME, '_i');
	      that._i = create(null); // index
	      that._f = undefined;    // first entry
	      that._l = undefined;    // last entry
	      that[SIZE] = 0;         // size
	      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
	    });
	    redefineAll(C.prototype, {
	      // 23.1.3.1 Map.prototype.clear()
	      // 23.2.3.2 Set.prototype.clear()
	      clear: function clear(){
	        for(var that = this, data = that._i, entry = that._f; entry; entry = entry.n){
	          entry.r = true;
	          if(entry.p)entry.p = entry.p.n = undefined;
	          delete data[entry.i];
	        }
	        that._f = that._l = undefined;
	        that[SIZE] = 0;
	      },
	      // 23.1.3.3 Map.prototype.delete(key)
	      // 23.2.3.4 Set.prototype.delete(value)
	      'delete': function(key){
	        var that  = this
	          , entry = getEntry(that, key);
	        if(entry){
	          var next = entry.n
	            , prev = entry.p;
	          delete that._i[entry.i];
	          entry.r = true;
	          if(prev)prev.n = next;
	          if(next)next.p = prev;
	          if(that._f == entry)that._f = next;
	          if(that._l == entry)that._l = prev;
	          that[SIZE]--;
	        } return !!entry;
	      },
	      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
	      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
	      forEach: function forEach(callbackfn /*, that = undefined */){
	        anInstance(this, C, 'forEach');
	        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3)
	          , entry;
	        while(entry = entry ? entry.n : this._f){
	          f(entry.v, entry.k, this);
	          // revert to the last existing entry
	          while(entry && entry.r)entry = entry.p;
	        }
	      },
	      // 23.1.3.7 Map.prototype.has(key)
	      // 23.2.3.7 Set.prototype.has(value)
	      has: function has(key){
	        return !!getEntry(this, key);
	      }
	    });
	    if(DESCRIPTORS)dP(C.prototype, 'size', {
	      get: function(){
	        return defined(this[SIZE]);
	      }
	    });
	    return C;
	  },
	  def: function(that, key, value){
	    var entry = getEntry(that, key)
	      , prev, index;
	    // change existing entry
	    if(entry){
	      entry.v = value;
	    // create new entry
	    } else {
	      that._l = entry = {
	        i: index = fastKey(key, true), // <- index
	        k: key,                        // <- key
	        v: value,                      // <- value
	        p: prev = that._l,             // <- previous entry
	        n: undefined,                  // <- next entry
	        r: false                       // <- removed
	      };
	      if(!that._f)that._f = entry;
	      if(prev)prev.n = entry;
	      that[SIZE]++;
	      // add to index
	      if(index !== 'F')that._i[index] = entry;
	    } return that;
	  },
	  getEntry: getEntry,
	  setStrong: function(C, NAME, IS_MAP){
	    // add .keys, .values, .entries, [@@iterator]
	    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
	    $iterDefine(C, NAME, function(iterated, kind){
	      this._t = iterated;  // target
	      this._k = kind;      // kind
	      this._l = undefined; // previous
	    }, function(){
	      var that  = this
	        , kind  = that._k
	        , entry = that._l;
	      // revert to the last existing entry
	      while(entry && entry.r)entry = entry.p;
	      // get next entry
	      if(!that._t || !(that._l = entry = entry ? entry.n : that._t._f)){
	        // or finish the iteration
	        that._t = undefined;
	        return step(1);
	      }
	      // return step by kind
	      if(kind == 'keys'  )return step(0, entry.k);
	      if(kind == 'values')return step(0, entry.v);
	      return step(0, [entry.k, entry.v]);
	    }, IS_MAP ? 'entries' : 'values' , !IS_MAP, true);
	
	    // add [@@species], 23.1.2.2, 23.2.2.2
	    setSpecies(NAME);
	  }
	};

/***/ },
/* 119 */
/*!******************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_collection.js ***!
  \******************************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var global         = __webpack_require__(/*! ./_global */ 9)
	  , $export        = __webpack_require__(/*! ./_export */ 8)
	  , meta           = __webpack_require__(/*! ./_meta */ 90)
	  , fails          = __webpack_require__(/*! ./_fails */ 19)
	  , hide           = __webpack_require__(/*! ./_hide */ 13)
	  , redefineAll    = __webpack_require__(/*! ./_redefine-all */ 74)
	  , forOf          = __webpack_require__(/*! ./_for-of */ 63)
	  , anInstance     = __webpack_require__(/*! ./_an-instance */ 62)
	  , isObject       = __webpack_require__(/*! ./_is-object */ 16)
	  , setToStringTag = __webpack_require__(/*! ./_set-to-string-tag */ 52)
	  , dP             = __webpack_require__(/*! ./_object-dp */ 14).f
	  , each           = __webpack_require__(/*! ./_array-methods */ 120)(0)
	  , DESCRIPTORS    = __webpack_require__(/*! ./_descriptors */ 18);
	
	module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK){
	  var Base  = global[NAME]
	    , C     = Base
	    , ADDER = IS_MAP ? 'set' : 'add'
	    , proto = C && C.prototype
	    , O     = {};
	  if(!DESCRIPTORS || typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function(){
	    new C().entries().next();
	  }))){
	    // create collection constructor
	    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
	    redefineAll(C.prototype, methods);
	    meta.NEED = true;
	  } else {
	    C = wrapper(function(target, iterable){
	      anInstance(target, C, NAME, '_c');
	      target._c = new Base;
	      if(iterable != undefined)forOf(iterable, IS_MAP, target[ADDER], target);
	    });
	    each('add,clear,delete,forEach,get,has,set,keys,values,entries,toJSON'.split(','),function(KEY){
	      var IS_ADDER = KEY == 'add' || KEY == 'set';
	      if(KEY in proto && !(IS_WEAK && KEY == 'clear'))hide(C.prototype, KEY, function(a, b){
	        anInstance(this, C, KEY);
	        if(!IS_ADDER && IS_WEAK && !isObject(a))return KEY == 'get' ? undefined : false;
	        var result = this._c[KEY](a === 0 ? 0 : a, b);
	        return IS_ADDER ? this : result;
	      });
	    });
	    if('size' in proto)dP(C.prototype, 'size', {
	      get: function(){
	        return this._c.size;
	      }
	    });
	  }
	
	  setToStringTag(C, NAME);
	
	  O[NAME] = C;
	  $export($export.G + $export.W + $export.F, O);
	
	  if(!IS_WEAK)common.setStrong(C, NAME, IS_MAP);
	
	  return C;
	};

/***/ },
/* 120 */
/*!*********************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_array-methods.js ***!
  \*********************************************************************/
/***/ function(module, exports, __webpack_require__) {

	// 0 -> Array#forEach
	// 1 -> Array#map
	// 2 -> Array#filter
	// 3 -> Array#some
	// 4 -> Array#every
	// 5 -> Array#find
	// 6 -> Array#findIndex
	var ctx      = __webpack_require__(/*! ./_ctx */ 11)
	  , IObject  = __webpack_require__(/*! ./_iobject */ 42)
	  , toObject = __webpack_require__(/*! ./_to-object */ 55)
	  , toLength = __webpack_require__(/*! ./_to-length */ 45)
	  , asc      = __webpack_require__(/*! ./_array-species-create */ 121);
	module.exports = function(TYPE, $create){
	  var IS_MAP        = TYPE == 1
	    , IS_FILTER     = TYPE == 2
	    , IS_SOME       = TYPE == 3
	    , IS_EVERY      = TYPE == 4
	    , IS_FIND_INDEX = TYPE == 6
	    , NO_HOLES      = TYPE == 5 || IS_FIND_INDEX
	    , create        = $create || asc;
	  return function($this, callbackfn, that){
	    var O      = toObject($this)
	      , self   = IObject(O)
	      , f      = ctx(callbackfn, that, 3)
	      , length = toLength(self.length)
	      , index  = 0
	      , result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined
	      , val, res;
	    for(;length > index; index++)if(NO_HOLES || index in self){
	      val = self[index];
	      res = f(val, index, O);
	      if(TYPE){
	        if(IS_MAP)result[index] = res;            // map
	        else if(res)switch(TYPE){
	          case 3: return true;                    // some
	          case 5: return val;                     // find
	          case 6: return index;                   // findIndex
	          case 2: result.push(val);               // filter
	        } else if(IS_EVERY)return false;          // every
	      }
	    }
	    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
	  };
	};

/***/ },
/* 121 */
/*!****************************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_array-species-create.js ***!
  \****************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
	var speciesConstructor = __webpack_require__(/*! ./_array-species-constructor */ 122);
	
	module.exports = function(original, length){
	  return new (speciesConstructor(original))(length);
	};

/***/ },
/* 122 */
/*!*********************************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_array-species-constructor.js ***!
  \*********************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(/*! ./_is-object */ 16)
	  , isArray  = __webpack_require__(/*! ./_is-array */ 95)
	  , SPECIES  = __webpack_require__(/*! ./_wks */ 53)('species');
	
	module.exports = function(original){
	  var C;
	  if(isArray(original)){
	    C = original.constructor;
	    // cross-realm fallback
	    if(typeof C == 'function' && (C === Array || isArray(C.prototype)))C = undefined;
	    if(isObject(C)){
	      C = C[SPECIES];
	      if(C === null)C = undefined;
	    }
	  } return C === undefined ? Array : C;
	};

/***/ },
/* 123 */
/*!**********************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/es7.map.to-json.js ***!
  \**********************************************************************/
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/DavidBruant/Map-Set.prototype.toJSON
	var $export  = __webpack_require__(/*! ./_export */ 8);
	
	$export($export.P + $export.R, 'Map', {toJSON: __webpack_require__(/*! ./_collection-to-json */ 124)('Map')});

/***/ },
/* 124 */
/*!**************************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_collection-to-json.js ***!
  \**************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/DavidBruant/Map-Set.prototype.toJSON
	var classof = __webpack_require__(/*! ./_classof */ 61)
	  , from    = __webpack_require__(/*! ./_array-from-iterable */ 125);
	module.exports = function(NAME){
	  return function toJSON(){
	    if(classof(this) != NAME)throw TypeError(NAME + "#toJSON isn't generic");
	    return from(this);
	  };
	};

/***/ },
/* 125 */
/*!***************************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/_array-from-iterable.js ***!
  \***************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	var forOf = __webpack_require__(/*! ./_for-of */ 63);
	
	module.exports = function(iter, ITERATOR){
	  var result = [];
	  forOf(iter, false, result.push, result, ITERATOR);
	  return result;
	};


/***/ },
/* 126 */
/*!**********************************!*\
  !*** ./src/kx-omnitone/utils.js ***!
  \**********************************/
/***/ function(module, exports) {

	/**
	 * Copyright 2016 Google Inc. All Rights Reserved.
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *     http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	
	/**
	 * @fileOverview Omnitone library common utilities.
	 */
	
	'use strict';
	
	/**
	 * Omnitone library logging function.
	 * @type {Function}
	 * @param {any} Message to be printed out.
	 */
	
	exports.LOG = function () {
	  window.console.log.apply(window.console, ['%c[KXOmnitone]%c ' + Array.prototype.slice.call(arguments).join(' ') + ' %c(@' + performance.now().toFixed(2) + 'ms)', 'background: #BBDEFB; color: #FF5722; font-weight: 700', 'font-weight: 400', 'color: #AAA']);
	};

/***/ },
/* 127 */
/*!***************************************!*\
  !*** ./src/kx-omnitone/foa-router.js ***!
  \***************************************/
/***/ function(module, exports) {

	/**
	 * Copyright 2016 Google Inc. All Rights Reserved.
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *     http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	
	'use strict';
	
	/**
	 * @fileOverview An audio channel re-router to resolve different channel layouts
	 *               between various platforms.
	 */
	
	var DEFAULT_CHANNEL_MAP = [0, 1, 2, 3];
	var IOS_CHANNEL_MAP = [2, 0, 1, 3];
	var FUMA_2_ACN_CHANNEL_MAP = [0, 3, 1, 2];
	
	/**
	 * @class A simple channel re-router.
	 * @param {AudioContext} context      Associated AudioContext.
	 * @param {Array} channelMap  Routing destination array.
	 *                                    e.g.) Chrome: [0, 1, 2, 3],
	 *                                    iOS: [2, 0, 1, 3]
	 */
	function FOARouter(context, channelMap) {
	  this._context = context;
	
	  this._splitter = this._context.createChannelSplitter(4);
	  this._merger = this._context.createChannelMerger(4);
	
	  this._channelMap = channelMap || DEFAULT_CHANNEL_MAP;
	
	  this._splitter.connect(this._merger, 0, this._channelMap[0]);
	  this._splitter.connect(this._merger, 1, this._channelMap[1]);
	  this._splitter.connect(this._merger, 2, this._channelMap[2]);
	  this._splitter.connect(this._merger, 3, this._channelMap[3]);
	
	  // input/output proxy.
	  this.input = this._splitter;
	  this.output = this._merger;
	}
	
	FOARouter.prototype.setChannelMap = function (channelMap) {
	  if (!channelMap) return;
	
	  this._channelMap = channelMap;
	  this._splitter.disconnect();
	  this._splitter.connect(this._merger, 0, this._channelMap[0]);
	  this._splitter.connect(this._merger, 1, this._channelMap[1]);
	  this._splitter.connect(this._merger, 2, this._channelMap[2]);
	  this._splitter.connect(this._merger, 3, this._channelMap[3]);
	};
	
	module.exports = FOARouter;

/***/ },
/* 128 */
/*!****************************************!*\
  !*** ./src/kx-omnitone/foa-rotator.js ***!
  \****************************************/
/***/ function(module, exports) {

	/**
	 * Copyright 2016 Google Inc. All Rights Reserved.
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *     http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	
	'use strict';
	
	/**
	 * @fileOverview Sound field rotator for first-order-ambisonics decoding.
	 */
	
	/**
	 * @class First-order-ambisonic decoder based on gain node network.
	 * @param {AudioContext} context    Associated AudioContext.
	 */
	
	function FOARotator(context) {
	  this._context = context;
	
	  this._splitter = this._context.createChannelSplitter(4);
	  this._inY = this._context.createGain();
	  this._inZ = this._context.createGain();
	  this._inX = this._context.createGain();
	  this._m0 = this._context.createGain();
	  this._m1 = this._context.createGain();
	  this._m2 = this._context.createGain();
	  this._m3 = this._context.createGain();
	  this._m4 = this._context.createGain();
	  this._m5 = this._context.createGain();
	  this._m6 = this._context.createGain();
	  this._m7 = this._context.createGain();
	  this._m8 = this._context.createGain();
	  this._outY = this._context.createGain();
	  this._outZ = this._context.createGain();
	  this._outX = this._context.createGain();
	  this._merger = this._context.createChannelMerger(4);
	
	  // ACN channel ordering: [1, 2, 3] => [-Y, Z, -X]
	  this._splitter.connect(this._inY, 1); // Y (from channel 1)
	  this._splitter.connect(this._inZ, 2); // Z (from channel 2)
	  this._splitter.connect(this._inX, 3); // X (from channel 3)
	  this._inY.gain.value = -1;
	  this._inX.gain.value = -1;
	
	  // Apply the rotation in the world space.
	  // |Y|   | m0  m3  m6 |   | Y * m0 + Z * m3 + X * m6 |   | Yr |
	  // |Z| * | m1  m4  m7 | = | Y * m1 + Z * m4 + X * m7 | = | Zr |
	  // |X|   | m2  m5  m8 |   | Y * m2 + Z * m5 + X * m8 |   | Xr |
	  this._inY.connect(this._m0);
	  this._inY.connect(this._m1);
	  this._inY.connect(this._m2);
	  this._inZ.connect(this._m3);
	  this._inZ.connect(this._m4);
	  this._inZ.connect(this._m5);
	  this._inX.connect(this._m6);
	  this._inX.connect(this._m7);
	  this._inX.connect(this._m8);
	  this._m0.connect(this._outY);
	  this._m1.connect(this._outZ);
	  this._m2.connect(this._outX);
	  this._m3.connect(this._outY);
	  this._m4.connect(this._outZ);
	  this._m5.connect(this._outX);
	  this._m6.connect(this._outY);
	  this._m7.connect(this._outZ);
	  this._m8.connect(this._outX);
	
	  // Transform 3: world space to audio space.
	  this._splitter.connect(this._merger, 0, 0); // W -> W (to channel 0)
	  this._outY.connect(this._merger, 0, 1); // Y (to channel 1)
	  this._outZ.connect(this._merger, 0, 2); // Z (to channel 2)
	  this._outX.connect(this._merger, 0, 3); // X (to channel 3)
	  this._outY.gain.value = -1;
	  this._outX.gain.value = -1;
	
	  this.setRotationMatrix(new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]));
	
	  // input/output proxy.
	  this.input = this._splitter;
	  this.output = this._merger;
	}
	
	/**
	 * Set 3x3 matrix for soundfield rotation.
	 * @param {Array} rotationMatrix    A 3x3 matrix of soundfield rotation. The
	 *                                  matrix is in the row-major representation.
	 */
	FOARotator.prototype.setRotationMatrix = function (rotationMatrix) {
	  this._m0.gain.value = rotationMatrix[0];
	  this._m1.gain.value = rotationMatrix[1];
	  this._m2.gain.value = rotationMatrix[2];
	  this._m3.gain.value = rotationMatrix[3];
	  this._m4.gain.value = rotationMatrix[4];
	  this._m5.gain.value = rotationMatrix[5];
	  this._m6.gain.value = rotationMatrix[6];
	  this._m7.gain.value = rotationMatrix[7];
	  this._m8.gain.value = rotationMatrix[8];
	};
	
	/**
	 * Returns the current rotation matrix.
	 * @return {Array}                  A 3x3 matrix of soundfield rotation. The
	 *                                  matrix is in the row-major representation.
	 */
	FOARotator.prototype.getRotationMatrix = function () {
	  return [this._m0.gain.value, this._m1.gain.value, this._m2.gain.value, this._m3.gain.value, this._m4.gain.value, this._m5.gain.value, this._m6.gain.value, this._m7.gain.value, this._m8.gain.value];
	};
	
	module.exports = FOARotator;

/***/ },
/* 129 */
/*!*****************************************************!*\
  !*** ./src/kx-omnitone/foa-phase-matched-filter.js ***!
  \*****************************************************/
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2016 Google Inc. All Rights Reserved.
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *     http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	
	/**
	 * @fileOverview Phase matched filter for first-order-ambisonics decoding.
	 */
	
	'use strict';
	
	var Utils = __webpack_require__(/*! ./utils.js */ 126);
	
	// Static parameters.
	var FREQUENCY = 700;
	var COEFFICIENTS = [1.4142, 0.8166, 0.8166, 0.8166];
	
	/**
	 * @class FOAPhaseMatchedFilter
	 * @description A set of filters (LP/HP) with a crossover frequency to
	 *              compensate the gain of high frequency contents without a phase
	 *              difference.
	 * @param {AudioContext} context        Associated AudioContext.
	 */
	function FOAPhaseMatchedFilter(context) {
	  this._context = context;
	
	  this._input = this._context.createGain();
	
	  // TODO: calculate the freq/reso based on the context sample rate.
	  if (!this._context.createIIRFilter) {
	    Utils.LOG('IIR filter is missing. Using Biquad filter instead.');
	    this._lpf = this._context.createBiquadFilter();
	    this._hpf = this._context.createBiquadFilter();
	    this._lpf.frequency.value = FREQUENCY;
	    this._hpf.frequency.value = FREQUENCY;
	    this._hpf.type = 'highpass';
	  } else {
	    this._lpf = this._context.createIIRFilter([0.00058914319, 0.0011782864, 0.00058914319], [1, -1.9029109, 0.90526748]);
	    this._hpf = this._context.createIIRFilter([0.95204461, -1.9040892, 0.95204461], [1, -1.9029109, 0.90526748]);
	  }
	
	  this._splitterLow = this._context.createChannelSplitter(4);
	  this._splitterHigh = this._context.createChannelSplitter(4);
	  this._gainHighW = this._context.createGain();
	  this._gainHighY = this._context.createGain();
	  this._gainHighZ = this._context.createGain();
	  this._gainHighX = this._context.createGain();
	  this._merger = this._context.createChannelMerger(4);
	
	  this._input.connect(this._hpf);
	  this._hpf.connect(this._splitterHigh);
	  this._splitterHigh.connect(this._gainHighW, 0);
	  this._splitterHigh.connect(this._gainHighY, 1);
	  this._splitterHigh.connect(this._gainHighZ, 2);
	  this._splitterHigh.connect(this._gainHighX, 3);
	  this._gainHighW.connect(this._merger, 0, 0);
	  this._gainHighY.connect(this._merger, 0, 1);
	  this._gainHighZ.connect(this._merger, 0, 2);
	  this._gainHighX.connect(this._merger, 0, 3);
	
	  this._input.connect(this._lpf);
	  this._lpf.connect(this._splitterLow);
	  this._splitterLow.connect(this._merger, 0, 0);
	  this._splitterLow.connect(this._merger, 0, 1);
	  this._splitterLow.connect(this._merger, 0, 2);
	  this._splitterLow.connect(this._merger, 0, 3);
	
	  // Apply gain correction to hi-passed pressure and velocity components:
	  // Inverting sign is necessary as the low-passed and high-passed portion are
	  // out-of-phase after the filtering.
	  this._gainHighW.gain.value = -1 * COEFFICIENTS[0];
	  this._gainHighY.gain.value = -1 * COEFFICIENTS[1];
	  this._gainHighZ.gain.value = -1 * COEFFICIENTS[2];
	  this._gainHighX.gain.value = -1 * COEFFICIENTS[3];
	
	  // Input/output Proxy.
	  this.input = this._input;
	  this.output = this._merger;
	}
	
	module.exports = FOAPhaseMatchedFilter;

/***/ },
/* 130 */
/*!************************************************!*\
  !*** ./src/kx-omnitone/foa-virtual-speaker.js ***!
  \************************************************/
/***/ function(module, exports) {

	/**
	 * Copyright 2016 Google Inc. All Rights Reserved.
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *     http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	
	/**
	 * @fileOverview Virtual speaker abstraction for first-order-ambisonics
	 *               decoding.
	 */
	
	'use strict';
	
	/**
	 * @class FOAVirtualSpeaker
	 * @description A virtual speaker with ambisonic decoding gain coefficients
	 *              and HRTF convolution for first-order-ambisonics stream.
	 *              Note that the subgraph directly connects to context's
	 *              destination.
	 * @param {AudioContext} context        Associated AudioContext.
	 * @param {Object} options              Options for speaker.
	 * @param {Array} options.coefficients  Decoding coefficients for (W,Y,Z,X).
	 * @param {AudioBuffer} options.IR      Stereo IR buffer for HRTF convolution.
	 * @param {Number} options.gain         Post-gain for the speaker.
	 */
	
	function FOAVirtualSpeaker(context, options) {
	  if (options.IR.numberOfChannels !== 2) throw 'IR does not have 2 channels. cannot proceed.';
	
	  this._active = false;
	
	  this._context = context;
	
	  this._input = this._context.createChannelSplitter(4);
	  this._cW = this._context.createGain();
	  this._cY = this._context.createGain();
	  this._cZ = this._context.createGain();
	  this._cX = this._context.createGain();
	  this._convolver = this._context.createConvolver();
	  this._gain = this._context.createGain();
	  this._output = this._context.createGain();
	  this._output.gain.value = 1.0;
	
	  this._input.connect(this._cW, 0);
	  this._input.connect(this._cY, 1);
	  this._input.connect(this._cZ, 2);
	  this._input.connect(this._cX, 3);
	  this._cW.connect(this._convolver);
	  this._cY.connect(this._convolver);
	  this._cZ.connect(this._convolver);
	  this._cX.connect(this._convolver);
	  this._convolver.connect(this._gain);
	
	  this.enable();
	
	  this._convolver.normalize = false;
	  this._convolver.buffer = options.IR;
	  this._gain.gain.value = options.gain;
	
	  // Set gain coefficients for FOA ambisonic streams.
	  this._cW.gain.value = options.coefficients[0];
	  this._cY.gain.value = options.coefficients[1];
	  this._cZ.gain.value = options.coefficients[2];
	  this._cX.gain.value = options.coefficients[3];
	
	  // Input/Output proxies.
	  this.input = this._input;
	  this.output = this._output;
	}
	
	FOAVirtualSpeaker.prototype.enable = function () {
	  this._gain.connect(this._output);
	  this._active = true;
	};
	
	FOAVirtualSpeaker.prototype.disable = function () {
	  this._gain.disconnect(this._output);
	  this._active = false;
	};
	
	module.exports = FOAVirtualSpeaker;

/***/ },
/* 131 */
/*!****************************************!*\
  !*** ./src/kx-omnitone/foa-decoder.js ***!
  \****************************************/
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2016 Google Inc. All Rights Reserved.
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *     http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	
	/**
	 * MODIFIED by K Brown
	 * University of York
	 * 2016
	 *
	 * FOADecoder :
	 * Removed use of media tag and context.destination,
	 * Added input and output nodes so can use KXOmnitone as a general element 
	 * in a Web Audio API node graph.
	 */
	
	/**
	 * @fileOverview Omnitone FOA decoder.
	 */
	
	'use strict';
	
	var _promise = __webpack_require__(/*! babel-runtime/core-js/promise */ 24);
	
	var _promise2 = _interopRequireDefault(_promise);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var AudioBufferManager = __webpack_require__(/*! ./audiobuffer-manager.js */ 114);
	var FOARouter = __webpack_require__(/*! ./foa-router.js */ 127);
	var FOARotator = __webpack_require__(/*! ./foa-rotator.js */ 128);
	var FOAPhaseMatchedFilter = __webpack_require__(/*! ./foa-phase-matched-filter.js */ 129);
	var FOAVirtualSpeaker = __webpack_require__(/*! ./foa-virtual-speaker.js */ 130);
	var FOASpeakerData = __webpack_require__(/*! ./foa-speaker-data.js */ 132);
	var Utils = __webpack_require__(/*! ./utils.js */ 126);
	var SystemVersion = __webpack_require__(/*! ./version.js */ 133);
	
	// By default, Omnitone fetches IR from the spatial media repository.
	//var HRTFSET_URL = 'https://raw.githubusercontent.com/google/spatial-media/master/support/hrtfs/cube/';
	//var HRTFSET_URL = 'http://localhost:3000/build/resources';
	//var HRTFSET_URL = 'http://oadev.york.ac.uk/irserver/oastatic/resources';
	var HRTFSET_URL = 'http://www.openairlib.net/irserver/oastatic/lib/resources';
	
	// Post gain compensation value.
	var POST_GAIN_DB = 0;
	
	// The default channel map. This assumes the media uses ACN channel ordering.
	var CHANNEL_MAP = [0, 1, 2, 3];
	
	/**
	 * @class Omnitone FOA decoder class.
	 * @param {AudioContext} context      Associated AudioContext.
	 * @param {Object} options
	 * @param {String} options.HRTFSetUrl Base URL for the cube HRTF sets.
	 * @param {Number} options.postGainDB Post-decoding gain compensation in dB.
	 * @param {Array} options.channelMap  Custom channel map.
	 */
	function FOADecoder(context, options) {
	  this._isDecoderReady = false;
	  this._context = context;
	  //this._decodingMode = 'ambisonic';
	  this._decodingMode = 'off';
	
	  this._postGainDB = POST_GAIN_DB;
	  this._HRTFSetUrl = HRTFSET_URL;
	  this._channelMap = CHANNEL_MAP;
	
	  this._input = this._context.createGain();
	  this._input.gain.value = 1.0;
	  this._output = this._context.createGain();
	  this._output.gain.value = 1.0;
	
	  if (options) {
	    if (options.postGainDB) this._postGainDB = options.postGainDB;
	
	    if (options.HRTFSetUrl) this._HRTFSetUrl = options.HRTFSetUrl;
	
	    if (options.channelMap) this._channelMap = options.channelMap;
	  }
	
	  // Rearrange speaker data based on |options.HRTFSetUrl|.
	  this._speakerData = [];
	  for (var i = 0; i < FOASpeakerData.length; ++i) {
	    this._speakerData.push({
	      name: FOASpeakerData[i].name,
	      url: this._HRTFSetUrl + '/' + FOASpeakerData[i].url,
	      coef: FOASpeakerData[i].coef
	    });
	  }
	  // io proxies
	  this.input = this._input;
	  this.output = this._output;
	}
	
	/**
	 * Initialize and load the resources for the decode.
	 * @return {Promise}
	 */
	FOADecoder.prototype.initialize = function () {
	  Utils.LOG('Version: ' + SystemVersion);
	  Utils.LOG('Initializing... (mode: ' + this._decodingMode + ')');
	
	  // Rerouting channels if necessary.
	  var channelMapString = this._channelMap.toString();
	  if (channelMapString !== CHANNEL_MAP.toString()) {
	    Utils.LOG('Remapping channels ([0,1,2,3] -> [' + channelMapString + '])');
	  }
	
	  this._foaRouter = new FOARouter(this._context, this._channelMap);
	  this._foaRotator = new FOARotator(this._context);
	  this._foaPhaseMatchedFilter = new FOAPhaseMatchedFilter(this._context);
	
	  this._input.connect(this._foaRouter.input);
	  this._foaRouter.output.connect(this._foaRotator.input);
	  this._foaRotator.output.connect(this._foaPhaseMatchedFilter.input);
	
	  this._foaVirtualSpeakers = [];
	
	  // Bypass signal path.
	  this._bypass = this._context.createGain();
	  this._input.connect(this._bypass);
	  this._bypass.connect(this._output);
	
	  // Get the linear amplitude from the post gain option, which is in decibel.
	  var postGainLinear = Math.pow(10, this._postGainDB / 20);
	  Utils.LOG('Gain compensation: ' + postGainLinear + ' (' + this._postGainDB + 'dB)');
	
	  // This returns a promise so developers can use the decoder when it is ready.
	  var me = this;
	  return new _promise2.default(function (resolve, reject) {
	    new AudioBufferManager(me._context, me._speakerData, function (buffers) {
	      for (var i = 0; i < me._speakerData.length; ++i) {
	        me._foaVirtualSpeakers[i] = new FOAVirtualSpeaker(me._context, {
	          coefficients: me._speakerData[i].coef,
	          IR: buffers.get(me._speakerData[i].name),
	          gain: postGainLinear
	        });
	        me._foaPhaseMatchedFilter.output.connect(me._foaVirtualSpeakers[i].input);
	        me._foaVirtualSpeakers[i].output.connect(me._output);
	      }
	
	      // Set the decoding mode.
	      me.setMode(me._decodingMode);
	      me._isDecoderReady = true;
	      Utils.LOG('HRTF IRs are loaded successfully. The decoder is ready.');
	
	      resolve();
	    }, reject);
	  });
	};
	
	/**
	 * Set the rotation matrix for the sound field rotation.
	 * @param {Array} rotationMatrix      3x3 rotation matrix (row-major
	 *                                    representation)
	 */
	FOADecoder.prototype.setRotationMatrix = function (rotationMatrix) {
	  this._foaRotator.setRotationMatrix(rotationMatrix);
	};
	
	/**
	 * Set the decoding mode.
	 * @param {String} mode               Decoding mode. When the mode is 'bypass'
	 *                                    the decoder is disabled and bypass the
	 *                                    input stream to the output. Setting the
	 *                                    mode to 'ambisonic' activates the decoder.
	 *                                    When the mode is 'off', all the
	 *                                    processing is completely turned off saving
	 *                                    the CPU power.
	 */
	FOADecoder.prototype.setMode = function (mode) {
	  if (mode === this._decodingMode) // need this because err thrown of disconnect twice!
	    return;
	
	  switch (mode) {
	
	    case 'bypass':
	      this._decodingMode = 'bypass';
	      for (var i = 0; i < this._foaVirtualSpeakers.length; ++i) {
	        this._foaVirtualSpeakers[i].disable();
	      }this._bypass.connect(this._output /* was _context.destination */);
	      break;
	
	    case 'ambisonic':
	      this._decodingMode = 'ambisonic';
	      for (var i = 0; i < this._foaVirtualSpeakers.length; ++i) {
	        this._foaVirtualSpeakers[i].enable();
	        this._foaVirtualSpeakers[i].output.connect(this._output);
	      }
	      this._bypass.disconnect(this._output);
	      break;
	
	    case 'off':
	      this._decodingMode = 'off';
	      for (var i = 0; i < this._foaVirtualSpeakers.length; ++i) {
	        this._foaVirtualSpeakers[i].disable();
	      }
	      this._bypass.disconnect(this._output);
	      break;
	
	    default:
	      break;
	  }
	
	  Utils.LOG('Decoding mode changed. (' + mode + ')');
	};
	
	module.exports = FOADecoder;

/***/ },
/* 132 */
/*!*********************************************!*\
  !*** ./src/kx-omnitone/foa-speaker-data.js ***!
  \*********************************************/
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * Copyright 2016 Google Inc. All Rights Reserved.
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *     http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	
	/**
	 * See also:
	 * https://github.com/google/spatial-media/tree/master/support/hrtfs/cube
	 */
	
	/**
	 * The data for FOAVirtualSpeaker. Each entry contains the URL for IR files and
	 * the gain coefficients for the associated IR files. Note that the order of
	 * coefficients follows the ACN channel ordering. (W,Y,Z,X)
	 * @type {Array}
	 */
	var FOASpeakerData = [{
	  name: 'E35.26_A135',
	  url: 'E35.26_A135_D1.4.wav',
	  gainFactor: 1,
	  coef: [.1250, 0.216495, 0.21653, -0.216495]
	}, {
	  name: 'E35.26_A-135',
	  url: 'E35.26_A-135_D1.4.wav',
	  gainFactor: 1,
	  coef: [.1250, -0.216495, 0.21653, -0.216495]
	}, {
	  name: 'E-35.26_A135',
	  url: 'E-35.26_A135_D1.4.wav',
	  gainFactor: 1,
	  coef: [.1250, 0.216495, -0.21653, -0.216495]
	}, {
	  name: 'E-35.26_A-135',
	  url: 'E-35.26_A-135_D1.4.wav',
	  gainFactor: 1,
	  coef: [.1250, -0.216495, -0.21653, -0.216495]
	}, {
	  name: 'E35.26_A45',
	  url: 'E35.26_A45_D1.4.wav',
	  gainFactor: 1,
	  coef: [.1250, 0.216495, 0.21653, 0.216495]
	}, {
	  name: 'E35.26_A-45',
	  url: 'E35.26_A-45_D1.4.wav',
	  gainFactor: 1,
	  coef: [.1250, -0.216495, 0.21653, 0.216495]
	}, {
	  name: 'E-35.26_A45',
	  url: 'E-35.26_A45_D1.4.wav',
	  gainFactor: 1,
	  coef: [.1250, 0.216495, -0.21653, 0.216495]
	}, {
	  name: 'E-35.26_A-45',
	  url: 'E-35.26_A-45_D1.4.wav',
	  gainFactor: 1,
	  coef: [.1250, -0.216495, -0.21653, 0.216495]
	}];
	
	module.exports = FOASpeakerData;

/***/ },
/* 133 */
/*!************************************!*\
  !*** ./src/kx-omnitone/version.js ***!
  \************************************/
/***/ function(module, exports) {

	/**
	 * Copyright 2016 Google Inc. All Rights Reserved.
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *     http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	
	/**
	 * @fileOverview Omnitone version.
	 */
	
	'use strict';
	
	/**
	 * Omnitone library version
	 * @type {String}
	 */
	
	module.exports = 'K.0.1.6';

/***/ },
/* 134 */
/*!******************************************!*\
  !*** ./src/effects/open-air-lib-info.js ***!
  \******************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ 3);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ 4);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _loader = __webpack_require__(/*! ../core/loaders/loader.js */ 23);
	
	var _loader2 = _interopRequireDefault(_loader);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/*
	  open-air-lib-info.js
	
	  K Brown
	  University of York
	  M Paradis
	  BBC Audio Research
	
	  OpenAirLibInfo
	*/
	
	var OpenAirLibInfo = function () {
	
	  // LOCALTEST constructor(urlbase = 'http://localhost:3000') {
	  //  constructor(urlbase = 'oadev.york.ac.uk/irserver') {
	  function OpenAirLibInfo() {
	    var urlbase = arguments.length <= 0 || arguments[0] === undefined ? 'www.openairlib.net/irserver' : arguments[0];
	    (0, _classCallCheck3.default)(this, OpenAirLibInfo);
	
	    this._url_base = urlbase;
	    this._url_suffix_server = '/server';
	    this._url_suffix_server_ver = '/ver';
	    this._url_suffix_list = '/list';
	    this._url_suffix_search = '/search?d=';
	    this._url_suffix_rurl = '/rurl?d=';
	    this._url_suffix_fid = '/fid?d=';
	    this._url_suffix_filefromurl = '/filefromrurl?d=';
	    this._loader = new _loader2.default('json');
	  }
	
	  // returns base url
	
	
	  (0, _createClass3.default)(OpenAirLibInfo, [{
	    key: 'urlBase',
	    value: function urlBase() {
	      return this._url_base;
	    }
	
	    /* following return promises of decoded json */
	
	    // returns version string from server
	
	  }, {
	    key: 'ver',
	    value: function ver() {
	      return this._request(this._url_suffix_server_ver);
	    }
	
	    // returns server root URL
	
	  }, {
	    key: 'localRoot',
	    value: function localRoot() {
	      return this._request(this._url_suffix_server);
	    }
	  }, {
	    key: 'list',
	    value: function list() {
	      return this._request(this._url_suffix_list);
	    }
	  }, {
	    key: 'search',
	    value: function search(searchstring) {
	      var searchstringenc = encodeURIComponent(searchstring);
	      return this._request(this._url_suffix_search, searchstringenc);
	    }
	  }, {
	    key: 'byrUrl',
	    value: function byrUrl(rurlstring) {
	      var rurlstringenc = encodeURIComponent(rurlstring);
	      return this._request(this._url_suffix_rurl, rurlstringenc);
	    }
	  }, {
	    key: 'byFid',
	    value: function byFid(fid) {
	      var fidstring = encodeURIComponent(fid, toString(10));
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
	
	  }, {
	    key: '_request',
	    value: function _request(type, data) {
	      var url = this._url_base + type;
	      if (data !== undefined) {
	        url += data;
	      }
	      return this._loader.load(url);
	    }
	  }]);
	  return OpenAirLibInfo;
	}();
	
	exports.default = OpenAirLibInfo;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=weaverlib.js.map
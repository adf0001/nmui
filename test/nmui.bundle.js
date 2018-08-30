require=(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){

"use strict";

/**
 * @module cbo
 * 
 * @description
 * 
 * Callback object tool
 * 
 * # Contents #
 * 
 * 1. Definition
 *  * [Callback object					](#defineCallbackObject)
 * 2. Call tool
 *  * [.call()							]{@link module:cbo~call}
 *  * [.setTimeout()					]{@link module:cbo~setTimeout}
 * 
 * 3. Build tool
 *  * [.combine()						]{@link module:cbo~combine}
 * 
 *  * [.toCallback()					]{@link module:cbo~toCallback}
 * 
 * <a name='defineCallbackObject'></a>
 * 
 * ## Definition ##
 * ### callback object ###
 * A callback object is an array object defined as :
 *  > a. `[ thisObj, methodName, argArray ]`
 *  > b. `[ thisObj, method, argArray ]`
 *  > c. `[ null, method, argArray ]`
 * 
 * @property  {object} thisObj - The this objecct
 * @property  {string} methodName - A function name of `thisObj`
 * @property  {function} method - A function
 * @property  {Array} [argArray] - An `arguments` array for calling the method
 *
 * 
 * @example
var cbo= require("cbo");

cbo.call(...);

*/


/**
 * call a cbo
 * @function call
 * 
 * @param {cbo} cbo - a cbo object
 * @param {Array} [argArrayExtra] - extra arguments array
 * @param {bool} [insertBefore] - flag to insert `argArrayExtra` before original `argArray` of `cbo`
 * 
 * @return according to the `cbo`
 */
function _call(cbo, argArrayExtra, insertBefore) {
	var func = (typeof cbo[1] == "string") ? cbo[0][cbo[1]] : cbo[1];

	if (argArrayExtra) {
		func.apply(cbo[0], cbo[2]?(insertBefore?argArrayExtra.concat(cbo[2]):cbo[2].concat(argArrayExtra)):argArrayExtra );
	} else {
		return cbo[2] ? func.apply(cbo[0], cbo[2]) : func.apply(cbo[0]);
	}
}


/**
 * combine arguments into cbo
 * @function combine
 * 
 * @param {cbo} cbo - a cbo object
 * @param {Array} [argArrayExtra] - extra arguments array
 * @param {bool} [insertBefore] - flag to insert `argArrayExtra` before original `argArray` of `cbo`
 * 
 * @returns a new cbo
 */
function combine(cbo, argArrayExtra, insertBefore) {
	return [cbo[0], cbo[1], cbo[2] ? (insertBefore ? argArrayExtra.concat(cbo[2]) : cbo[2].concat(argArrayExtra)) : argArrayExtra];
}


/**
 * create a normal callback function
 * @function toCallback
 * 
 * @param {cbo} cbo - a cbo object
 * @param {number} [reserve] - the count of reserved original prefix arguments
 * 
 * @returns a callback function
 * 
 * @example
 * function f(a1,a2,a3,a4){
 *     console.log([a1,a2,a3,a4]);
 * }
 * 
 * var cboTest= [null,f,['aa']];
 * var cb1= cbo.toCallback(cboTest);
 * cb1();	//aa
 * cb1('bb');	//bb,aa
 * cb1('bb','cc')	//bb,cc,aa
 * var cb2= cbo.toCallback(cboTest,0);
 * cb2();	//aa
 * cb2('bb');	//aa
 * var cb3= cbo.toCallback(cboTest,1);
 * cb3();	//undefined,aa
 * cb3('bb');	//bb,aa
 * cb3('bb','cc');	//bb,aa
 * 
 */
function toCallback(cbo, reserve) {
	if (!cbo[0] && !cbo[2]) return cbo[1];
	
	if( typeof(reserve) === "undefined" ) {
		return function () {
			_call(cbo, arguments.length?Array.prototype.slice.call(arguments):null, true);
		}
	}

	if( !reserve ) {
		return function () {
			_call(cbo);
		}
	}

	return function () {
		var arg= Array.prototype.slice.call(arguments,0,reserve);
		if( arg.length<reserve ) arg= arg.concat(new Array(reserve-arg.length));
		_call(cbo, arg, true);
	}
}


/**
 * call system `setTimeout` by cbo
 * @function setTimeout
 * 
 * @param {cbo} cbo - a cbo object
 * @param {number} ms - milliseconds to delay
 * 
 * @return system timer id
 */
function _setTimeout(cbo, ms) {
	return setTimeout(this.toCallback(cbo), ms);
}

//module

module.exports = {
	call: _call,

	combine: combine,

	toCallback: toCallback,

	setTimeout: _setTimeout,
};


},{}],2:[function(require,module,exports){

//addEventListener()
module.exports= function( thisObject, type, listener, options ){
	if( thisObject.addEventListener ) return thisObject.addEventListener.apply( thisObject, Array.prototype.slice.call(arguments,1) );
	else if( thisObject.attachEvent ) return thisObject.attachEvent.apply( thisObject, ["on"+type].concat(Array.prototype.slice.call(arguments,2)) );
	else throw Error("neither addEventListener nor attachEvent exists");
};

},{}],"nmui":[function(require,module,exports){

"use strict";

/**
 * @module nmui
 * 
 * @desc
 * 
 * Name-ui tool, an html element ui tool based on name attribute.
 * 
 * # Contents #
 * 
 * 1. tools
 *  * [.getId()				]{@link module:nmui~getId}
 *  * [.getMapping()		]{@link module:nmui~getMapping}
 *  * [.bindEvent()			]{@link module:nmui~bindEvent}
 *     * [eventConfigItem		]{@link module:nmui~eventConfigItem}
 *
 * 2. resource tools
 *  * [.addCss()				]{@link module:nmui~addCss}
 *
 * 3. initializing tools
 *  * [.init()			]{@link module:nmui~init}
 *     * [nmuiObject			]{@link module:nmui~nmuiObject}
 *     * [nmuiConfig			]{@link module:nmui~nmuiConfig}
 *
 *
 * @example
var nmui= require("nmui");
 *
 */

var cbo= require("cbo");
var _addEventListener= require("common-compatible/dom/addEventListener");


var seedIndex=0;		//unique dom element id seed

/**
 * Get the `id` of a dom element. If there's none, create a unique id for the element.
 * @function getId
 * 
 * @param {element} ele - a dom element
 * @param {string} [prefix] - prefix string for new id, default is "nmui_".
 * 
 * @returns The `id` of the `ei`
 */
function getId(ele, prefix)
{
	if(ele.id) return ele.id;

	if( !prefix ) prefix= "nmui_";

	var sid;
	while( document.getElementById(sid = prefix + (++seedIndex)) ){};

	return ele.id=sid;
}

//iterate children name
function _getMapping( ele, m ){
	var nd= ele.firstChild;
	var nm;
	while( nd ){
		if( nd.tagName ){
			nm= nd.getAttribute("name");
			if( nm && !(nm in m ) ) m[nm]= getId(nd);
			if( nd.firstChild ) _getMapping( nd, m );
		}
		nd= nd.nextSibling;
	}
}

/**
 * Get an object that mapping dom element `name` attribute to `id`.
 * @function getMapping
 * 
 * @param {element} ele - a dom element
 * 
 * @returns An object
 *  * mapping descendant's `name` to their `id`
 *  * mapping `""` to the `id` of the `ele` itself
 */
function getMapping(ele)
{
	var m={"": getId(ele)};   //map "" to ei itself
	_getMapping( ele, m );
	return m;
}


/**
 * event config item
 * > [ `name`, `eventName`, *`func`*, *`argArray`* ]
 * 
 * @typedef eventConfigItem
 * 
 * @property {string} name - `[0]` dom element `name` attribute
 * @property {string} eventName - `[1]` an event name string,  - don't prefix string `"on"`
 * @property {string|function} [func] - `[2]` a function name string in `this`, or a function.
 * 											\* if `func` is empty, a string of `name`+`'_on'`+`EventName` is supposed to filled into `func` (first letter of `eventName` is in upper case)
 * @property {array} [argArray] - `[3]` an argument array for calling `func`
 * 
 * @example
[ 'btn1', 'click', 'btn1_onClick' ]
//or
[ 'divMsg', 'dblclick', 'divMsg_onDblclick', [1,2,3] ]	//with extra argument
//or
[ 'spanHint', 'mouseover' ]		//string "spanHint_onMouseover" is set as function name
 */


/**
 * Bind event process from event config array
 * @function bindEvent
 * 
 * @param {object} thisObj - the `this` object
 * @param {object} nameMapping - an object mapping dom elements' `name` attribute to their `id`, refer to [getMapping()]{@link module:nmui~getMapping}
 * @param {eventConfigItem[]} eventConfig - an array of [eventConfigItem]{@link module:nmui~eventConfigItem}, to configure event binding.
 * 
 * @returns void
 */
function bindEvent( thisObj, nameMapping, eventConfig )
{
	var i,imax,evti,ele,func,evtn,evtf;
	imax= eventConfig.length;

	for(i=0;i<imax;i++) {
		evti=eventConfig[i];
		if( !evti ) continue;

		//get element
		ele= document.getElementById(nameMapping[evti[0]]);
		if( !ele ){
			console.warn("nmui event mapping, name unfound, " + evti );
			continue;
		}

		evtn= evti[1];
		evtf= evti[2];

		if( typeof evtf !=="function" ){
			if( !evtf ) evtf= evti[2]= evti[0]+"_on"+evtn.charAt(0).toUpperCase()+evtn.slice(1);
			if( ! thisObj[evtf] ){
				console.warn("nmui event mapping, method unfound, " + evti );
				//continue;
			}
		}

		_addEventListener( ele, evtn, cbo.toCallback([thisObj,evtf,evti[3]]) );
	}
}


/**
 * Add css text to document style
 * @function addCss
 * 
 * @param {string} cssText - css stylesheet text
 * 
 * @returns void
 */
function addCss(cssText)
{
	var style = document.createElement("style");
	style.type = "text/css";
	try {
		style.appendChild(document.createTextNode(cssText));
	}
	catch (ex) {
		style.styleSheet.cssText = cssText;
	}
	var head = document.getElementsByTagName("head")[0];
	head.appendChild(style);
}


/**
 * nmui config object
 * 
 * @typedef nmuiConfig
 * 
 * @property {string} html - html string for dom element `innerHTML`
 * @property {eventConfigItem[]} event - an array of [eventConfigItem]{@link module:nmui~eventConfigItem}, to configure event binding.
 * @property {string} css - css stylesheet text
 * @property {boolean} [cssLoaded] - a flag, that is set to `true` after `css` is loaded to the page.
 * 
 */

/**
 * nmui object
 * 
 * @typedef nmuiObject
 * 
 * @property {object} config - an object of [nmuiConfig]{@link module:nmui~nmuiConfig} type
 * @property {object} [nm] - a name mapping object, for saving the result of mapping dom elements' `name` attribute to their `id`, refer to [getMapping()]{@link module:nmui~getMapping} and [init()]{@link module:nmui~init}
 * 
 */


/**
 * Initialize a nmui object
 * @function init
 * 
 * @param {element} ei - a dom element
 * @param {object} uiObject - a javascript object that bound to `ei`, an object of [nmuiObject]{@link module:nmui~nmuiObject} type.
 * @param {object} [config] - a config object of [nmuiConfig]{@link module:nmui~nmuiConfig} type.
 *  * if `config` is empty, the existed `uiObject.config` will be used to initialize `uiObject`.
 *  * if `config` is not empty, it will be saved to `uiObject.config`.
 * 
 * @returns void
 */
function init( ei, uiObject, config )
{
	if( config ) uiObject.config= config;
	else config= uiObject.config;
	
	//1.css, only once
	if( config.css && ! config.cssLoaded ){
		addCss(config.css);
		config.cssLoaded= true;
	}
	
	//2. config.html
	if( config.html ) ei.innerHTML= config.html;
	
	//3. name mapping
	uiObject.nm= getMapping(ei);
	
	//4. event
	if( config.event ) bindEvent( uiObject, uiObject.nm, config.event );
	
}


//module

module.exports = {
	getId: getId,
	getMapping: getMapping,
	bindEvent: bindEvent,
	addCss: addCss,

	init: init,
};


},{"cbo":1,"common-compatible/dom/addEventListener":2}]},{},["nmui"]);

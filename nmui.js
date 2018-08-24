
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

		ele.addEventListener( evtn, cbo.toCallback([thisObj,evtf,evti[3]]) );
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


//A library of helpful, reusable functions and methods
(function(window, undefined){

	var 
	location = window.location,
	document = window.document,
	docElem = document.documentElement,
	Spektral = Spektral.prototype;

	function Spektral(){
		//INIT Spektral
	}

	Spektral.about = function() {
		return "Spektral.js V.01";
	}

	//////////////////
	////ATTACH EVENT LISTENER
	/////////////////
	Spektral.attachEventListener = function(eventTarget, eventType, eventHandler) {
		if (eventTarget.addEventListener) {
			eventTarget.addEventListener(eventType, eventHandler, false);
		} else if (eventTarget.attachEvent) {
			eventType = "on" + eventType;
			eventTarget.attachEvent(eventType, eventHandler);
		} else {
			eventTarget["on" + eventType] = eventHandler;
		}
	}

	//////////////////
	////DETACH EVENT LISTENER
	/////////////////
	Spektral.detachEventListener = function(eventTarget, eventType, eventHandler) {
		if (eventTarget.removeEventListener) {
			eventTarget.removeEventListener(eventType, eventHandler, false);
		} else if (eventTarget.detachEvent) {
			eventType = "on" + eventType;
			eventTarget.detachEvent(eventType, eventHandler);
		} else {
			eventTarget["on" + eventType] = null;
		}
	}

	//////////////////////////////////////
	////GET KEY
	//////////////////////////////////////
	Spektral.getKey = function(code) {

	    if(code === 38) {
	        return "UP";
	    }

	    if(code === 40) {       
	        return "DOWN";
	    }

	    if(code === 37) {
	        return "LEFT";
	    }

	    if(code === 39) {
	        return "RIGHT";
	    }

	    if(code === 13) {
	        return "ENTER";
	    }
	}

	//////////////////
	////CANCEL EVENT
	//////////////////
	Spektral.cancelEvent = function(e) {
		if (e.preventDefault) {
			e.preventDefault();
		} else { e.returnValue = false; }
	} 

	///////////////////
	///CANCEL PROPOGATION
	///////////////////
	Spektral.cancelPropogation = function(e) {
		if(e.stopPropagation) {
			e.stopPropagation();
		} else {
			e.cancelBubble = true;
		}
	}

	//////////////////
	////GET COMPUTED STYLE
	//////////////////
	Spektral.getComputedStyle = function(element, styleProperty) {
		var computedStyle = null;	
		if (typeof element.currentStyle != "undefined") {
			computedStyle = element.currentStyle;
		} else {
			computedStyle = document.defaultView.getComputedStyle(element, null);
		}
		return computedStyle[styleProperty];
	}

	///////////////////
	///GET VIEWPORT WIDTH
	///////////////////
	Spektral.getViewportWidth = function() {
       if (window.innerWidth) {
			return window.innerWidth;
       } else if (document.body && document.body.offsetWidth) {
			return document.body.offsetWidth;
       } else {
			return 0;
       }
	}

	///////////////////
	///GET VIEWPORT HEIGHT
	///////////////////
	Spektral.getViewportHeight = function() {
       if (window.innerHeight) {
			return window.innerHeight;
       } else if (document.body && document.body.offsetHeight) {
			return document.body.offsetHeight;
       } else {
			return 0;
       }
	}

	///////////////////
	////IS MATCH
	///////////////////
	Spektral.isMatch = function(itemA, itemB) {
		if(itemA === itemB) {
			return true;
		} else {
			return false;
		}
	}

	///////////////////
	///GET PARSE JSON
	///////////////////
	Spektral.getParseJSON = function(source) {

		var sourceType = Spektral.getType(source);

		if(sourceType === "string") {
			//load file
		}

		if(sourceType === "object") {
			//Parse object
		}

		function loadFile() {

		}

		function parse() {
			
		}

	}

	////////////////////
	////GET TYPE
	////////////////////
	Spektral.getType = function(obj) {
		return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
	}

	window.Spektral = Spektral;

}(window));
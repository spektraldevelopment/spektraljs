/**
 * Spektraljs
 *
 * Copyright (c) 2013 spektraldevelopment.com, David Boyle.
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 **/
(function(window, undefined){

    var
        location = window.location,
        document = window.document,
        docElem = document.documentElement,
        Spektral = Spektral.prototype,
        debug = false;

    function Spektral(){
        //Create Spektral Object
    }

    Spektral.debug = function () {
        debug = true;
    };

    Spektral.about = function () {
        var mode;
        if(debug) {
            mode = "debug";
        } else {
            mode = "release";
        }
        return "Spektral.js V.01 mode: " + mode;
    };

    //////////////////
    ////ATTACH EVENT LISTENER
    /////////////////
    Spektral.attachEventListener = function (eventTarget, eventType, eventHandler) {
        if (eventTarget.addEventListener) {
            eventTarget.addEventListener(eventType, eventHandler, false);
        } else if (eventTarget.attachEvent) {
            eventType = "on" + eventType;
            eventTarget.attachEvent(eventType, eventHandler);
        } else {
            eventTarget["on" + eventType] = eventHandler;
        }
    };

    //////////////////
    ////DETACH EVENT LISTENER
    /////////////////
    Spektral.detachEventListener = function (eventTarget, eventType, eventHandler) {
        if (eventTarget.removeEventListener) {
            eventTarget.removeEventListener(eventType, eventHandler, false);
        } else if (eventTarget.detachEvent) {
            eventType = "on" + eventType;
            eventTarget.detachEvent(eventType, eventHandler);
        } else {
            eventTarget["on" + eventType] = null;
        }
    };

    //////////////////////////////////////
    ////GET KEY
    //////////////////////////////////////
    Spektral.getKey = function (code) {

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
    };

    //////////////////
    ////CANCEL EVENT
    //////////////////
    Spektral.cancelEvent = function (e) {
        if (e.preventDefault) {
            e.preventDefault();
        } else { e.returnValue = false; }
    };

    ///////////////////
    ///CANCEL PROPOGATION
    ///////////////////
    Spektral.cancelPropogation = function (e) {
        if(e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
    };

    ///////////////////
    ///USE HANDCURSOR
    ///////////////////
    Spektral.useHandCursor = function (element, use) {
        use = use || true;

        if(use) {
            //Use hand cursor
        } else {
            //Return to default
        }

    };

    //////////////////
    ////GET COMPUTED STYLE
    //////////////////
    Spektral.getComputedStyle = function (element, styleProperty) {
        var computedStyle = null;
        if (typeof element.currentStyle != "undefined") {
            computedStyle = element.currentStyle;
        } else {
            computedStyle = document.defaultView.getComputedStyle(element, null);
        }
        return computedStyle[styleProperty];
    };

    ///////////////////
    ////GET VIEWPORT SIZE
    ///////////////////
    Spektral.getViewportSize = function () {
        var w, h;
        //Width
        if (window.innerWidth) {
            w = window.innerWidth;
        } else if (document.body && document.body.offsetWidth) {
            w = document.body.offsetWidth;
        } else {
            w = 0;
        }
        //Height
        if (window.innerHeight) {
            h = window.innerHeight;
        } else if (document.body && document.body.offsetHeight) {
            h = document.body.offsetHeight;
        } else {
            h = 0;
        }

        return { width: w, height: h };
    };

    ///////////////////
    ////IS MATCH
    ///////////////////
    Spektral.isMatch = function(itemA, itemB) {
        if(itemA === itemB) {
            return true;
        } else {
            return false;
        }
    };

    ///////////////////
    ///LOAD JSON
    ///////////////////
    Spektral.loadJSON = function (source, callback, async) {

        async = async || true;

        var sourceType = Spektral.getType(source);
        var ext;

        try {
            ext = Spektral.getExtension(source)
        } catch (e) {
            Spektral.throwError("loadJSON: source must be string.")
        }

        if(sourceType === "string") {
            //load file
            Spektral.loadFile(source, callback, async);
        } else {
            Spektral.throwError("loadJSON: Invalid source type: " + sourceType + ". Source must be string or external json file.");
        }
    };

    ///////////////////
    ///LOAD XML
    ///////////////////
    Spektral.loadXML = function (source, callback, async)
    {
        async = async || true;

        var sourceType = Spektral.getType(source);
        var ext;

        try {
            ext = Spektral.getExtension(source)
        } catch (e) {
            Spektral.throwError("loadXML: source must be string.")
        }

        if(sourceType === "string") {
            //load file
            Spektral.loadFile(source, callback, async);
        } else {
            Spektral.throwError("loadXML: Invalid source type: " + sourceType + ". Source must be string or external json file.");
        }
    };

    ////////////////////
    ////LOAD FILE
    ////////////////////
    Spektral.loadFile = function (file, callback, async) {

        async = async || true;

        var ext = Spektral.getExtension(file);
        var xhr;
        var dataObj;
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xhr = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            var versions = ["MSXML2.XmlHttp.5.0",
                "MSXML2.XmlHttp.4.0",
                "MSXML2.XmlHttp.3.0",
                "MSXML2.XmlHttp.2.0",
                "Microsoft.XmlHttp",
                "Microsoft.XMLHTTP"];

            for (var i =0; i < versions.length; i++)
            {
                try {
                    xhr = new ActiveXObject(versions[i]);
                    break;
                } catch (e) { Spektral.throwError("loadFile: Couldn't find the proper XMLHttp version.")}
            }
        }

        if (ext === "json") {
            xhr.overrideMimeType("application/json");
        }

        Spektral.attachEventListener(xhr, 'readystatechange', checkIfReady);
        Spektral.attachEventListener(xhr, 'error', onLoadError);

        function checkIfReady() {
            if(xhr.readyState < 4) {
                return;
            }
            if(xhr.status !== 200) {
                return;
            }
            if(xhr.readyState === 4) {
                var response;
                if(ext === "json") {
                    response = JSON.parse(xhr.responseText);
                } else if(ext === "xml") {
                    response = xhr.responseXML;
                } else {
                    response = xhr.responseText;
                }
                callback(response);
            }
        }

        function onLoadError(e) {
            Spektral.throwError("loadError: There was a load error: " + e);
        }

        xhr.open("GET", file, async);
        xhr.send();
    };

    ////////////////////
    ////GET XML NODE VALUE
    ///////////////////
    Spektral.getXMLNodeValue = function(xml, request) {
        var values = Spektral.splitString(request, ".");
        var parentNode = xml.getElementsByTagName(values[0])[0];
        var requestedNode = Spektral.splitString(values[1], "[")[0];
        var requestedNodeIndex = Spektral.stripBrackets(values[1]); 
        return parentNode.getElementsByTagName(requestedNode)[requestedNodeIndex].childNodes[0].nodeValue;
    };

    //////////////////
    ////CREATE XML NODE ARRAY
    //////////////////
    Spektral.createXMLNodeArray = function (xml, request) {
        var parentNode = xml.getElementsByTagName(request)[0].childNodes;
        ///var childNodes 
        var list = Spektral.listArrayElements(parentNode);
        //Spektral.log("parentNode.length: " + parentNode.childNodes.length);
        //In the process of figuring this one out
    };

    //////////////////
    ////QUERY XML -- Can find any node value no matter how deeply buried
    //////////////////
    Spektral.queryXML = function (xml, request) {

    };

    //////////////////
    ////DETECT CHARACTER
    //////////////////
    Spektral.detectCharacter = function(request, character) {

    };

    //////////////////
    ////STRIP BRACKETS
    //////////////////
    Spektral.stripBrackets = function(request) {
        var value;
        //[]
        try {
            value = request.match(/\[(.*?)\]/)[1];
        } catch(e){}
        //()
        try {
            value = request.match(/\((.*?)\)/)[1];
        } catch(e){}
        //{}
        try {
            value = request.match(/\{(.*?)\}/)[1];
        } catch(e){}
        return value;
    };

    //////////////////
    ////SPLIT STRING
    //////////////////
    Spektral.splitString = function(request, character) {
        var values = request.split(character);
        return values;
    };

    //////////////////
    ////LIST ARRAY ELEMENTS
    /////////////////
    Spektral.listArrayElements = function (array) {

        var type = Spektral.getType(array);
        Spektral.log("Type: " + type);

        if(type !== 'array' && type !== 'nodelist') {
            Spektral.throwError("listArrayElements: You must pass either an array or nodelist to this function.")
        } else {
            for (var i = 0; i < array.length; i++) {
                Spektral.log("runLoop: item" + i + ": " + array[i].nodeName);
            }
        }
    }


    ////////////////////
    ////GET TYPE
    ////////////////////
    Spektral.getType = function (obj) {
        return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
    };

    ////////////////////
    ////GET FILE EXTENSION
    ////////////////////
    Spektral.getExtension = function (file) {
        var type = Spektral.getType(file);

        if(file === undefined) {
            Spektral.throwError("getExtension: file is undefined. Did you pass a file name to this function?")
        } else if (type !== "string") {
            Spektral.throwError("getExtension: file needs to be string.")
        }
        return file.split('.').pop();
    };

    ///////////////////
    ////THROW ERROR
    ///////////////////
    Spektral.throwError = function (message) {
        throw new Error("Spektraljs: " + message);
    };

    ///////////////////
    ////LOG
    ///////////////////
    Spektral.log = function (message) {
        if(debug) {
            console.log("Spektraljs: " + message);
        }
    };

    window.Spektral = Spektral;

}(window));
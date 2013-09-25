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



    //**********************************************************************

    //////////////////////////////
    ////XML TO JSON
    //////////////////////////////
    Spektral.xmlToJSON = function(xml, node, index) {
        node = node || xml.firstChild.nodeName;
        index = index || 0;

        var parentNode = xml.getElementsByTagName(node)[index];
        var child, type, xmlObject = {};

        for(var child = parentNode.firstChild; child != null; child = child.nextSibling) {
            type = Spektral.getType(child);

           // Spektral.log("type: " + type);

            if(type === "text") {
                //CDATA and Text
                //nodeArray.push(child.nodeValue);//Remember to code this to handle if the main node has textContent
            } else if (type === "element") {
                xmlObject[child.tagName] = Spektral.createObject(child.childNodes);     
            }
        }

        return xmlObject;
    };

    /////////////////////////
    ////CREATE OBJECT
    ///////////////////////////
    Spektral.createObject = function (list) {

        var child, type, listArray = [], listObject, attributes, attrLength, hasChildren, length;

        for(var i = 0; i < list.length; i++) {
            child = list[i];
            type = Spektral.getType(child);

            if(type === "element") {

                hasChildren = child.hasChildNodes();
                length = child.childNodes.length;

                //Element
                listObject = {};
        
                attributes = child.attributes;
                attrLength = attributes.length;

                if(attrLength >= 1) {        
                    for(var j = 0; j < attributes.length; j++) {
                        listObject[attributes.item(j).name] = attributes.item(j).value;
                    }
                }

                listObject[child.tagName] = Spektral.getTextContent(child);

                if(hasChildren && length > 1) {//nodeName
                    listObject[child.tagName] = Spektral.createObject(child.childNodes);
                } 

                listArray.push(listObject);
            }
        }           
        return listArray;
    };


    //***UTILS************************************************************

    //////////////////
    ////QUERY 
    //////////////////
    Spektral.query = function (element) {
        //Use querySelectorAll
    };

    //////////////////
    ////GET ELEMENT
    //////////////////
    Spektral.getElement = function (element, index) {
        var el, elementList = Spektral.listElements();

        for (var i = 0; i < elementList.length; i++) {

            if(element === elementList[i]) {
                Spektral.log("getElement: Match!: " + elementList[i]);
                if(index) {
                    el = document.getElementsByTagName(element)[index];
                } else {
                    el = document.getElementsByTagName(element);
                }
            } else {
                try {
                    el = document.getElementById(element);
                } catch (e) { Spektral.throwError("getElement: No ID found!") }
            }
        }

        //     el = document.getElementsByName(element);//Check if name attribute exists
        return el;
    };

    //////////////////
    ////CREATE ELEMENT
    //////////////////
    Spektral.createElement = function (element, id) {

    };

    //////////////////
    ////REMOVE ELEMENT
    //////////////////
    Spektral.removeElement = function (element) {

    };

    ///////////////////
    ////CREATE ATTRIBUTE
    //////////////////
    Spektral.createAttribute = function (element, attribute, value) {
        element.setAttribute(attribute, value);
    };

    //////////////////
    ////RETRIEVE ATTRIBUTE
    //////////////////
    Spektral.retrieveAttribute = function (element, attribute, value ) {

    };

    //////////////////
    ////DESTROY ATTRIBUTE
    //////////////////
    Spektral.destroyAttribute = function ( element, attribute, value ) {

    };

    ////////////////////
    ////GET TEXT CONTENT
    ///////////////////
    Spektral.getTextContent = function(element) {
        //innerHTML?
        var content = element.textContent; // Check if textContent is defined
        if (content !== undefined) { 
            return content;
        } else { 
            return element.innerText;
        }
    };

    //////////////////////
    ////GET NODE ATTRIBUTES
    //////////////////////
    Spektral.getNodeAttributes = function (element) {
        var attributes = element.attributes, attrObj = {};
        if(attributes.length >= 1) {
            for(var i = 0; i < attributes.length; i++) {
                attrObj[attributes.item(i).name] = attributes.item(i).value;
            }
        }
        return attrObj;
    };

    //////////////////
    ////SHOW ELEMENT
    //////////////////
    Spektral.showElement = function (element) {

    };

    //////////////////
    ////HIDE ELEMENT
    //////////////////
    Spektral.hideElement = function (element) {

    };

    
    /////////////////////////////
    ////GET NODES
    ///////////////////////////////
    Spektral.getNodes = function (list) {

        for (var i = 0; i < list.length; i++) {
            return list[i].nodeType;
        }
    };


    //////////////////////
    ////LIST NODE ATTRIBUTES
    //////////////////////
    Spektral.listNodeAttributes = function (node) {
        var nodeArray = [];
        for (var key in node) {
            nodeArray.push(key);
            Spektral.log("Node: " + node.nodeName + " Attribute: " + key);
        }
        return nodeArray;
    };

    /////////////////////
    ////IS OBJECT EMPTY
    ////////////////////
    Spektral.isObjectEmpty = function (obj) {
        for(var key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    };

    //////////////////
    ////DETECT CHARACTER
    //////////////////
    Spektral.detectCharacter = function(request, character) {

    };

    ///////////////////
    ////GET INFO - deconstructs an element down to its properties
    ///////////////////
    Spektral.getInfo = function (element) {
        var info;
        try {
            info = JSON.stringify(element);
        } catch (e) {}

        return info;
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

    ////////////////////
    ////CONVERT CASE
    ////////////////////
    Spektral.convertCase = function(stringToConvert, newCase) {
        newCase = newCase || "lower";
        if (newCase === "lower") {
            return stringToConvert.toLowerCase();
        } else if (newCase === "upper") {
            return stringToConvert.toUpperCase();
        }
    };

    //////////////////
    ////SPLIT STRING
    //////////////////
    Spektral.splitString = function(request, character) {
        var values = request.split(character);
        return values;
    };

    ////////////////////
    ////LIST ELEMENTS
    ////////////////////
    Spektral.listElements = function () {
        var all = document.getElementsByTagName("*"), elementArray = [], node;
        for (var i = 0; i < all.length; i++) {
            node = Spektral.convertCase(all[i].nodeName);
            elementArray.push(node);
            //Spektral.log("listElements: " + node);
        }
        return elementArray;
    };

    //////////////////
    ////LIST ARRAY ELEMENTS
    /////////////////
    Spektral.listArrayElements = function (array) {

        var type = Spektral.getType(array);
        if(type !== 'array' && type !== 'nodelist') {
            Spektral.throwError("listArrayElements: You must pass either an array or nodelist to this function.")
        } else {
            for (var i = 0; i < array.length; i++) {
                if(type === 'nodelist') {
                    Spektral.log("NodeList: listArrayElement: item" + i + ": " + array[i].nodeName);
                } else if (type === 'array') {
                    Spektral.log("Array: listArrayElement: item" + i + ": " + array[i]);
                }
            }
        }
    };

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
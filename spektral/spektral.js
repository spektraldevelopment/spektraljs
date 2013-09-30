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
/*global ActiveXObject: false */
/*jslint plusplus: true, unparam: true */
(function (window) {
    "use strict";

    var
        Spektral = {},
        location = window.location,
        document = window.document,
        docElem = document.documentElement,
        debug = false,
        mouseEvents;

    mouseEvents = ["click", "dblclick", "mousedown", "mousemove", "mouseup", "mouseover", "mouseout"];

    //////////////////
    ////DEBUG
    /////////////////
    Spektral.debug = function () {
        debug = true;
    };

    //////////////////
    ////ABOUT
    /////////////////
    Spektral.about = function () {
        var mode, message;
        if (debug) {
            mode = "debug";
        } else {
            mode = "release";
        }
        message = "Spektral.js V.01 mode: " + mode;
        Spektral.log(message);
        return message;
    };

    //////////////////
    ////ATTACH EVENT LISTENER
    /////////////////
    Spektral.attachEventListener = function (eventTarget, eventType, eventHandler) {
        var i;
        if (eventTarget.addEventListener) {
            eventTarget.addEventListener(eventType, eventHandler, false);
        } else if (eventTarget.attachEvent) {
            eventType = "on" + eventType;
            eventTarget.attachEvent(eventType, eventHandler);
        } else {
            eventTarget["on" + eventType] = eventHandler;
        }

        for (i = 0; i < mouseEvents.length; i++) {
            if (eventType === mouseEvents[i]) {
                Spektral.useHandCursor(eventTarget);
                break;
            }
        }
    };

    //////////////////
    ////DETACH EVENT LISTENER
    /////////////////
    Spektral.detachEventListener = function (eventTarget, eventType, eventHandler) {
        var i;
        if (eventTarget.removeEventListener) {
            eventTarget.removeEventListener(eventType, eventHandler, false);
        } else if (eventTarget.detachEvent) {
            eventType = "on" + eventType;
            eventTarget.detachEvent(eventType, eventHandler);
        } else {
            eventTarget["on" + eventType] = null;
        }

        for (i = 0; i < mouseEvents.length; i++) {
            if (eventType === mouseEvents[i]) {
                Spektral.useDefaultCursor(eventTarget);
                break;
            }
        }
    };

    //////////////////////////////////////
    ////GET KEY
    //////////////////////////////////////
    Spektral.getKey = function (code) {
        var key;
        if (code === 38) {
            key = "UP";
        }
        if (code === 40) {
            key = "DOWN";
        }
        if (code === 37) {
            key = "LEFT";
        }
        if (code === 39) {
            key = "RIGHT";
        }
        if (code === 13) {
            key = "ENTER";
        }
        return key;
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
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
    };

    ///////////////////
    ///USE HAND CURSOR
    ///////////////////
    Spektral.useHandCursor = function (element, cursorType) {
        cursorType = cursorType || "pointer";
        Spektral.createSetAttribute(element, "style", "cursor: " + cursorType);
    };

    Spektral.useDefaultCursor = function (element) {
        Spektral.createSetAttribute(element, "style", "cursor: default");
    };

    //////////////////
    ////GET COMPUTED STYLE
    //////////////////
    Spektral.getComputedStyle = function (element, styleProperty) {
        var computedStyle = null;
        if (element.currentStyle !== undefined) {
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
    Spektral.isMatch = function (itemA, itemB) {

        var isMatch = false;
        if (itemA === itemB) {
            isMatch = true;
        }
        return isMatch;
    };

    ///////////////////
    ///LOAD JSON
    ///////////////////
    Spektral.loadJSON = function (source, callback, async) {

        async = async || true;

        var sourceType = Spektral.getType(source);

        if (sourceType === "string") {
            //load file
            Spektral.loadFile(source, callback, async);
        } else {
            Spektral.throwError("loadJSON: Invalid source type: " + sourceType + ". Source must be string or external json file.");
        }
    };

    ///////////////////
    ///LOAD XML
    ///////////////////
    Spektral.loadXML = function (source, callback, async) {
        async = async || true;

        var sourceType = Spektral.getType(source);

        if (sourceType === "string") {
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

        var ext = Spektral.getExtension(file), xhr = Spektral.getXHR();

        if (ext === "json") {
            xhr.overrideMimeType("application/json");
        }

        function checkIfReady() {
            if (xhr.readyState < 4) {
                return;
            }
            if (xhr.status !== 200) {
                return;
            }
            if (xhr.readyState === 4) {
                var response;
                if (ext === "json") {
                    response = JSON.parse(xhr.responseText);
                } else if (ext === "xml") {
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

        Spektral.attachEventListener(xhr, 'readystatechange', checkIfReady);
        Spektral.attachEventListener(xhr, 'error', onLoadError);

        xhr.open("GET", file, async);
        xhr.send();
    };

    //////////////////////////////
    ////GET XHR
    //////////////////////////////
    Spektral.getXHR = function () {
        var result, versions, i;

        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            result = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            versions = ["MSXML2.XmlHttp.5.0",
                "MSXML2.XmlHttp.4.0",
                "MSXML2.XmlHttp.3.0",
                "MSXML2.XmlHttp.2.0",
                "Microsoft.XmlHttp",
                "Microsoft.XMLHTTP"];

            for (i = 0; i < versions.length; i++) {
                try {
                    result = new ActiveXObject(versions[i]);
                    return result;
                } catch (e) { Spektral.throwError("loadFile: Couldn't find the proper XMLHttp version."); }
            }
        }
        return result;
    };


    //**********************************************************************

    //////////////////////////////
    ////XML TO JSON
    //////////////////////////////
    Spektral.xmlToJSON = function (xml, node, index) {
        node = node || xml.firstChild.nodeName;
        index = index || 0;

        var parentNode = xml.getElementsByTagName(node)[index], child, type, xmlObject = {};

        for (child = parentNode.firstChild; child !== null; child = child.nextSibling) {
            type = Spektral.getType(child);

            if (type === "text") {
                //CDATA and Text
                //nodeArray.push(child.nodeValue);//Remember to code this to handle if the main node has textContent
                Spektral.log("Going to handle text in here someday.");
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

        var child, type, listArray = [], listObject, attributes, attrLength, hasChildren, length, i, j;

        for (i = 0; i < list.length; i++) {
            child = list[i];
            type = Spektral.getType(child);

            if (type === "element") {

                hasChildren = child.hasChildNodes();
                length = child.childNodes.length;

                //Element
                listObject = {};
                attributes = child.attributes;
                attrLength = attributes.length;

                if (attrLength >= 1) {
                    for (j = 0; j < attributes.length; j++) {
                        listObject[attributes.item(j).name] = attributes.item(j).value;
                    }
                }

                listObject[child.tagName] = Spektral.getTextContent(child);

                if (hasChildren && length > 1) {
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
    ////GET ELEMENT - might rename to "findElement"
    //////////////////
    Spektral.getElement = function (element, index) {

        //Integrate querySelectorAll

        var isHTML = Spektral.isHTMLElement(element), isID = Spektral.isHTMLID(element), isName = Spektral.isHTMLName(element), el;

        Spektral.log(element + " is HTMLElement?: " + isHTML + " is ID?: " + isID + " is Name: " + isName);

        if (isHTML === true) {
            if (index === undefined) {
                el = document.getElementsByTagName(element)[0];
            } else {
                el = document.getElementsByTagName(element)[index];
            }
        } else if (isID === true) {
            el = document.getElementById(element);
        } else if (isName === true) {
            if (index === undefined) {
                el = document.getElementsByName(element)[0];
            } else {
                el = document.getElementsByName(element)[index];
            }
        } else {
            Spektral.throwError("Element Not Found. Ensure you are calling a valid name or element.");
        }
        return el;
    };

    //////////////////
    ////IS HTML ELEMENT
    //////////////////
    Spektral.isHTMLElement = function (element) {
        var list = Spektral.listElements(), isHTML = null, i;
        for (i = 0; i < list.length; i++) {
            if (element === list[i]) {
                isHTML = true;
                break;
            }
        }
        if (isHTML === null) {
            isHTML = false;
        }
        return isHTML;
    };

    //////////////////
    ////IS HTML ID
    //////////////////
    Spektral.isHTMLID = function (ID) {
        var list = Spektral.listElements("id"), isID = null, i;
        for (i = 0; i < list.length; i++) {
            if (ID === list[i]) {
                isID = true;
                break;
            }
        }
        if (isID === null) {
            isID = false;
        }
        return isID;
    };

    //////////////////
    ////IS HTML NAME
    //////////////////
    Spektral.isHTMLName = function (name) {
        var list = Spektral.listElements("name"), isName = null, i;
        for (i = 0; i < list.length; i++) {
            if (name === list[i]) {
                isName = true;
                break;
            }
        }
        if (isName === null) {
            isName = false;
        }
        return isName;
    };

    //////////////////
    ////CREATE ELEMENT
    //////////////////
    Spektral.createNewElement = function (element, id, parent) {

        var newElementID, parentNode, newElement, body = Spektral.getElement("body"), errorString;

        Spektral.log("createNewElement: parent type: " + Spektral.getType(parent));

        newElementID = id || null;

        if (Spektral.getType(parent) === "string") {
            parentNode = Spektral.getElement(parent) || null;
        } else {
            parentNode = parent || null;
        }

        newElement = document.createElement(element);

        if (parentNode === null) {
            //body is default element when parent is not defined
            body.appendChild(newElement);
        } else {
            if (parentNode !== null) {
                parentNode.appendChild(newElement);
            } else {
                errorString = "createElement: could not find parent target node.";
                if (parentNode !== null) { errorString += " parentNode: " + parentNode; }
                Spektral.throwError(errorString);
            }
        }

        if (newElementID !== null) {
            newElement.id = newElementID;
        }

        return newElement;
    };

    //////////////////
    ////MOVE TO AFTER
    //////////////////
    Spektral.moveToAfter = function (element, targetElement) {
        var parent = element.parentNode;
        parent.insertBefore(element, targetElement.nextSibling);
    };

    //////////////////
    ////MOVE TO BEFORE
    //////////////////
    Spektral.moveToBefore = function (element, targetElement) {
        var parent = element.parentNode;
        parent.insertBefore(element, targetElement);
    };

    //////////////////
    ////REMOVE ELEMENT
    //////////////////
    Spektral.removeElement = function (element) {

    };

    ///////////////////
    ////CREATE SET ATTRIBUTE
    //////////////////
    Spektral.createSetAttribute = function (element, attribute, value) {
        element.setAttribute(attribute, value);
    };

    //////////////////
    ////RETRIEVE ATTRIBUTE
    //////////////////
    Spektral.retrieveAttribute = function (element, attribute, value) {

    };

    //////////////////
    ////DESTROY ATTRIBUTE
    //////////////////
    Spektral.destroyAttribute = function (element, attribute, value) {

    };

    ////////////////////
    ////GET TEXT CONTENT
    ///////////////////
    Spektral.getTextContent = function (element) {
        //innerHTML?
        var content = element.textContent; // Check if textContent is defined
        if (content === "undefined") {
            content = element.innerText;
        }
        return content;
    };

    //////////////////////
    ////GET NODE ATTRIBUTES
    //////////////////////
    Spektral.getNodeAttributes = function (element) {
        var attributes = element.attributes, attrObj = {}, i;
        if (attributes.length >= 1) {
            for (i = 0; i < attributes.length; i++) {
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
    ////GET NODES -- DO I need this?
    ///////////////////////////////
    Spektral.getNodes = function (list) {

//        for (var i = 0; i < list.length; i++) {
//            return list[i].nodeType;
//        }
    };


    //////////////////////
    ////LIST NODE ATTRIBUTES
    //////////////////////
    Spektral.listNodeAttributes = function (node) {
        var nodeArray = [], key;
//        if (me.hasOwnProperty(prop)) {
//            alert(me[prop]);
//        }
        for (key in node) {
            if (node.hasOwnProperty(key)) {
                nodeArray.push(key);
                Spektral.log("Node: " + node.nodeName + " Attribute: " + key);
            }
        }
        return nodeArray;
    };

    /////////////////////
    ////IS OBJECT EMPTY
    ////////////////////
    Spektral.isObjectEmpty = function (obj) {
        var key;
        for (key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    };

    //////////////////
    ////DETECT CHARACTER
    //////////////////
    Spektral.detectCharacter = function (request, character) {

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
    Spektral.stripBrackets = function (request) {
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
    Spektral.convertCase = function (stringToConvert, newCase) {
        newCase = newCase || "lower";
        var newString;
        if (newCase === "lower") {
            newString = stringToConvert.toLowerCase();
        } else if (newCase === "upper") {
            newString =  stringToConvert.toUpperCase();
        }
        return newString;
    };

    //////////////////
    ////SPLIT STRING
    //////////////////
    Spektral.splitString = function (request, character) {
        return request.split(character);
    };

    ////////////////////
    ////LIST ELEMENTS
    ////////////////////
    Spektral.listElements = function (attribute) {

        attribute = attribute || null;

        var all = document.getElementsByTagName("*"), elementArray = [], node, i;

        for (i = 0; i < all.length; i++) {
            if (attribute === "id") {
                node = all[i].id;
                if (node !== "") {
                    elementArray.push(node);
                }
            } else if (attribute === "name") {
                node = all[i].name;
                if (node !== "") {
                    elementArray.push(node);
                }
            } else {
                node = Spektral.convertCase(all[i].nodeName);
                elementArray.push(node);
            }
        }
        return elementArray;
    };

    //////////////////
    ////LIST ARRAY ELEMENTS
    /////////////////
    Spektral.listArrayElements = function (array) {

        var type = Spektral.getType(array), i;
        if (type !== 'array' && type !== 'nodelist') {
            Spektral.throwError("listArrayElements: You must pass either an array or nodelist to this function.")
        } else {
            for (i = 0; i < array.length; i++) {
                if (type === 'nodelist') {
                    Spektral.log("NodeList: listArrayElement: item" + i + ": " + array[i].nodeName);
                } else if (type === 'array') {
                    Spektral.log("Array: listArrayElement: item" + i + ": " + array[i]);
                }
            }
        }
    };

    //////////////////
    ////LIST CHILD NODES
    /////////////////
    Spektral.listChildNodes = function (element) {
        var children = element.childNodes, i;
        Spektral.log("Children of: " + element.nodeName);
        for (i = 0; i < children.length; i++) {
            Spektral.log("Child: " + children[i]);
        }
    };

    ////////////////////
    ////GET TYPE
    ////////////////////
    Spektral.getType = function (obj) {
        return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
    };

    ////////////////////
    ////VALIDATE PARAMS
    ////////////////////
    Spektral.validateParams = function (params) {
        var paramsType = Spektral.getType(params);

        if (paramsType !== "object") {
            Spektral.throwError("validateParams: params must always be an object. Currently it is an " + params + ".")
        }
    };

    ////////////////////
    ////GET FILE EXTENSION
    ////////////////////
    Spektral.getExtension = function (file) {
        var type = Spektral.getType(file);

        if (file === undefined) {
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
        if (debug) {
            console.log("Spektraljs: " + message);
        }
    };

    window.Spektral =  Spektral;

}(window));
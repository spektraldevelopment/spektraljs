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
        //if eventTarget is undefined then use get element to find it
        var i, targetType = Spektral.getType(eventTarget);
        if(targetType === "string") {
            eventTarget = Spektral.getElement(eventTarget);
        }
        if (eventTarget.addEventListener) {
            eventTarget.addEventListener(eventType, eventHandler, false);
        } else if (eventTarget.attachEvent) {
            eventType = "on" + eventType;
            eventTarget.attachEvent(eventType, eventHandler);
        } else {
            eventTarget["on" + eventType] = eventHandler;
        }
        for (i = 0; i < mouseEvents.length; i++) {
            if (eventType === mouseEvents[i] && targetType !== "global") {
                Spektral.useHandCursor(eventTarget);
                break;
            }
        }
    };

    //////////////////
    ////DETACH EVENT LISTENER
    /////////////////
    Spektral.detachEventListener = function (eventTarget, eventType, eventHandler) {
        //if eventTarget is undefined then use get element to find it
        var i, targetType = Spektral.getType(eventTarget);
        if(targetType === "string") {
            eventTarget = Spektral.getElement(eventTarget);
        }
        if (eventTarget.removeEventListener) {
            eventTarget.removeEventListener(eventType, eventHandler, false);
        } else if (eventTarget.detachEvent) {
            eventType = "on" + eventType;
            eventTarget.detachEvent(eventType, eventHandler);
        } else {
            eventTarget["on" + eventType] = null;
        }
        for (i = 0; i < mouseEvents.length; i++) {
            if (eventType === mouseEvents[i] && targetType !== "global") {
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
    ////CREATE EVENT
    //////////////////
    Spektral.createEvent = function (eventName, details, bub, can) {

        details = details || null;
        bub = bub || true;
        can = can || true;

        var event, key;

        if (details === null) {
            event = new Event(eventName);
        } else {
            event = new CustomEvent(eventName, { 'detail': details, bubbles: bub, cancelable: can });
        }
        return event;
    };

    //////////////////
    ////CANCEL EVENT
    //////////////////
    Spektral.cancelEvent = function (evt) {
        if (evt.preventDefault) {
            evt.preventDefault();
        } else { evt.returnValue = false; }
    };

    ///////////////////
    ///CANCEL PROPOGATION
    ///////////////////
    Spektral.cancelPropagation = function (evt) {
        if (evt.stopPropagation) {
            evt.stopPropagation();
        } else {
            evt.cancelBubble = true;
        }
    };

    ///////////////////
    ///GET TARGET
    ///////////////////
    Spektral.getTarget = function (evt) {
        return evt.relatedTarget || evt.fromElement || evt.target;
    };

    ///////////////////
    ///GET TARGET ID
    ///////////////////
    Spektral.getTargetID = function (element) {
        return element.target.id;
    }

    ///////////////////
    ///USE HAND CURSOR
    ///////////////////
    Spektral.useHandCursor = function (element, cursorType) {
        cursorType = cursorType || "pointer";
        var cursorString = "cursor:" + cursorType, elemType = Spektral.getType(element);
        if(elemType !== "input") {
            //input elements have the hand cursor by default,
            //there might be others so I will keep an eye out
            Spektral.appendStyle(element, cursorString);
        }
    };

    ///////////////////
    ///USE DEFAULT CURSOR
    ///////////////////
    Spektral.useDefaultCursor = function (element) {
        Spektral.appendStyle(element, "cursor: default");
    };

    ///////////////////
    ///GET MOUSE POS - In the midst of getting mouseX/Y within the element
    ///////////////////
    Spektral.getMousePos = function (evt) {
        //evt = evt || window.event;

        if (evt === undefined) {
            Spektral.throwError("getMousePos: Event is undefined. If not targeting a specific element, use [window].");
        }

        var 
            mouse = {}, 
            x = 0, 
            y = 0, 
            offsetX = 0, offsetY = 0, 
            mouseX = 0, mouseY = 0, 
            target = Spektral.getTarget(evt), 
            targetX = Spektral.getPos(target).x, targetY = Spektral.getPos(target).y;

        // if event object has pageX property
        // get position using pageX, pageY
        if (evt.pageX) {

            x = evt.pageX;
            y = evt.pageY;
            //Spektral.log("PageX/Y available.");
        } else if (evt.clientX) {
                
            // if documentElement.scrollLeft supported
            if (docElem.scrollLeft) {

                offsetX = docElem.scrollLeft;
                offsetY = docElem.scrollTop;
            } else if (document.body) {

                offsetX = document.body.scrollLeft;
                offsetY = document.body.scrollTop;
            }

            x = evt.clientX + offsetX;
            y = evt.clientY + offsetY;  
            //Spektral.log("ClientX/Y available.");
        } else {
            Spektral.throwError("getMousePos: pageX/Y and clientX/Y could not be found.");
        }

        mouse["x"] = Spektral.roundNum(x);
        mouse["y"] = Spektral.roundNum(y);
        mouse["mouseX"] = Spektral.roundNum(x - targetX);
        mouse["mouseY"] = Spektral.roundNum(y - targetY);//Appears to work, but try on inline elements to be sure.

        return mouse;
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
                } catch (err) { Spektral.throwError("loadFile: Couldn't find the proper XMLHttp version."); }
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
                //Spektral.log("Going to handle text in here someday.");
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
                    for (j = 0; j < attributes.length; j += 1) {
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


    //***ELEMENTS************************************************************

    //////////////////
    ////QUERY 
    //////////////////
    Spektral.query = function (element) {
        var q, item;
        try {
            q = document.querySelectorAll(element);
            if (q.length <=1) {
                item = q[0];
            } else {
                item = q;
            }
        } catch (err) {}

        return item;
    };

    //////////////////
    ////GET ELEMENT - might rename to "findElement"
    //////////////////
    Spektral.getElement = function (element, index) {

        //Integrate querySelectorAll

        var isHTML = Spektral.isHTMLElement(element), isID = Spektral.isHTMLID(element), isName = Spektral.isHTMLName(element), el, elType, nList;

        //Spektral.log(element + " is HTMLElement?: " + isHTML + " is ID?: " + isID + " is Name: " + isName);

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
            //Try query
            el = Spektral.query(element);
            if(el === undefined) {
                Spektral.throwError("Element Not Found. Ensure you are calling an existing element.");
            }
        }
        elType = Spektral.getType(el);
        if (elType === "nodelist") {
            Spektral.log("getElement: More than one element was found.");
            Spektral.listArrayElements(el)
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

        //Spektral.log("createNewElement: parent type: " + Spektral.getType(parent));

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

        try {
            element.remove();
        } catch (err) {
            //Spektral.log("removeElement: .remove() was not available. Reverting to removeChild().")
            element.parentNode.removeChild(element);
        }
    };

    //////////////////
    ////CLEAR ALL CHILDREN
    //////////////////
    Spektral.clearAllChildren = function (parent) {
        parent.innerHTML = '';
    }

    //***STYLE************************************************************

    //////////////////
    ////SET STYLE
    //////////////////
    Spektral.setStyle = function (element, prop) {
        var pType = Spektral.getType(prop), propString = "", i;
        if(pType === "string") {
            propString = prop;
        } else if (pType === "array") {
            for (i = 0; i < prop.length; i += 1) {
                if (i !== prop.length - 1) {
                    propString += prop[i] + "; ";
                } else {
                    //The extra space at the end causes a problem, so we'll have to remove it
                    propString += prop[i] + ";";
                }
            }
        } else {
            Spektral.throwError("setStyle: Property must be a string or array.")
        }
        Spektral.createSetAttribute(element, "style", propString);
    };

    //////////////////
    ////GET STYLE
    //////////////////
    Spektral.getStyle = function (element, styleProperty) {

        styleProperty = styleProperty || undefined;
        var style;
        if(styleProperty !== undefined) {
            try {
                style = element.currentStyle[styleProperty];
            } catch (err) {
                style = document.defaultView.getComputedStyle(element, null).getPropertyValue(styleProperty);
            }
        } else {
            try {
                style =  Spektral.getInlineStyle(element);
            } catch (err) {
                Spektral.throwError("getStyle: Could not get style.")
            }
        }
        return style;
    };

    //////////////////
    ////APPEND STYLE
    //////////////////
    Spektral.appendStyle = function (element, styleProperty) {

        var
            currentStyle = Spektral.getInlineStyle(element),
            styleString = "",
            key,
            propertyExists = false,
            newStyle,
            stringCheck = Spektral.detectCharacter(styleProperty, ";");

        //stringCheck is for if the user attempts to append multiple properties at the same time
        if(stringCheck === true) {
            Spektral.throwError("appendStyle: Sorry, for now you can only append one value at a time. Don't include ; in your string.");
        }

        if(currentStyle === false) {
            styleString += styleProperty + "; ";
        } else {
            newStyle = Spektral.splitString(styleProperty, ":")

            for (key in currentStyle) {
                if (key === newStyle[0]) {
                    //Value already exists, so we'll just change it
                    propertyExists = true;
                    styleString += key + ":" + newStyle[1] + "; ";
                    //Spektral.log("Attribute already exists, changing value!");
                } else {
                    //We'll just build the string and add the new style value at the end.
                    styleString += key + ":" + currentStyle[key] + "; ";
                }
            }

            if(propertyExists === false) {
                styleString += styleProperty + "; ";
            }
        }
        Spektral.setStyle(element, styleString);
    };

    //////////////////
    ////CLEAR STYLE - clears all styling of element
    //////////////////
    Spektral.clearStyle = function (element) {
        Spektral.destroyAttribute(element, "style");
    };

    //////////////////
    ////GET INLINE STYLE
    //////////////////
    Spektral.getInlineStyle = function (element) {

        var
            inlineStyle = element.style.cssText,
            properties,
            property, key, val, i,
            styleObject = {};

        if(inlineStyle === "") {
            styleObject = false;
            //Spektral.log("getInlineStyle: No inline style set.");
        } else {
            properties = Spektral.splitString(inlineStyle, ";");

            for (i = 0; i < properties.length; i += 1) {
                property = Spektral.splitString(properties[i], ":");
                key = property[0];
                val = property[1];
                styleObject[key] = val;
            }
        }

        return styleObject;
    };

    //////////////////
    ////CONVERT TO CAMEL
    //////////////////
    Spektral.convertToCamel = function (request, char) {

        char = char || "-";
        var splitRequest = Spektral.splitString(request, char), newString, stringToConvert, i;
        newString = splitRequest[0];
        for (i = 0; i < splitRequest.length; i += 1) {
            if (i !== 0) {
                stringToConvert = splitRequest[i].charAt(0).toUpperCase() + splitRequest[i].slice(1);
                newString += stringToConvert;
            }
        }
        return newString;
    };

    //***ATTRIBUTES************************************************************

    ///////////////////
    ////CREATE SET ATTRIBUTE - check if this works on existing attributes
    //////////////////
    Spektral.createSetAttribute = function (element, attribute, value) {

        element.setAttribute(attribute, value);
    };

    //////////////////
    ////RETRIEVE ATTRIBUTE
    //////////////////
    Spektral.retrieveAttribute = function (element, attribute) {

        var attr, nodeAttrs;
        attr = element.getAttribute(attribute);
        //maybe if this fails do a manual check?
        //Spektral.log(attribute);
        if(attr === null) {
            nodeAttrs = Spektral.getNodeAttributes(element);
            attr = nodeAttrs[attribute];
            if (attr === undefined) {
                attr = null;
                Spektral.throwError("retrieveAttribute: Attribute does not exist. Are you calling its name correctly?");
            }
        }
        return attr;
    };

    //////////////////
    ////DESTROY ATTRIBUTE
    //////////////////
    Spektral.destroyAttribute = function (element, attribute) {

        if(element.hasAttribute(attribute)) {
            element.removeAttribute(attribute);
            if(element.getAttribute(attribute) !== null) {
                Spektral.throwError("destroyElement: Attribute was unable to be removed for some reason.")
            } else {
                //Spektral.log("Attribute destroyed.");
            }
        }
    };

    ////////////////////
    ////GET TEXT CONTENT
    ///////////////////
    Spektral.getTextContent = function (element) {

        var content = element.textContent;
        if (content === "undefined") {
            content = element.innerText;
        }
        return content;
    };

    //////////////////////
    ////GET NODE ATTRIBUTES - possible duplicate of listNodeAttributes - might want to merge
    //////////////////////
    Spektral.getNodeAttributes = function (element) {
        var attributes = element.attributes, attrObj = {}, i;
        //Spektral.listArrayElements(attributes);
        if (attributes.length >= 1) {
            for (i = 0; i < attributes.length; i += 1) {
                //Spektral.log("getNodeAttributes: name: " + attributes.item(i).name + " nodeName: " + attributes.item(i).nodeName);
                attrObj[attributes.item(i).nodeName] = attributes.item(i).value;//attributes.item(i).name
            }
        }
        return attrObj;
    };

    //////////////////
    ////CHECK FOR ATTRIBUTE - check if an element has a particular attribute
    //////////////////
    Spektral.checkForAttribute = function (element, attribute) {

    };

    //////////////////
    ////SHOW ELEMENT
    //////////////////
    Spektral.showElement = function (element, displayType) {

        displayType = displayType || "block";

        var
            currentVState = Spektral.getStyle(element, "visibility"),
            currentDState = Spektral.getStyle(element, "display"),
            displayString = "display:" + displayType;

        if (currentVState === "visible" && currentDState !== "none") {
            //Element is already seen, don't do anything
            //Spektral.log(element + " is already visible.")
        } else {
            Spektral.appendStyle(element, displayString);
            Spektral.appendStyle(element, "visibility:visible");
        }
    };

    //////////////////
    ////HIDE ELEMENT
    //////////////////
    Spektral.hideElement = function (element, useDisplay) {

        useDisplay = useDisplay || false;

        var
            currentVState = Spektral.getStyle(element, "visibility"),
            currentDState = Spektral.getStyle(element, "display");

        if(currentVState === "hidden" || currentDState === "none") {
            ////Spektral.log(element + " is already hidden.")
        } else {
            if(useDisplay === true) {
                //set display to none
                Spektral.appendStyle(element, "display:none");
            } else {
                //set visibility to hidden
                Spektral.appendStyle(element, "visibility:hidden");
            }
        }
    };

    //////////////////
    ////TOGGLE VISIBILITY
    //////////////////
    Spektral.toggleVisibility = function (element) {

        var
            currentVState = Spektral.getStyle(element, "visibility"),
            currentDState = Spektral.getStyle(element, "display");
        if(currentDState === "none") {
            //element is hidden
            Spektral.toggleDisplay(element);//Issue: what if the previous display state was not block?
        } else {
            if(currentVState === "visible") {
                Spektral.appendStyle(element, "visibility:hidden");
                //Spektral.log("Visible, hiding.");
            } else {
                Spektral.appendStyle(element, "visibility:visible");
                //Spektral.log("Hidden, showing.");
            }
        }
    };

    //////////////////
    ////TOGGLE DISPLAY
    //////////////////
    Spektral.toggleDisplay = function (element, displayType) {

        displayType = displayType || "block";

        var
            currentDState = Spektral.getStyle(element, "display"),
            displayString = "display:" + displayType,
            currentVState = Spektral.getStyle(element, "visibility");

        if(currentVState === "hidden") {
            //element is already hidden
            Spektral.toggleVisibility(element);
        } else {

            if(currentDState === "block" || currentDState === "inline" || currentDState === "inline-block" || currentDState === "inherit") {
                Spektral.appendStyle(element, "display:none");
                //Spektral.log("toggleDisplay: Visible, hiding.");
            } else {
                Spektral.appendStyle(element, displayString);
                //Spektral.log("toggleDisplay: Hiding, showing: " + displayString);
            }
        }
    };

    //////////////////////
    ////LIST NODE ATTRIBUTES
    //////////////////////
    Spektral.listNodeAttributes = function (node) {
        var nodeArray = [], key;
        for (key in node) {
            if (node.hasOwnProperty(key)) {
                nodeArray.push(key);
                //Spektral.log("Node: " + node.nodeName + " Attribute: " + key);
            }
        }
        return nodeArray;
    };

    //***UTILS***********************************************************

    /////////////////////
    ////ROUND NUM
    ////////////////////
    Spektral.roundNum = function (num, type) {
        type = type || "regular";
        var roundedNum = 0;
        if (type === "regular") {
            roundedNum = Math.round(num);
        } else if (type === "up") {
            roundedNum = Math.ceil(num)
        } else if (type === "down") {
            roundedNum = Math.floor(num);
        }
        return roundedNum;
    };

    /////////////////////
    ////GET POS
    ////////////////////
    Spektral.getPos = function (element) {
        var pos = {}, el;
        el = element.getBoundingClientRect();
        pos["x"] = el.left;
        pos["y"] = el.top;
        
        pos["left"] = el.left;
        pos["top"] = el.top;
        pos["right"] = el.right;
        pos["bottom"] = el.bottom;
        return pos;
    };

    /////////////////////
    ////IS OBJECT EMPTY
    ////////////////////
    Spektral.isObjectEmpty = function (obj) {

        //Check this, not sure if working properly
        var key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    };

    //////////////////
    ////DETECT CHARACTER
    //////////////////
    Spektral.detectCharacter = function (request, character) {
        var detected = false, test = request.match(character);
        if(test !== null) {
            detected = true;
        }
        return detected;
    };

    ///////////////////
    ////GET INFO 
    ///////////////////
    Spektral.getInfo = function (obj) {
        var info;
        try {
            info = JSON.stringify(obj);
        } catch (err) {}

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
    Spektral.convertCase = function (request, newCase) {
        newCase = newCase || "lower";
        var newString;
        if (newCase === "lower") {
            newString = request.toLowerCase();
        } else if (newCase === "upper") {
            newString =  request.toUpperCase();
        }
        return newString;
    };

    //////////////////
    ////SPLIT STRING
    //////////////////
    Spektral.splitString = function (request, character) {

        var splitArray = [], split = request.split(character), i, detectCharacter = Spektral.detectCharacter(request, character), stripped;

        if(detectCharacter === false) {
            Spektral.throwError("splitString: Could not split string because character [" + character + "] was not in string.")
        }
        for (i = 0; i < split.length; i += 1) {
            if(split[i] !== "") {
                stripped = Spektral.stripWhiteSpace(split[i]);
                splitArray.push(stripped);
            }
        }
        return splitArray;
    };

    //////////////////
    ////STRIP STRING
    //////////////////
    Spektral.stripString = function (request, chars) {
        return request.replace(chars, '');
    }


    //////////////////
    ////STRIP WHITE SPACE
    //////////////////
    Spektral.stripWhiteSpace = function (request, removeAll) {
        removeAll = removeAll || false;
        var newString;
        if(removeAll !== false) {
            newString = request.replace(/\s+/g, '');
        } else {
            newString = request.replace(/(^\s+|\s+$)/g,'');
        }
        return newString;
    };

    ////////////////////
    ////LIST ELEMENTS
    ////////////////////
    Spektral.listElements = function (attribute) {

        attribute = attribute || null;

        var all = document.getElementsByTagName("*"), elementArray = [], node, i;

        for (i = 0; i < all.length; i += 1) {
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

        if (type !== 'array' && type !== 'nodelist' && type !== "namednodemap") {
            Spektral.throwError("listArrayElements: You must pass either an array or nodelist to this function.")
        } else {
            for (i = 0; i < array.length; i += 1) {
                if (type === 'nodelist') {
                    Spektral.log("NodeList: listArrayElement: item" + i + ": " + array[i].nodeName);
                } else if (type === 'array') {
                    Spektral.log("Array: listArrayElement: item" + i + ": " + array[i]);
                } else if (type === "namednodemap") {
                    Spektral.log("NamedNodeMap: listArrayElement: item" + i + ": " + array[i].nodeName);
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
//        for (i = 0; i < children.length; i += 1) {
//            Spektral.log("Child: " + children[i]);
//        }
        Spektral.log("children: " + Spektral.getInfo(children));
    };

    //////////////////
    ////GET CHILD NODES
    /////////////////
    Spektral.getChildNodes = function (parent) {
        var children = parent.childNodes, childArr = [], i, isElement;
        for (i = 0; i < children.length; i += 1) {
            isElement = Spektral.isElement(children[i]);
            if(isElement === true) {
                childArr.push(children[i]);
            }
        }
        return childArr;
    }

    //////////////////
    ////IS ELEMENT
    /////////////////
    Spektral.isElement = function (possibleElement) {
        var isAnElement = false, type = possibleElement.nodeType;
        if(type === 1) {
            isAnElement = true;
        }
        return isAnElement;
    }

    //////////////////
    ////GET ELEMENT IDENTIFIERS - lists any elements tag name, along with id, name, class if available
    /////////////////
    Spektral.getElementIdentifiers = function (element) {

        var identifiers = {}, nn;

        nn = element.nodeName;

        identifiers["id"] = element.id;
        identifiers["name"] = element.name;
        identifiers["class"] = element.className;
        identifiers["nodeName"] = Spektral.convertCase(nn);

        //Spektral.log("Identifiers for: " + element + " : " + Spektral.getInfo(identifiers));
        return identifiers;
    };

    ////////////////////
    ////GET TYPE - Maybe if obj is id'd as an element return node name in lower case
    ////////////////////
    Spektral.getType = function (obj) {
        var type;
        if(obj.nodeName !== undefined) {
            //element
            type = (obj.nodeName);
        } else {
            //everything else
            type = ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1]
        }
        type = type.toLowerCase();
        return type;
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
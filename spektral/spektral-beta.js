/**
 * Spektraljs
 *
 * Copyright (c) 2013 - 2014 spektraldevelopment.com, David Boyle.
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
        docBody = document.body,
        debug = false,
        strictError = false,
        mouseEvents = ["click", "dblclick", "mousedown", "mousemove", "mouseup", "mouseover", "mouseout"],
        consoleLog = new Array();

    //////////////////
    ////DEBUG
    /////////////////
    Spektral.debug = function (useError) {

        strictError = useError || false;
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
        message = "Spektral-beta.js: mode: " + mode;
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

    //////////////////
    ////HAS EVENT LISTENER
    //////////////////
    //Spektral.hasEventListener = function (target, evt) {

        //My understanding is the only way to do this is by
        //storing all event attachments in an object and 
        //checking that object for pre-existing events
        //that have already been attached

        //Not sure if this is worth it
    //};

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
    Spektral.createEvent = function (eventName, detail, bub, can) {

        detail = detail || null;
        bub = bub || true;
        can = can || true;

        var evt;

        evt = new CustomEvent(eventName, { detail: detail, bubbles: bub, cancelable: can });

        if(evt === undefined) {
            Spektral.log("createEvent: CustomEvent not available. Using Event instead.")
            evt = new Event(eventName);
        }

        return evt;
    };

    //////////////////
    ////TRIGGER EVENT
    //////////////////
    Spektral.triggerEvent = function (obj, evt) {

        var 
            theEvent = evt, newEvent,
            evtType = Spektral.getType(theEvent);
        //Spektral.log("triggerEvent: evt: " + evtType);

        if(evtType === "event" || evtType === "customevent") {
            obj.dispatchEvent(theEvent);
        } else if (evtType === "string") {
            //Spektral.log("evt is a string. Will handle.");
            newEvent = Spektral.createEvent(theEvent);
            obj.dispatchEvent(newEvent);
        }
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
    Spektral.getTargetID = function (obj) {
        var targetID, type = Spektral.getType(obj), element = Spektral.isElement(obj); 
        if (element === true) {
            targetID = obj.id;
        } else {
            targetID = obj.target.id;
        }
        return targetID;
    }

    ///////////////////
    ///GET PARENT
    ///////////////////
    Spektral.getParent = function (element) {
        return element.parentNode;
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
    ///GET MOUSE POS - OLD
    ///////////////////
    // Spektral.getMousePos = function (evt) {

    //     if (evt === undefined) {
    //         Spektral.throwError("getMousePos: Event is undefined. If not targeting a specific element, use [window].");
    //     }

    //     var 
    //         mouse = {}, x = 0, y = 0, 
    //         offsetX = 0, offsetY = 0, 
    //         mouseX = 0, mouseY = 0, 
    //         target = Spektral.getTarget(evt), 
    //         targetX = Spektral.getPos(target).x, 
    //         targetY = Spektral.getPos(target).y,
    //         cY = evt.clientY,
    //         docElem = document.documentElement;

    //     // if event object has pageX property
    //     // get position using pageX, pageY
    //     if (evt.pageX) {

    //         x = evt.pageX;
    //         y = evt.pageY;
    //         //Spektral.log("PageX/Y available.");
    //     } else if (evt.clientX) {
                
    //         // if documentElement.scrollLeft supported
    //         if (docElem.scrollLeft) {

    //             offsetX = docElem.scrollLeft;
    //             offsetY = docElem.scrollTop;
    //         } else if (document.body) {

    //             offsetX = document.body.scrollLeft;
    //             offsetY = document.body.scrollTop;
    //         }

    //         x = evt.clientX + offsetX;
    //         y = evt.clientY + offsetY;  
    //         //Spektral.log("ClientX/Y available.");
    //     } else {
    //         Spektral.throwError("getMousePos: pageX/Y and clientX/Y could not be found.");
    //     }

    //     mouse["x"] = Spektral.roundNum(x);
    //     mouse["y"] = Spektral.roundNum(y);
    //     mouse["mouseX"] = Spektral.roundNum(x - targetX);
    //     mouse["mouseY"] = Spektral.roundNum(cY - targetY);//Appears to work, but try on inline elements to be sure.

    //     return mouse;
    // };

    ///////////////////
    ///GET MOUSE POS 
    ///////////////////
    Spektral.getMousePos = function (evt) {

        var 
            mousePos = {}, 
            target = Spektral.getTarget(evt), 
            targetX = Spektral.getPos(target).elX, 
            targetY = Spektral.getPos(target).elY,
            pageX = evt.pageX, pageY = evt.pageY,
            screenX = evt.screenX, screenY = evt.screenY,
            clientX = evt.clientX, clientY = evt.clientY,
            offsetX, offsetY,
            docElem = document.documentElement;

        // if documentElement.scrollLeft supported
        if (docElem.scrollLeft) {

            offsetX = docElem.scrollLeft;
            offsetY = docElem.scrollTop;
        } else if (document.body) {

            offsetX = document.body.scrollLeft;
            offsetY = document.body.scrollTop;
        }

        //pageX/Y = documentX/Y
        //screenX/Y = screenX/Y
        //clientX/Y = viewportX/Y

        mousePos["innerX"] = Spektral.roundNum(clientX - targetX);
        mousePos["innerY"] = Spektral.roundNum(clientY - targetY);

        mousePos["pageX"] = Spektral.roundNum(pageX);
        mousePos["pageY"] = Spektral.roundNum(pageY);

        mousePos["screenX"] = Spektral.roundNum(screenX);
        mousePos["screenY"] = Spektral.roundNum(screenY);

        mousePos["viewportX"] = Spektral.roundNum(clientX);
        mousePos["viewportY"] = Spektral.roundNum(clientY);

        mousePos["offsetX"] = Spektral.roundNum(offsetX);
        mousePos["offsetY"] = Spektral.roundNum(offsetY);

        return mousePos;
    };

    ///////////////////
    ////GET VIEWPORT SIZE
    ///////////////////
    Spektral.getViewportSize = function () {
        var w, h, vPort = {};
        //Width
        if (window.innerWidth) {
            w = window.innerWidth;
        } else if (document.body && document.body.offsetWidth) {
            w = document.body.offsetWidth;
        } else {
            w = null;
        }
        //Height
        if (window.innerHeight) {
            h = window.innerHeight;
        } else if (document.body && document.body.offsetHeight) {
            h = document.body.offsetHeight;
        } else {
            h = null;
        }

        vPort["width"] = w;
        vPort["height"] = h;

        return vPort;
    };

    ///////////////////
    ////IS MATCH
    ///////////////////
    Spektral.isMatch = function (itemA, itemB, useType) {

        useType = useType || false;

        var 
            isMatch = false,
            itemAType = Spektral.getType(itemA),
            itemBType = Spektral.getType(itemB);
        if(useType === true) {
            if(itemAType === itemBType) {
                isMatch = true;
            }
        } else {
            if (itemA === itemB) {
                isMatch = true;
            }
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
            //Spektral.throwError("loadJSON: Invalid source type: " + sourceType + ". Source must be string or external json file.");
            Spektral.log("loadJSON: Invalid source type: " + sourceType + ". Source must be string or external json file.", "warn")
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
            //Spektral.throwError("loadXML: Invalid source type: " + sourceType + ". Source must be string or external json file.");
            Spektral.log("loadXML: Invalid source type: " + sourceType + ". Source must be string or external json file.", "warn");
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
            //Spektral.throwError("loadError: There was a load error: " + e);
            Spektral.log("loadFile: loadError: There was a load error: " + e, "warn");
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
                } catch (err) { 
                    //Spektral.throwError("loadFile: Couldn't find the proper XMLHttp version."); 
                    Spektral.log("getXHR: Couldn't find the proper XMLHttp version.", "warn");
                }
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

        var 
            parentNode = xml.getElementsByTagName(node)[index], 
            child, type, xmlObject = {};

        for (child = parentNode.firstChild; child !== null; child = child.nextSibling) {
            type = Spektral.getType(child);

            if (type === "text") {
                //CDATA and Text
                //nodeArray.push(child.nodeValue);//Remember to code this to handle if the main node has textContent
                //Spektral.log("Going to handle text in here someday.");
            } else if (type === "element") {
                xmlObject[child.tagName] = Spektral.createArray(child.childNodes);
            }
        }

        return xmlObject;
    };

    /////////////////////////
    ////CREATE ARRAY
    ///////////////////////////
    Spektral.createArray = function (list) {

        var 
            child, type, listArray = [], 
            listObject, attributes, attrLength, 
            hasChildren, length, i, j;

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
                    listObject[child.tagName] = Spektral.createArray(child.childNodes);
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
    ////GET ELEMENT BY CLASS
    //////////////////
    Spektral.getElementByClass = function (className, index) {
        var 
            el, elLength, 
            elList = Spektral.getAllElements("class"), i, j, k,
            potentialMatch, checkForSpace, multiClasses, nameArray = [];

        //Cycle through elList to search for multiple classes and separate them
        for (i = 0; i < elList.length; i += 1) {
            potentialMatch = elList[i];

            checkForSpace = Spektral.checkForWhiteSpace(potentialMatch);

            if(checkForSpace === true) {
                //Multiple classes in use.
                //Using split string to separate them by their white space.
                multiClasses = Spektral.splitString(potentialMatch, " ");

                for (j = 0; j < multiClasses.length; j += 1) {
                    nameArray.push(multiClasses[j]);
                }
            } else {
                nameArray.push(potentialMatch);
            }
        }

        //Cycle through name array, searching for a match
        for (k = 0; k < nameArray.length; k += 1) {
            if(className === nameArray[k]) {
                //A match has been found
                if(index === undefined) {
                    el = document.getElementsByClassName(className);

                    elLength = el.length;
                    if(elLength === 1) {
                        return el[0];
                    } else {
                        return el;
                    }
                } else {
                    el = document.getElementsByClassName(className)[index];
                    return el;
                }
            }
        }
    };

    //////////////////
    ////GET ELEMENT - might rename to "findElement"
    //////////////////
    Spektral.getElement = function (element, index) {

        //Spektral.log("getElement: element: " + Spektral.getType(element));

        var 
            isHTML = Spektral.isHTMLElement(element), 
            isID = Spektral.isHTMLID(element),
            isName = Spektral.isHTMLName(element), 
            el, elType, nList;
            
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
            //Spektral.log(element + " tried query.", "warn");
            if(el === undefined) {
                //Try finding element by its class
                el = Spektral.getElementByClass(element);
                //Spektral.log(element + " tried getElementByClass.", "warn");
                if (el === undefined) {
                    Spektral.log("getElement: " + element + " Not Found. Ensure you are calling an existing element.", "warn");
                }
            }
        }
        elType = Spektral.getType(el);
        if (elType === "nodelist") {
            //Spektral.log("getElement: More than one element was found: " + element, "warn");
            //Spektral.listArrayObjects(el);
        }
        return el;
    };

    //////////////////
    ////IS HTML ELEMENT
    //////////////////
    Spektral.isHTMLElement = function (element) {
        var 
            list = Spektral.getAllElements(), 
            isHTML = false, i;

        for (i = 0; i < list.length; i++) {

            if (element === list[i]) {
                isHTML = true;
                return isHTML;
            }
        }
        return isHTML;
    };

    //////////////////
    ////IS HTML ID
    //////////////////
    Spektral.isHTMLID = function (ID) {
        var 
            list = Spektral.getAllElements("id"), 
            isID = false, i;
        
        for (i = 0; i < list.length; i++) {
            if (ID === list[i]) {
                isID = true;
                return isID;
            }
        }
        return isID;
    };

    //////////////////
    ////IS HTML NAME
    //////////////////
    Spektral.isHTMLName = function (name) {
        var 
            list = Spektral.getAllElements("name"), 
            isName = false, i;

        for (i = 0; i < list.length; i++) {
            if (name === list[i]) {
                isName = true;
                return isName;
            }
        }
        return isName;
    };

    //////////////////
    ////IS HTML CLASS - not in use
    //////////////////
    // Spektral.isHTMLClass = function (className) {
    //     //I will have to create a method that can retrieve a node with a class name 
    //     //that's cross compatible
    //     var 
    //         list = Spektral.getAllElements("class"), 
    //         isClass = null, i;
    //         // if(cl === "geTestTwo") {
    //         //     Spektral.listArrayObjects(list);
    //         // }
    //     for (i = 0; i < list.length; i++) {
    //         if (className === list[i]) {
    //             isClass = true;
    //             break;
    //         }
    //     }
    //     if (isClass === null) {
    //         isClass = false;
    //     }
    //     return isClass;
    // };

    //////////////////
    ////CREATE ELEMENT
    //////////////////
    Spektral.createNewElement = function (element, parent, id) {

        var 
            newElementID, parentNode, 
            newElement, body = Spektral.getElement("body"), 
            errorString;

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
                //Spektral.throwError(errorString);
                Spektral.log("createNewElement: " + errorString);
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
            //Spektral.throwError("setStyle: Property must be a string or array.")
            Spektral.log("setStyle: Property must be a string or array.", "warn");
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
                //Spektral.throwError("getStyle: Could not get style.")
                Spektral.log("getStyle: Could not get style.", "warn");
            }
        }

        return style;
    };

    //////////////////
    ////GET CSS STYLE
    //////////////////
    Spektral.getCSSStyle = function(element, property) {
        
        property = property || null;
        var style;
        if (property === null) {
            style = document.defaultView.getComputedStyle(element, null);
        } else {
            style = document.defaultView.getComputedStyle(element, null).getPropertyValue(property);
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
            //Spektral.throwError("appendStyle: Sorry, for now you can only append one value at a time. Don't include ; in your string.");
            Spektral.log("appendStyle: Sorry, for now you can only append one value at a time. Don't include ; in your string.", "warn");
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
    ////CREATE SET ATTRIBUTE
    //////////////////
    Spektral.createSetAttribute = function (element, attribute, value) {

        element.setAttribute(attribute, value);
    };

    //////////////////
    ////RETRIEVE ATTRIBUTE
    //////////////////
    Spektral.getAttributeValue = function (element, attribute) {

        var attr, nodeAttrs;
        attr = element.getAttribute(attribute);
        //maybe if this fails do a manual check?
        //Spektral.log(attribute);
        if(attr === null) {
            nodeAttrs = Spektral.getNodeAttributes(element);
            attr = nodeAttrs[attribute];
            if (attr === undefined) {
                attr = null;
                //Spektral.throwError("getAttributeValue: Attribute does not exist. Are you calling its name correctly?");
                Spektral.log("getAttributeValue: Attribute does not exist. Are you calling its name correctly?", "warn");
            }
        }
        return attr;
    };

    //////////////////
    ////DESTROY ATTRIBUTE
    //////////////////
    Spektral.destroyAttribute = function (element, attribute) {

        if (element.hasAttribute(attribute)) {
            element.removeAttribute(attribute);
            if(element.getAttribute(attribute) !== null) {
                //Spektral.throwError("destroyElement: Attribute was unable to be removed for some reason.")
                Spektral.log("destroyAttribute: Attribute was unable to be removed for some reason.", "warn");
            } else {
                //Spektral.log("Attribute destroyed.");
            }
        }
    };

    ////////////////////
    ////GET INNER TEXT
    ///////////////////
    Spektral.getInnerText = function (element) {

        var 
            content = element.textContent,
            ids = Spektral.getElementIdentifiers(element);
        if (content === "undefined") {
            content = element.innerText;
        }

        if(content === "") {
            // Spektral.log("getInnerText: " + Spektral.getInfo(ids) + " ids.name: " + ids.name);
            // if(ids.id !== undefined) {
            //     Spektral.log("getInnerText: " + ids.id + " is empty.", "warn");
            // } else if (ids.class !== undefined) {
            //     Spektral.log("getInnerText: " + ids.class + " is empty.", "warn");
            // } else if (ids.name !== undefined) {
            //     Spektral.log("getInnerText: " + ids.name + " is empty.", "warn");
            // } else {
            //     Spektral.log("getInnerText: " + ids.nodeName + " is empty.", "warn");
            // }
        }

        return content;
    };

    ////////////////////
    ////SET INNER TEXT
    ///////////////////
    Spektral.setInnerText = function (element, textContent, append) {

        append = append || false;

        var 
            currentContent = Spektral.getInnerText(element),
            newContent;

        if(append === true) {
            newContent = currentContent + textContent;
            element.innerHTML = newContent;
        } else {
            element.innerHTML = textContent;
        }
    };

    //////////////////////
    ////GET NODE ATTRIBUTES - possible duplicate of listNodeAttributes - might want to merge
    //////////////////////
    Spektral.getNodeAttributes = function (element) {
        var attributes = element.attributes, attrObj = {}, i;
        //Spektral.listArrayObjects(attributes);
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
        var exists = false;
        if(element.getAttribute(attribute) !== null) {
            exists = true;
        }
        return exists;
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
    ////MATCH HEIGHT
    //////////////////////
    Spektral.matchHeight = function(reference, target, type) {

        type = type || "normal";

        var refDim = Spektral.getDimensions(reference), refHeight,
            targetDim = Spektral.getDimensions(target);
        if(type === "normal") {
            refHeight = refDim.height;
        } else if (type === "inner") {
            refHeight = refDim.innerHeight;
        } else if (type === "total") {
            refHeight = refDim.totalHeight;
        }
        Spektral.setStyle(target, "height:" + refHeight + "px");
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
    ////STRING TO NUM
    ////////////////////
    Spektral.stringToNum = function(str) {
        var num = parseInt(str, 10);
        return num;
    };

    /////////////////////
    ////GET POS
    ////////////////////
    Spektral.getPos = function (element, rel) {

        rel = rel || true;

        var 
            pos = {}, 
            viewport = Spektral.getViewportSize(),
            parent = Spektral.getParent(element),
            par = parent.getBoundingClientRect(),
            el = element.getBoundingClientRect(),
            elDim = Spektral.getDimensions(element),
            left, top, right, bottom, 
            dLeft, dTop, dRight, dBottom,
            elTop, elRight, elBottom, elLeft,
            viewWidth = viewport.width,
            viewHeight = viewport.height;

            //Position relative to parent
            top = (el.top - par.top);
            right = (par.right - el.right);
            bottom = (par.bottom - el.bottom);
            left = (el.left - par.left);

            //The properties returned from getBoundingClientRect
            elTop = el.top;
            elRight = el.right;
            elBottom = el.bottom;
            elLeft = el.left;

            //position relative to document
            dTop = el.top;
            dRight = (viewWidth - el.right);
            dBottom = (viewHeight - el.bottom);
            dLeft = el.left;

        //Spektral.log("getPos top: " + top + " right: " + right + " bottom: " + bottom + " left: " + left);    

        //Relative to parent
        pos["x"] = left;
        pos["y"] = top;

        pos["top"] = top;
        pos["right"] = right;
        pos["bottom"] = bottom;
        pos["left"] = left;

        //getBoundingClientRect
        pos["elX"] = elLeft;
        pos["elY"] = elTop;

        pos["elTop"] = elTop;
        pos["elRight"] = elRight;
        pos["elBottom"] = elBottom;
        pos["elLeft"] = elLeft;

        //Relative to document
        pos["dX"] = dLeft;
        pos["dY"] = dTop;

        pos["dTop"] = dTop;
        pos["dRight"] = dRight;
        pos["dBottom"] = dBottom;
        pos["dLeft"] = dLeft;

        return pos;
    };

    // Spektral.getPos = function (element, rel) {

    //     rel = rel || true;

    //     var 
    //         pos = {}, 
    //         parent = Spektral.getParent(element),
    //         el = element.getBoundingClientRect(),
    //         par = parent.getBoundingClientRect(),
    //         left, top, right, bottom, 
    //         relLeft, relTop, relRight, relBottom;

    //         //Position relative to parent
    //         relTop = (el.top - par.top);
    //         relRight = (par.right - el.right);
    //         relBottom = (par.bottom - el.bottom);
    //         relLeft = (el.left - par.left);

    //         //position relative to viewport
    //         top = el.top;
    //         right = el.right;
    //         bottom = el.bottom;
    //         left = el.left;

    //     //Spektral.log("getPos top: " + top + " right: " + right + " bottom: " + bottom + " left: " + left);    

    //     pos["x"] = left;
    //     pos["y"] = top;
    //     pos["relX"] = relLeft;
    //     pos["relY"] = relTop;
        
    //     pos["top"] = top;
    //     pos["right"] = right;
    //     pos["bottom"] = bottom;
    //     pos["left"] = left;

    //     pos["relTop"] = relTop;
    //     pos["relRight"] = relRight;
    //     pos["relBottom"] = relBottom;
    //     pos["relLeft"] = relLeft;

    //     return pos;
    // };

    /////////////////////
    ////GET DIMENSIONS
    ////////////////////
    Spektral.getDimensions = function (element) {

        var 
            dimensions = {},
            width = Spektral.getStyle(element, "width"),
            height = Spektral.getStyle(element, "height"),

            padding = Spektral.getStyle(element, "padding"),
            paddingTop = Spektral.getStyle(element, "padding-top"),
            paddingRight = Spektral.getStyle(element, "padding-right"),
            paddingBottom = Spektral.getStyle(element, "padding-bottom"),
            paddingLeft = Spektral.getStyle(element, "padding-left"),

            border = Spektral.getStyle(element, "border"),
            borderTop = Spektral.getStyle(element, "border-top-width"),
            borderRight = Spektral.getStyle(element, "border-right-width"),
            borderBottom = Spektral.getStyle(element, "border-bottom-width"),
            borderLeft = Spektral.getStyle(element, "border-left-width"),

            margin = Spektral.getStyle(element, "margin"),
            marginTop = Spektral.getStyle(element, "margin-top"),
            marginRight = Spektral.getStyle(element, "margin-right"),
            marginBottom = Spektral.getStyle(element, "margin-bottom"),
            marginLeft = Spektral.getStyle(element, "margin-left"),
            innerWidth, innerHeight,
            borderWidth, borderHeight,
            totalWidth, totalHeight,
            paddingCheck, marginCheck, borderCheck;

        //width/height = width/height of element itself, no border/padding/margin    
        dimensions["width"] = Spektral.stringToNum(width);
        dimensions["height"] = Spektral.stringToNum(height);

        //innerWidth/innerHeight = element width/height + padding
        innerWidth = Spektral.stringToNum(paddingLeft) + 
        Spektral.stringToNum(width) + 
        Spektral.stringToNum(paddingRight);

        dimensions["innerWidth"] = innerWidth;

        innerHeight = Spektral.stringToNum(paddingTop) + 
        Spektral.stringToNum(height) +
        Spektral.stringToNum(paddingBottom);

        dimensions["innerHeight"] = innerHeight;

        //borderWidth/borderHeight - returns border + padding + width/height
        borderWidth = Spektral.stringToNum(borderLeft) + 
        Spektral.stringToNum(paddingLeft) + 
        Spektral.stringToNum(width) +
        Spektral.stringToNum(paddingRight) +
        Spektral.stringToNum(borderRight);

        dimensions["borderWidth"] = borderWidth;

        borderHeight = Spektral.stringToNum(borderTop) +
        Spektral.stringToNum(paddingTop) +
        Spektral.stringToNum(height) +
        Spektral.stringToNum(paddingBottom) + 
        Spektral.stringToNum(borderBottom);

        dimensions["borderHeight"] = borderHeight;

        //Padding
        //Check if padding has muliple values
        paddingCheck = Spektral.hasPattern(padding, "px").match;

        if (paddingCheck === false) {
            //Ex. padding: 10px;
            dimensions["padding"] = Spektral.stringToNum(padding);
        } else {
            //Ex. padding: 10px 5px;
            dimensions["padding"] = padding;
        }

        dimensions["paddingTop"] = Spektral.stringToNum(paddingTop);
        dimensions["paddingRight"] = Spektral.stringToNum(paddingRight);
        dimensions["paddingBottom"] = Spektral.stringToNum(paddingBottom);
        dimensions["paddingLeft"] = Spektral.stringToNum(paddingLeft);

        //Border
        //If border shorthand isn't being used. ex. border: 1px solid blue
        //Then border returns nothing

        borderCheck = Spektral.hasPattern(border, "px").match;

        if(borderCheck === true) {
            dimensions["border"] = border;
        }


    
        dimensions["borderTop"] = Spektral.stringToNum(borderTop);
        dimensions["borderRight"] = Spektral.stringToNum(borderRight);
        dimensions["borderBottom"] = Spektral.stringToNum(borderBottom);
        dimensions["borderLeft"] = Spektral.stringToNum(borderLeft);
        
        //Margin
        //check if margin has multiple values
        marginCheck = Spektral.hasPattern(margin, "px").match;

        if (marginCheck === false) {
            //Ex. margin: 10px
            dimensions["margin"] = Spektral.stringToNum(margin);
        } else {
            //Ex. margin: 10px 15px 5px
            dimensions["margin"] = margin;
        }

        dimensions["marginTop"] = Spektral.stringToNum(marginTop);
        dimensions["marginRight"] = Spektral.stringToNum(marginRight);
        dimensions["marginBottom"] = Spektral.stringToNum(marginBottom);
        dimensions["marginLeft"] = Spektral.stringToNum(marginLeft);

        //totalWidth/totalHeight = element width/height + padding + border + margin
        totalWidth = Spektral.stringToNum(marginLeft) + 
        Spektral.stringToNum(borderLeft) + 
        Spektral.stringToNum(paddingLeft) + 
        Spektral.stringToNum(width) + 
        Spektral.stringToNum(paddingRight) + 
        Spektral.stringToNum(borderRight) + 
        Spektral.stringToNum(marginRight);
        

        totalHeight = Spektral.stringToNum(marginTop) + 
        Spektral.stringToNum(borderTop) + 
        Spektral.stringToNum(paddingTop) + 
        Spektral.stringToNum(height) + 
        Spektral.stringToNum(paddingBottom) + 
        Spektral.stringToNum(borderBottom) + 
        Spektral.stringToNum(marginBottom);

        dimensions["totalWidth"] = totalWidth;
        dimensions["totalHeight"] = totalHeight;

        return dimensions;
    };

    /////////////////////
    ////GET DOC DIMENSIONS
    ////////////////////
    Spektral.getDocDimensions = function () {

        var docDim = {}, width, height;

        width = Math.max(
            docBody.scrollWidth, 
            docBody.offsetWidth, 
            docElem.clientWidth, 
            docElem.scrollWidth, 
            docElem.offsetWidth 
        );

        height = Math.max(
            docBody.scrollHeight, 
            docBody.offsetHeight, 
            docElem.clientHeight, 
            docElem.scrollHeight, 
            docElem.offsetHeight 
        );

        docDim["width"] = width;
        docDim["height"] = height;

        return docDim;
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

    //////////////////
    ////HAS PATTERN
    //////////////////
    Spektral.hasPattern = function (request, pattern) {

        var 
            regEx = new RegExp(pattern, "g"),
            matches = request.match(regEx),
            hasMatch = false, matchAmount = 0,
            matchObj = {}, i;

        if (matches !== null) {

            hasMatch = true;
            matchAmount = matches.length;
        }

        matchObj["match"] = hasMatch;
        matchObj["amount"] = matchAmount;
        matchObj["matchArray"] = matches;

        return matchObj;
    };

    //////////////////
    ////RETURN RANGE
    //////////////////
    Spektral.returnRange = function (request, startPattern, endPattern) {

    };

    ///////////////////
    ////GET INFO 
    ///////////////////
    Spektral.getInfo = function (obj) {
        var info;
        try {
            info = JSON.stringify(obj);
        } catch (err) {
            Spektral.log("getInfo: could not stringify.", obj, "dir");
        }
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
        } else if (newCase === "first") {
            newString = request.charAt(0).toUpperCase() + request.slice(1);
        }
        return newString;
    };

    //////////////////
    ////SPLIT STRING
    //////////////////
    Spektral.splitString = function (request, character) {

        character = character || ",";

        var 
            splitArray = [], split, 
            i, detectCharacter = Spektral.detectCharacter(request, character), 
            stripped;

        if(detectCharacter === false && character !== " ") {
            //Spektral.throwError("splitString: Could not split string because character [" + character + "] was not in string.");
            Spektral.log("splitString: Could not split string because character [" + character + "] was not in string.", "warn");
        } else {
            if(character !== " ") {
                split = request.split(character);
            } else {
                split = request.split(/[ ,]+/);
            }
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
    ////CHECK FOR WHITE SPACE
    //////////////////
    Spektral.checkForWhiteSpace = function (request) {
        return request.indexOf(' ') >= 0;
    };

    //////////////////
    ////STRIP STRING
    //////////////////
    Spektral.stripString = function (request, character, mode) {

        mode = mode || "all";

        var 
            first = new RegExp(character, ""),
            all = new RegExp(character, "g"),
            newString = "", characterFound = 0, letter, i;

        if(mode === "all") {
            newString = request.replace(all, "");
        } else if (mode === "first") {
            newString = request.replace(first, "");
        } else {
            //Target index
            for(i = 0; i < request.length; i += 1) {

                letter = request[i];

                if(letter === character) {
                    if(characterFound === mode) {
                        letter = letter.replace(character, "");
                    }
                    characterFound ++;
                }
                newString += letter;
            }
        }

        return newString;
    };

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
    ////GET ALL ELEMENTS
    ////////////////////
    Spektral.getAllElements = function (attribute) {

        attribute = attribute || null;

        var 
            all = document.getElementsByTagName("*"),
            elementArray = [], node, i;

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
            } else if (attribute === "class") {
                //Works but if you use multiple classes it doesn't find the class properly
                //In this case getElementByClass should be used.
                node = all[i].className;
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
    Spektral.listArrayObjects = function (array) {

        var type = Spektral.getType(array), i;

        if (type !== 'array' && type !== 'nodelist' && type !== "namednodemap") {
            //Spektral.throwError("listArrayObjects: You must pass either an array or nodelist to this function.")
            Spektral.log("listArrayObjects: You must pass either an array or nodelist to this function.", "warn");
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
    ////ARRAY HAS VALUE
    /////////////////
    Spektral.arrayHasValue = function (array, value) {

        var i, found = false;
        for(i = 0; i < array.length; i += 1) {
            if(array[i] === value) {
                found = true;
            }
        }
        return found;
    };

    //////////////////
    ////QUERY ARRAY
    /////////////////
    Spektral.queryArray = function(array, query) {

        var i, resultArray = [];

        for (i = 0; i < array.length; i += 1) {
            if(array[i] === query) {
                resultArray.push(array[i]);
            }
        }

        if(resultArray.length === 1) {
            return resultArray[0];
        } else {
            return resultArray;
        }
    };

    //////////////////
    ////LIST CHILD NODES
    /////////////////
    Spektral.listChildNodes = function (parent) {
        var children = parent.childNodes, i;
        Spektral.log("Children of: " + parent.nodeName);
        Spektral.log("children: " + Spektral.getInfo(children));
    };

    //////////////////
    ////GET CHILD NODES
    /////////////////
    Spektral.getChildNodes = function (parent) {
        var 
            children = parent.childNodes, 
            childArr = [], i, isElement;
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

        nn = Spektral.convertCase(element.nodeName);

        identifiers["id"] = element.id;
        identifiers["name"] = element.name;
        identifiers["class"] = element.className;
        //using nodeName as the key caused identifiers
        //to return with a type of div instead of object
        identifiers["node"] = nn;

        //Spektral.log("Identifiers for: " + element + " : " + Spektral.getInfo(identifiers));
        //Spektral.log("getElementIdentifiers: type: " + Spektral.getType(identifiers));
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

        //If type is XML
        if (Spektral.detectCharacter(type, "#") === true) {
            type = Spektral.stripString(type, "#");
        }
        return type;
    };

    ////////////////////
    ////VALIDATE PARAMS - might rename to validateObject
    ////////////////////
    Spektral.validateParams = function (params) {
        var paramsType = Spektral.getType(params);

        if (paramsType !== "object") {
            //Spektral.throwError("validateParams: params must always be an object. Currently it is an " + params + ".")
            Spektral.log("validateParams: params must always be an object. Currently it is an " + params + ".", "warn");
        }
    };

    ////////////////////
    ////GET FILE EXTENSION
    ////////////////////
    Spektral.getExtension = function (file) {
        var type = Spektral.getType(file);

        if (file === undefined) {
            //Spektral.throwError("getExtension: file is undefined. Did you pass a file name to this function?")
            Spektral.log("getExtension: file is undefined. Did you pass a file name to this function?", "warn");
        } else if (type !== "string") {
            //Spektral.throwError("getExtension: file needs to be string.")
            Spektral.log("getExtension: file needs to be string.", "warn");
        }
        return file.split(".").pop();
    };

    ////////////////////
    ////NAVIGATE TO URL
    ////////////////////
    Spektral.navigateToURL = function (url, newWindow, focusOnNew) {

        //Still have to test this, also I might allow for multiple window names:
        //ex. _self, _parent etc.
        newWindow = newWindow || false;
        focusOnNew = focusOnNew || false;
        if(newWindow === false) {
            try {
                window.location = url;
            } catch (e) {
                window.location.href = url;
            }
        } else {
            if(focusOnNew === false) { 
                window.open(url, "_blank");
            } else {
                window.open(url, "_blank");
                window.focus();
            }
        }
    };

    ////////////////////
    ////GET URL PATH
    ////////////////////
    Spektral.getURLPath = function () {

        var 
            protocol = location.protocol, hostName = location.hostname, 
            pathName = location.pathname, pathArray = Spektral.splitString(pathName, "/"),
            queryString = location.search, hashTag = location.hash, 
            fullPath = "", fullURL, urlObj = {}, i;

        for(i = 0; i < pathArray.length; i += 1) {
            fullPath += "/" + pathArray[i];
        }

        fullURL = protocol + "//" + hostName + fullPath + queryString + hashTag; 
        
        urlObj["protocol"] = Spektral.stripString(protocol, ":");
        urlObj["host"] = hostName;
        urlObj["path"] = fullPath;
        urlObj["pathArray"] = pathArray;
        urlObj["fileType"] = fullPath.split(".").pop();
        urlObj["queryString"] = queryString;
        urlObj["hash"] = hashTag;
        urlObj["fullURL"] = fullURL;

        //Spektral.log("urlObj: " + Spektral.getInfo(urlObj));

        return urlObj;
    };

    ////////////////////
    ////GET HASH
    ////////////////////
    Spektral.getHash = function() {
        var hashtag = location.hash;
        if(hashtag === "") {
            Spektral.log("getHash. No hash found!", "warn");
        }
        return hashtag;
    };

    ////////////////////
    ////SET HASH
    ////////////////////
    Spektral.setHash = function(hashtag) {
        location.hash = hashtag;
    };

    ////////////////////
    ////HASH DETECTED
    ////////////////////
    Spektral.hashDetected = function () {

        var 
            detected = false, 
            hash = location.hash;
        if(hash !== "") {
            detected = true;
        }
        return detected;
    };

    ////////////////////
    ////GET QUERY STRING
    ////////////////////
    Spektral.getQueryString = function () {

        var 
            queryParams = {},
            query = location.search,
            queryString, valArray, i, value;
        if(query === "") {
            Spektral.log("getQueryString: No query string was found.", "warn");
        } else {
            queryString = query.split("?").pop();
            valArray = Spektral.splitString(queryString, "&");
            for (i = 0; i < valArray.length; i += 1) {
                value = Spektral.splitString(valArray[i], "=");
                queryParams[value[0]] = value[1];
            }
        }
        return queryParams;    
    };

    ////////////////////
    ////SET QUERY STRING 
    ////////////////////
    Spektral.setQueryString = function (newKey, newVal) {

        var 
            keyType = Spektral.getType(newKey),
            currentURL = Spektral.getURLPath(),
            currentQueryObj = Spektral.getQueryString(),
            noCurrentQuery = Spektral.isObjectEmpty(currentQueryObj),
            newURL, newQueryString = "", valuesChanged = checkForChange();

        if (valuesChanged === true) {
           if(keyType === "string") {
                //single value
                if(noCurrentQuery === true) {
                    newQueryString = firstTimeQuery();
                } else {
                    newQueryString = appendSingleQuery();
                }

            } else {
                //An object with multiple values
                newQueryString = appendMultiQuery(newKey);
            } 
        } else {
            Spektral.log("setQueryString: No changes detected.", "warn");
        }

        function checkForChange() {

            //Check if existing values need to be changed
            //This avoids infinite reloading
            var 
                isChanged = false, nKeyObj, 
                nVal, currentVal, l, m;

            if(keyType === "string") {
                //check single value
                //Existing
                if (currentQueryObj[newKey] !== newVal) {
                    isChanged = true;
                }
                //check for new
                if (currentQueryObj[newKey] === undefined) {
                    isChanged = true;
                }

            } else {
                //Check object
                nKeyObj = newKey;
                //existing
                for (l in currentQueryObj) {
                    //check existing
                    if (nKeyObj[l] !== undefined) {
                        nVal = nKeyObj[l];
                        currentVal = currentQueryObj[l];
                        if (nVal !== currentVal) {
                            isChanged = true;
                        }
                    }
                }
                //check for new
                for (m in nKeyObj) {
                    if(currentQueryObj[m] === undefined) {
                        //New key
                        isChanged = true;
                    }
                }
            }    
            return isChanged;
        }

        function firstTimeQuery() {
            return newKey + "=" + newVal;
        }

        function appendSingleQuery() {

            var 
                newQ = "", k, 
                keyExists = false;

            for (k in currentQueryObj) {
                if (k === newKey) {
                    //Change existing value
                    newQ += k + "=" + newVal + "&";
                    keyExists = true;
                } else {
                    newQ += k + "=" + currentQueryObj[k] + "&";
                }
            }

            if (keyExists === false) {
                //key does not exist append to current query string
                newQ += newKey + "=" + newVal;
            } else {
                //trim & symbol off of end of newQ
                newQ = newQ.substring(0, (newQ.length - 1));
            }

            return newQ;
        }

        function appendMultiQuery(newKeyObj) {

            var 
                k, ke, valExists = false, 
                existingKeys = [], newKeys = [], 
                i, k, newQ = "", keyExists;

            //Cycling through existing keys
            //and create array
            for (k in currentQueryObj) {
                existingKeys.push(k);
            }

            //Cycle through new keys and 
            //create array
            for (ke in newKeyObj) {
                newKeys.push(ke);
            }

            //CrossCheck existing keys with new ones
            for (i = 0; i < existingKeys.length; i += 1) {
                keyExists = checkIfExists(existingKeys[i], newKeys);

                if(keyExists === true) {
                    //Spektral.log("must change!" + existingKeys[i]);
                    newQ += existingKeys[i] + "=" + newKeyObj[existingKeys[i]] + "&";
                } else {
                    //Spektral.log("no change!: " + existingKeys[i]);
                    newQ += existingKeys[i] + "=" + currentQueryObj[existingKeys[i]] + "&";
                }
            }

            //Add new keys to string
            for (k = 0; k < newKeys.length; k += 1) {
                keyExists = checkIfExists(newKeys[k], existingKeys);

                if(keyExists === false) {
                    //we add this new key to the 
                    //end of newQ
                    newQ += newKeys[k] + "=" + newKeyObj[newKeys[k]] + "&";
                    //Spektral.log(newKeys[k] + " is brand new!!!");
                }
            }

            function checkIfExists(keyName, arrayToCheck) {
                var 
                    exists = false, j;
                for (j = 0; j < arrayToCheck.length; j += 1) {
                    if(arrayToCheck[j] === keyName) {
                        exists = true;
                    }
                }
                return exists
            }

            newQ = newQ.substring(0, (newQ.length - 1));

            return newQ;
        }

        newURL = currentURL.protocol + "://" + currentURL.host + currentURL.path + "?" + newQueryString + currentURL.hash;

        if (valuesChanged === true) {
            location.href = newURL;
        }
    };

    ////////////////////
    ////REMOVE QUERY PROP - almost done, need to solve infinite reload when setQueryString is used on the same page
    ////////////////////
    // Spektral.removeQueryProp = function (keyToRemove) {

    //     var 
    //         currentURL = Spektral.getURLPath(),
    //         currentQueryObj, key, newQueryString = "", newURL = "";

    //     if(currentURL.queryString !== "") {
    //         currentQueryObj = Spektral.getQueryString();

    //         for (key in currentQueryObj) {
    //             if (key != keyToRemove) {
    //                 newQueryString += key + "=" + currentQueryObj[key] + "&";
    //             }
    //         }

    //         newQueryString = newQueryString.substring(0, (newQueryString.length - 1));

    //         newURL = currentURL.protocol + "://" + currentURL.host + currentURL.path + "?" + newQueryString + currentURL.hash;

    //         //location.href = newURL;

    //         //Spektral.log("removeQueryProp: newQueryString: " + newQueryString);

    //     } else {
    //         Spektral.log("removeQueryProp: Property: " + keyToRemove + " does not exist.", "warn");
    //     }

    //     //Spektral.log("removeQueryProp: newURL: " + newURL);
    // };

    ////////////////////
    ////TRIM STRING
    ////////////////////
    Spektral.trimString = function (request, start, end) {
        return request.substring(start, end);
    };

    ////////////////////
    ////QUERY OBJECT
    ////////////////////
    Spektral.queryObject = function (obj, key) {
        var value = false, k;
        for (k in obj) {
            if (k === key) {
                value = obj[k];
            }
        }
        return value;
    };

    ////////////////////
    ////OBJECT HAS KEY
    ////////////////////
    Spektral.objectHasKey = function (obj, key) {
        var hasKey = false, k;
        for (k in obj) {
            if (k === key) {
                hasKey = true;
            }
        }
        return hasKey;
    };

    ////////////////////
    ////CREATE TIMER
    ////////////////////
    Spektral.createTimer = function (time, handler) {

        var convertedTime = time * 1000;
        return setInterval(handler, convertedTime);
    };

    ////////////////////
    ////CLEAR TIMER
    ////////////////////
    Spektral.clearTimer = function (timer) {
        clearInterval(timer);
        timer = false;
    };

    ////////////////////
    ////CREATE TIME OUT
    ////////////////////
    Spektral.createTimeOut = function (time, handler) {

        var convertedTime = time * 1000;
        setTimeout(handler, convertedTime);
    };

    ////////////////////
    ////STOP TIME OUT
    ////////////////////
    Spektral.stopTimeOut = function (timeout) {
        clearTimeout(timeout);
    };

    ///////////////////
    ////THROW ERROR
    ///////////////////
    Spektral.throwError = function (message) {
        throw new Error("Spektraljs: " + message);
    };

    ///////////////////
    ////GET SYSTEM INFO
    ///////////////////
    Spektral.getSystemInfo = function() {

        var 
            nav = window.navigator,
            info = {}, possibleBrowsers, 
            ua = nav.userAgent, browser, browserMatch, i;

        possibleBrowsers = ["MSIE", "Firefox", "Chrome", "Safari", "Opera"];

        for(i = 0; i < possibleBrowsers.length; i += 1) {
            browserMatch = Spektral.hasPattern(ua, possibleBrowsers[i]);

            if(browserMatch === true) {
                browser = possibleBrowsers[i];
                if(browser === "MSIE") {
                    browser = "IE";
                }
                break;
            }
        }

        info["navigator"] = nav;
        info["appName"] = nav.appName;
        info["userAgent"] = ua;
        info["browser"] = browser;

        Spektral.log("getSystemInfo: nav: ", "dir", nav);
        return info;
    };

    ///////////////////
    ////LOG
    ///////////////////
    Spektral.log = function (message, method, obj) {

        method = method || "log";

        if (debug) {
            if(method === "dir") {
                console.log("Spektraljs: " + message);
                consoleLog.push(message);
                console.dir(obj);
                consoleLog.push(obj);
            } else if (method === "warn") {
                consoleLog.push(message);
                if(strictError === false) {
                    console.warn("Spektraljs: " + message);
                } else {
                    Spektral.throwError(message);
                }
            } else {
                console.log("Spektraljs: " + message);
                consoleLog.push(message);
            }
        }
    };

    ///////////////////
    ////GET CONSOLE LOG
    ///////////////////
    Spektral.getConsoleLog = function () {
        return consoleLog;
    };

    ////////////////////////////////////
    //--------TESTING METHODS---------//
    ////////////////////////////////////

    ///////////////////
    ////TEST TYPE
    ///////////////////

    //Gets the type of the result and compares it against
    //what the expected type should be
    //desc = required, expected: String
    //result = required, expected: Anything
    //expected = required, expected: String
    //logResult = optional, expects: Boolean, default: false - If set to true logs to result to the console
    Spektral.testType = function (desc, result, expected, logResult) {
        
        logResult = logResult || false;

        expected = Spektral.convertCase(expected);

        Spektral.log("testReturnedType: expected: " + expected);

        var
            resultType = Spektral.getType(result),
            pass = false;

        if (resultType === expected) {
            pass = true;
            if (logResult === true) {
                Spektral.log("testType: " + desc + " passed!");
            }
        } else {
            Spektral.log("testType: " + desc + " failed! expected: " + expected + ", result: " + result + ".", "warn");
        }
        return pass;
    };

    ///////////////////
    ////TEST VALUE
    ///////////////////

    //Compares the result value against the expected value
    //If expected is an array, the array will be cycled through 
    //until the result is found in the array
    //desc = required, expected: String
    //result = required, expected: Any value
    //expected = required, expected: Any value
    //logResult = optional, expects: Boolean, default: false - If set to true logs to result to the console
    Spektral.testValue = function (desc, result, expected, logResult) {

        logResult = logResult || false;

        var
            pass = false,
            expectedType = Spektral.getType(expected), i;

        if (expectedType === "array") {
            //Will check to confirm how this is supposed to work
            for (i = 0; i < expected.length; i += 1) {
                if (result === expected[i]) {
                    pass = true;
                }
            }
        } else {

            if (result === expected) {
                pass = true;
                if (logResult === true) {
                    Spektral.log("testValue: " + desc + " passed!");
                }   
            } else {
                Spektral.log("testValue: " + desc + " failed! expected: " + expected + ", result: " + result + ".", "warn");
            }
        }
        return pass;
    };

    ///////////////////
    ////TEST ARRAY FOR VALUE
    ///////////////////
    //Cycles through an array searching for the expected value
    //desc = required, expected: String
    //testArray = required, expected: Array
    //expectedValue = required, expected: Anything
    //logResult = optional, expects: Boolean, default: false - If set to true logs to result to the console
    Spektral.testArrayForValue = function (desc, testArray, expectedValue, logResult) {

        logResult = logResult || false;

        var i, pass = false;

        for (i = 0; i < testArray.length; i += 1) {
            if (testArray[i] === expectedValue) {
                pass = true;
                if (logResult === true) {
                    Spektral.log("testArrayForValue: " + desc + " passed!");
                }   
            }
        }

        if(pass === false) {
            Spektral.log("testArrayForValue: " + desc + " failed! expected: " + expected + ", result: " + result + ".", "warn");
        }

        return pass;
    };

    ///////////////////
    ////ADD RESULT TO CONTAINER
    ///////////////////
    //Adds a test result to a container
    //testID = required, expects: String - the id of the element you want to add the result to
    //desc = required, expected: String - generally what you expect the result should be
    //result = required, expected: Boolean - the result returned usually by using testType, testValue, testArrayForValue
    Spektral.addResultToContainer = function (testID, desc, result) {

        var
            testContainer = Spektral.getElement(testID),
            test = Spektral.createNewElement("div", testContainer);

        Spektral.setInnerText(test, desc);

        if (result === true) {
            Spektral.createSetAttribute(test, "class", "pass");
            Spektral.appendStyle(test, "color:green");
        } else {
            Spektral.createSetAttribute(test, "class", "fail");
            Spektral.appendStyle(test, "color:red");
        }
    };


    //Pass Spektral object to window
    window.Spektral =  Spektral;

}(window));
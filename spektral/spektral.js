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

    //////////////////////////////
    ////CREATE XML OBJECT
    //////////////////////////////
    Spektral.createXMLObject = function(xml, node, index) {
        node = node || xml.firstChild.nodeName;
        index = index || 0;

        var parentNode = xml.getElementsByTagName(node)[index];
        var child, type, xmlObject = {};
        for(var child = parentNode.firstChild; child != null; child = child.nextSibling) {
            type = Spektral.getType(child);

            // if (child.attributes.length > 0) {
            //         xmlObject["@attributes"] = {};
            //         for (var j = 0; j < child.attributes.length; j++) {
            //             var attribute = child.attributes.item(j);
            //             //xmlObject["@attributes"][attribute.tagName] = attribute.nodeValue;
            //             Spektral.log("Attribute: Name: " + attribute.tagName + " Value: " + attribute.nodeValue);
            //         }
            //     }
            
            
            if(type === "text") {
                //CDATA and Text
                //nodeArray.push(child.nodeValue);
            } else if (type === "element") {
                //Spektral.log("Attribute: " + child.nodeName);
                xmlObject[child.tagName] = Spektral.createObject(child.childNodes); 
                Spektral.log("TYPEPEPEPEP: " + Spektral.getType(child.childNodes));
                //for (var i = 0; i < child.length)          
            }
        }
        return xmlObject;
    }

    Spektral.createObject = function (list, attributes) {

        var child, type, listArray = [], listObject = {};
        for(var i = 0; i < list.length; i++) {
            child = list[i];
             //Spektral.log("createObject: list: " + list[i].attributes);
            type = child.nodeType;
            var listObject;

            //Spektral.log("AHAHAHA: " + child.hasAttributes());
            // if(child.attributes.length >= 1) {
            //     console.log(child.attribute.item(0).nodeName);
            // }



            if(type === 1) {
                //Spektral.log("child.getAttribute(id)" + child.getAttribute("id"));
              

              listObject = {};
              listObject[child.tagName] = Spektral.getTextContent(child);
              listArray.push(listObject);

              

            } else if (type === 2) {//attribute!!!!
              Spektral.listNodeAttributes(child); 

            } else if (type === 3 || type === 4) {
              //Spektral.log("createObject: type === 3 || type === 4: " + child.attributes.item(0));
            }
            // type = child.nodeType;
            // Spektral.log("createObject: TYPE: " + type);
            // if(type === 4) {
            //     //CDATA and Text
            //     //nodeArray.push(child.nodeValue);
            //     Spektral.log("type===4: " + child.nodeValue);
            // } else if (type === 1) {
            //     //Text Content
            //      Spektral.log("type===1: " + Spektral.getTextContent(child));
            //     listObject[child.tagName] = Spektral.getTextContent(child);
            //     //Spektral.log("child.tagName: " + child.tagName + " content: " + Spektral.getTextContent(child) + " child.childNodes: " + child.childNodes);
            //     //Spektral.log("Nodelist: " + Spektral.listArrayElements(child.childNodes));
            // }
        }

        return listArray;
    }

    ///////////////////////////////
    ////GET XML NODE VALUE
    //////////////////////////////
    Spektral.getXMLNodeValue = function(xml, request) {
        var values = Spektral.splitString(request, ".");
        var parentNode = xml.getElementsByTagName(values[0])[0];
        var requestedNode = Spektral.splitString(values[1], "[")[0];
        var requestedNodeIndex = Spektral.stripBrackets(values[1]);
        //return parentNode.getElementsByTagName(requestedNode)[requestedNodeIndex].childNodes[0].nodeValue;
        return parentNode.getElementsByTagName(requestedNode)[requestedNodeIndex].innerText;
    };

    ////////////////////
    ////CREATE XML NODE ARRAY
    ///////////////////
    Spektral.createXMLNodeArray = function (xml, request, index) {
        index = index || 0;
        var parentNode = xml.getElementsByTagName(request)[index];
        var child, type, nodeArray = [];
        for(child = parentNode.firstChild; child != null; child = child.nextSibling) {
            type = child.nodeType;
            Spektral.log("TYPE: " + type);
            if(type === 4) {
                //CDATA and Text
                nodeArray.push(child.nodeValue);
            } else if (type === 1) {
                console.log("TAG NAME: " + child.tagName);
                //Text Content
                nodeArray.push(Spektral.getTextContent(child));//CDATA
            }
        }
        return nodeArray;
    };

    ////////////////////
    ////GET TEXT CONTENT
    ///////////////////
    Spektral.getTextContent = function(element) {
        //innerHTML?
        var content = element.textContent; // Check if textContent is defined
        if (content !== undefined) return content;
    };

    Spektral.textContent2 = function(xml, request, index) {
        index = index || 0;
        var element = xml.getElementsByTagName(request)[index];
        var content = element.textContent; // Check if textContent is defined
        if (content !== undefined) return content;
        else return element.innerText;
    };

    Spektral.xmlToJson = function(xml) {
    
        // Create the return object
        var obj = {};

        if (xml.nodeType == 1) { // element
            // do attributes
            if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
                for (var j = 0; j < xml.attributes.length; j++) {
                    var attribute = xml.attributes.item(j);
                    obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                }
            }
        } else if (xml.nodeType == 3) { // text
            obj = xml.nodeValue;
        }

        // do children
        if (xml.hasChildNodes()) {
            for(var i = 0; i < xml.childNodes.length; i++) {
                var item = xml.childNodes.item(i);
                var nodeName = item.nodeName;
                if (typeof(obj[nodeName]) == "undefined") {
                    obj[nodeName] = Spektral.xmlToJson(item);
                } else {
                    if (typeof(obj[nodeName].push) == "undefined") {
                        var old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push(Spektral.xmlToJson(item));
                }
            }
        }
        return obj;
    };



    //////////////////
    ////QUERY XML -- Can find any node value no matter how deeply buried
    //////////////////
    Spektral.queryXML = function (xml, request) {

    };

    //////////////////////
    ////LIST NODE ATTRIBUTES
    //////////////////////
    Spektral.listNodeAttributes = function (node) {
        for (var key in node) {
            Spektral.log("Node: " + node.nodeName + " Attribute: " + key);
        }
    }

    //////////////////
    ////DETECT CHARACTER
    //////////////////
    Spektral.detectCharacter = function(request, character) {

    };

    ///////////////////
    ////GET INFO - deconstructs an element down to its properties
    ///////////////////
    Spektral.getInfo = function (element) {

    }

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
        if(type !== 'array' && type !== 'nodelist') {
            Spektral.throwError("listArrayElements: You must pass either an array or nodelist to this function.")
        } else {
            for (var i = 0; i < array.length; i++) {
                Spektral.log("listArrayElement: item" + i + ": " + array[i].nodeName);
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
//Examples Spektral.js
(function(){

    //vars
    var
        jsonObject = {},
        glossary = Spektral.getElement("glossary");

    //Comment for production
    Spektral.debug();

    init();

    ////////////////////
    ////INIT
    ////////////////////
    function init() {
        if(document.readyState === "complete") {
            loadJSON(null);
        }
        else {
            Spektral.attachEventListener(window, 'load', loadJSON);
        }
        Spektral.attachEventListener(window, "resize", onWindowResize);
    }

    ////////////////////
    ////LOAD JSON
    ////////////////////
    function loadJSON(e) {
        Spektral.loadJSON("js/documentation.json", onJSONLoaded);
    }

    ////////////////////
    ////ON JSON LOADED
    ////////////////////
    function onJSONLoaded(e) {
        jsonObject = e;
        Spektral.removeElement(listLoading);
        buildGlossary();
        initExamples();
    };

    ////////////////////
    ////BUILD GLOSSARY
    ////////////////////
    function buildGlossary() {

        var key, catSection, catTitle;
        for (key in jsonObject) {

            catSection = Spektral.createNewElement("div", glossary, key + "Section");
            Spektral.createSetAttribute(catSection, "class", "glossSection");

            catTitle = Spektral.createNewElement("h2", catSection);
            catTitle.innerHTML = key;
            populateCategories(key, jsonObject[key], catSection);
        }

        $(document).ready(function() {

            var msnry = new Masonry( glossary, {
                // options
                itemSelector: '.glossSection',
                gutter: 10,
                isInitLayout: false,
                "isFitWidth": true
            });

            msnry.on( "layoutComplete", function() {
                //glossary.setAttribute("style", "visibility:visible");
                console.log("layout is complete");
            });

            msnry.layout();
        });
    };

    ////////////////////
    ////POPULATE CATEGORIES
    ////////////////////
    function populateCategories(cat, catObject, section) {

        var key, catList, item, listItem, itemNum = 0;

        catList = Spektral.createNewElement("ul", section, cat);

        for (key in catObject) {

            item = catObject[key];
            listItem = Spektral.createNewElement("li", catList, "item" + itemNum);
            listItem.innerHTML = item.title;
            Spektral.attachEventListener(listItem, "click", onListItemClick);
            itemNum += 1;
        }
    };

    ////////////////////
    ////ON LIST ITEM CLICK
    ////////////////////
    function onListItemClick(e) {

        //scrollToTop(e);
        var
            target = Spektral.getTarget(e),
            targetID = Spektral.getTargetID(e),
            cat = Spektral.getParent(target).id,
            num = Spektral.stripString(targetID, "item");
    };

    ////////////////////
    ////ON WINDOW RESIZE
    ////////////////////
    function onWindowResize(evt) {

        //adjustExamples();
    };

    ////////////////////
    ////ADJUST EXAMPLES
    ////////////////////
    function adjustExamples() {
        var
            infoHolder = Spektral.getElement("innerInfoHolder"),
            elHolder = Spektral.getElement("innerElementHolder"),
            infoHeight,
            elHeight, i;

        for (i = 0; i < infoHolder.length; i += 1) {

            infoHeight = Spektral.getDimensions(infoHolder[i]).height;
            elHeight = Spektral.getDimensions(elHolder[i]).height;

            if(infoHeight >= elHeight) {
                Spektral.matchHeight(infoHolder[i], elHolder[i]);
            } else {
                Spektral.matchHeight(elHolder[i], infoHolder[i]);
            }
        }
    };

    /////////////////////////////////////////////////////////
    ////TESTING EXAMPLES************************************
    /////////////////////////////////////////////////////////

    function initExamples() {

        ////DOM****START**************************************************

        ////////////////////
        ////GET ELEMENT
        ////////////////////
        getElement();

        function getElement() {

            var
                testDivOne = Spektral.getElement("geTestOne"),
                testDivOneResult = testMethod("getElement", testDivOne, "div"),

                testDivTwo = Spektral.getElement("geTestTwo"),
                testDivTwoResult = testMethod("getElement", testDivTwo, "div"),

                testDivThree = Spektral.getElement("geTestThree"),
                testDivThreeResult = testMethod("getElement", testDivThree, "textarea");

            addTestResultToContainer("getElement", "A div with the id of geTestOne: ", testDivOneResult);
            addTestResultToContainer("getElement", "A div with the class of geTestTwo: ", testDivTwoResult);
            addTestResultToContainer("getElement", "A textarea with the name of geTestThree: ", testDivThreeResult);
        };

        ////////////////////
        ////GET ELEMENT BY CLASS
        ////////////////////
        getElementByClass();

        function getElementByClass() {

            var
                testDivs = Spektral.getElementByClass("gebc"),
                testDivsResult = testMethod("getElementByClass", testDivs, "nodelist"),

                testDivTwo = Spektral.getElementByClass("gebc", 1),
                testDivTwoResult = testMethod("getElementByClass", testDivTwo, "div");

            Spektral.setStyle(testDivTwo, "border-color:green");

            addTestResultToContainer("getElementByClass", "A node list with all elements with the class of gebc: ", testDivsResult);
            addTestResultToContainer("getElementByClass", "The second div with the class of gebc: ", testDivTwoResult);
        };

        ////////////////////
        ////QUERY
        ////////////////////
        query();

        function query() {

            var
                testDiv = Spektral.query("#queryDiv"),
                testDivResult = testMethod("query", testDiv, "div");

            addTestResultToContainer("query", "A div with the id of queryDiv: ", testDivResult);
        };

        ////////////////////
        ////GET TARGET
        ////////////////////
        getTarget();

        function getTarget() {

            var
                testEvt = Spektral.createEvent("testEvent"),
                getTargetDiv = Spektral.getElement("getTargetDiv"),
                eventTarget, testEventResult;

            Spektral.attachEventListener(getTargetDiv, "testEvent", onTestEvent);

            getTargetDiv.dispatchEvent(testEvt);

            function onTestEvent(evt) {

                eventTarget = Spektral.getTarget(evt);
                testEventResult = testMethod("getTarget", eventTarget, "div");
                addTestResultToContainer("getTarget", "A div with the id of getTargetDiv: ", testEventResult);
            };
        };

        ////////////////////
        ////GET TARGET ID
        ////////////////////
        getTargetID();

        function getTargetID() {

            var
                testEvt = Spektral.createEvent("testEvent"),
                testDiv = Spektral.getElement("gtIDTest"),
                targetID, gtIDResult;

            Spektral.attachEventListener(testDiv, "testEvent", onTestEvent);

            testDiv.dispatchEvent(testEvt);

            function onTestEvent(evt) {

                targetID = Spektral.getTargetID(evt);
                gtIDResult = testReturnedValue("getTargetID", targetID, "gtIDTest");
                addTestResultToContainer("getTargetID", "The id of the test div (gtIDTest): ", gtIDResult);
            };
        };

        ///////////////////////
        ////GET PARENT
        //////////////////////
        getParent();

        function getParent() {

            var
                cDiv = Spektral.getElement("childDiv"),
                pDiv = Spektral.getParent(cDiv),
                pID = Spektral.getElementIdentifiers(pDiv).id,
                getParentResult = testReturnedValue("getParent", pID, "parentDiv");

            Spektral.setStyle(pDiv, "border: 1px solid green");

            addTestResultToContainer("getParent", "A div with the id of parentDiv: ", getParentResult);
        };

        //////////////////////
        ////GET CHILD NODES
        //////////////////////
        getChildNodes();

        function getChildNodes() {

            var
                parent = Spektral.getElement("gcnParent"),
                childNodes = Spektral.getChildNodes(parent),
                gcnResult = testMethod("getChildNodes", childNodes, "array"),
                testDivTwo = childNodes[1].id,
                hasIDResult = testReturnedValue("getChildNodes", testDivTwo, "gcnTwo");

            addTestResultToContainer("getChildNodes", "An array: ", gcnResult);
            addTestResultToContainer("getChildNodes", "Second item in array has id gcnTwo: ", hasIDResult);
        };

        ///////////////////////
        ////CREATE NEW ELEMENT
        //////////////////////
        createNewElement();

        function createNewElement() {

            var
                container = Spektral.getElement("cneContainer"),
                createdDiv = Spektral.createNewElement("div", container, "newlyCreatedDiv"),
                createdImg = Spektral.createNewElement("img", container, "newlyCreatedImg"),
                createdDivResult = testMethod("createNewElement", createdDiv, "div"),
                createdImgResult = testMethod("createNewElement", createdImg, "img");

            //Set class for div and text for div
            Spektral.createSetAttribute(createdDiv, "class", "testDiv");
            Spektral.setInnerText(createdDiv, "div - id=\"newlyCreatedDiv\"");

            //Set class/image/alt for img
            Spektral.createSetAttribute(createdImg, "class", "testImg");
            Spektral.createSetAttribute(createdImg, "src", "img/spektraljs.jpg");
            Spektral.createSetAttribute(createdImg, "alt", "An img tag created by the createNewElement method.");

            addTestResultToContainer("createNewElement", "A newly created div: ", createdDivResult);
            addTestResultToContainer("createNewElement", "A newly created img: ", createdImgResult);
        };

        ///////////////////////
        ////MOVE TO AFTER
        //////////////////////
        moveToAfter();

        function moveToAfter() {

            var
                container = Spektral.getElement("mtaContainer"),
                divOne = Spektral.getElement("mtaDivOne"),
                divTwo = Spektral.getElement("mtaDivTwo"),
                divThree = Spektral.getElement("mtaDivThree"), childNodes,
                affectedDivID, mtaResult;

            Spektral.moveToAfter(divOne, divThree);

            childNodes = Spektral.getChildNodes(container);

            affectedDivID = Spektral.getElementIdentifiers(childNodes[2]).id;

            mtaResult = testReturnedValue("moveToAfter", affectedDivID, "mtaDivOne");

            addTestResultToContainer("moveToAfter", "A div with the id of mtaDivOne: ", mtaResult);
        };

        //////////////////////
        ////MOVE TO BEFORE
        //////////////////////
        moveToBefore();

        function moveToBefore() {

            var
                container = Spektral.getElement("mtbContainer"),
                divOne = Spektral.getElement("mtbDivOne"),
                divTwo = Spektral.getElement("mtbDivTwo"),
                divThree = Spektral.getElement("mtbDivThree"), childNodes,
                affectedDivID, mtbResult;

            Spektral.moveToBefore(divThree, divOne);

            childNodes = Spektral.getChildNodes(container);

            affectedDivID = Spektral.getElementIdentifiers(childNodes[0]).id;

            mtbResult = testReturnedValue("moveToBefore", affectedDivID, "mtbDivThree");

            addTestResultToContainer("moveToBefore", "A div with the id of mtbDivThree: ", mtbResult);
        };

        //////////////////////
        ////REMOVE ELEMENT
        //////////////////////
        removeElement();

        function removeElement() {

            var
                container = Spektral.getElement("reContainer"),
                divToRemove = Spektral.getElement("reDivTwo"),
                childNodes, i, divID, divRemoved = true, reResult;

            Spektral.removeElement(divToRemove);

            childNodes = Spektral.getChildNodes(container);

            for(i = 0; i < childNodes.length; i += 1) {

                divID = Spektral.getElementIdentifiers(childNodes[i]).id;

                if(divID === "reDivTwo") {
                    divRemoved = false;
                }
            }

            reResult = testReturnedValue("removeElement", divRemoved, true);

            addTestResultToContainer("removeElement", "The div with id of reDivTwo is removed: ", reResult);
        };

        //////////////////////
        ////CLEAR ALL CHILDREN
        //////////////////////
        clearAllChildren();

        function clearAllChildren() {

            var
                container = Spektral.getElement("cacContainer"),
                childNodes, isParentEmpty, cacResult;

            Spektral.clearAllChildren(container);
            childNodes = Spektral.getChildNodes(container);
            isParentEmpty = Spektral.isObjectEmpty(childNodes);
            Spektral.setInnerText(container, "div - parent container");

            cacResult = testReturnedValue("clearAllChildren", isParentEmpty, true);
            addTestResultToContainer("clearAllChildren", "The parent node is empty: ", cacResult);
        };

        //////////////////////
        ////CREATE SET ATTRIBUTE
        //////////////////////
        createSetAttribute();

        function createSetAttribute() {

            var testImg = Spektral.getElement("csaImg"),
            checkForSrc, checkForAlt,
            srcTestResult, altTestResult;

            Spektral.createSetAttribute(testImg, "src", "img/spektraljs.jpg");
            Spektral.createSetAttribute(testImg, "alt", "Alt tag for example test image.");

            checkForSrc = Spektral.checkForAttribute(testImg, "src");
            checkForAlt = Spektral.checkForAttribute(testImg, "alt");

            srcTestResult = testReturnedValue("createSetAttribute", checkForSrc, true);
            altTestResult = testReturnedValue("createSetAttribute", checkForAlt, true);

            addTestResultToContainer("createSetAttribute", "The img has a src tag: ", srcTestResult);
            addTestResultToContainer("createSetAttribute", "The img has an alt tag: ", altTestResult);

        };

        /////////////////////////////
        ////GET ATTRIBUTE VALUE
        /////////////////////////////
        getAttributeValue();

        function getAttributeValue() {

            var
                testImg = Spektral.getElement("gavImg"),
                srcValue = Spektral.getAttributeValue(testImg, "src"),
                srcValueResult = testMethod("getAttributeValue", srcValue, "string");

            addTestResultToContainer("getAttributeValue", "Value of attribute returned as string: ", srcValueResult);
        };

        //////////////////////
        ////DESTROY ATTRIBUTE
        //////////////////////
        destroyAttribute();

        function destroyAttribute() {

            var testImg = Spektral.getElement("daImg"),
                checkForAlt, daResult;

            Spektral.destroyAttribute(testImg, "alt");

            checkForAlt = Spektral.checkForAttribute(testImg, "alt");

            daResult = testReturnedValue("destroyAttribute", checkForAlt, false);

            addTestResultToContainer("destroyAttribute", "The alt attribute has been removed: ", daResult);
        };

        //////////////////////
        ////GET NODE ATTRIBUTES
        //////////////////////
        getNodeAttributes();

        function getNodeAttributes() {

            var
                testImg = Spektral.getElement("gnaImg"),
                attrs  = Spektral.getNodeAttributes(testImg),
                nodeID, nodeClass, nodeSrc, nodeAlt, gnaResult,
                idResult, classResult, srcResult, altResult;

            nodeID = attrs.id;
            nodeClass = attrs.class;
            nodeSrc = attrs.src;
            nodeAlt = attrs.alt;

            gnaResult = testMethod("getNodeAttributes", attrs, "object");
            idResult = testReturnedValue("getNodeAttributes", nodeID, "gnaImg");
            classResult = testReturnedValue("getNodeAttributes", nodeClass, "testImg");
            srcResult = testReturnedValue("getNodeAttributes", nodeSrc, "img/spektraljs.jpg");
            altResult = testReturnedValue("getNodeAttributes", nodeAlt, "Alt tag")

            addTestResultToContainer("getNodeAttributes", "An object with node attributes: ", gnaResult);
            addTestResultToContainer("getNodeAttributes", "id attribute is gnaImg: ", idResult);
            addTestResultToContainer("getNodeAttributes", "class attribute is testImg: ", classResult);
            addTestResultToContainer("getNodeAttributes", "src attribute is img/spektraljs.jpg: ", srcResult);
            addTestResultToContainer("getNodeAttributes", "alt attribute is Alt tag: ", altResult);
        };

        //////////////////////
        ////CHECK FOR ATTRIBUTE
        //////////////////////
        checkForAttribute();

        function checkForAttribute() {

            var
                testDiv = Spektral.getElement("cfaDiv"),
                hasID = Spektral.checkForAttribute(testDiv, "id"),
                cfaResult = testReturnedValue("checkForAttribute", hasID, true);

            addTestResultToContainer("checkForAttribute", "The div has an id attribute: ", cfaResult);
        };

        //////////////////////
        ////LIST NODE ATTRIBUTES
        //////////////////////
        listNodeAttributes();

        function listNodeAttributes() {

            var
                testDiv = Spektral.getElement("lnaDiv"),
                attributeArray = Spektral.listNodeAttributes(testDiv),
                lndResult = testMethod("listNodeAttributes", attributeArray, "array"),
                isArrEmpty = Spektral.isObjectEmpty(attributeArray),
                arrEmptyResult = testReturnedValue("listNodeAttributes", isArrEmpty, false),
                arrTest = testArrayForValue("listNodeAttributes", attributeArray, "nodeName");

            addTestResultToContainer("listNodeAttributes", "A array: ", lndResult);
            addTestResultToContainer("listNodeAttributes", "Array isn't empty: ", arrEmptyResult);
            addTestResultToContainer("listNodeAttributes", "Array contains value nodeName: ", arrTest);
        };

        //////////////////////
        ////GET INNER TEXT
        //////////////////////
        getInnerText();

        function getInnerText() {

            var
                testDiv = Spektral.getElement("gitDiv"),
                textContent = Spektral.getInnerText(testDiv),
                gitResult = testReturnedValue("getInnerText", textContent, "This is the inner text for gitDiv");

            addTestResultToContainer("getInnerText", "This is the inner text for gitDiv: ", gitResult);
        };

        //////////////////////
        ////SET INNER TEXT
        //////////////////////
        setInnerText();

        function setInnerText() {

            var
                testDiv = Spektral.getElement("sitDiv"),
                newInnerText, sitResult;

            Spektral.setInnerText(testDiv, "This string was set using setInnerText");

            newInnerText = Spektral.getInnerText(testDiv);

            sitResult = testReturnedValue("setInnerText", newInnerText, "This string was set using setInnerText");

            addTestResultToContainer("setInnerText", "This string was set using setInnerText: ", sitResult);
        };

        //////////////////////
        ////LIST ELEMENTS
        //////////////////////
        listElements();

        function listElements() {

            var
                domElements = Spektral.listElements(),
                domElementIDs = Spektral.listElements("id"),
                leResult = testMethod("listElements", domElements, "array"),
                hasDivResult = testArrayForValue("listElements", domElements, "div"),
                hasIDResult = testArrayForValue("listElements", domElementIDs, "leDiv");

            addTestResultToContainer("listElements", "An array: ", leResult);
            addTestResultToContainer("listElements", "domElements contains divs: ", hasDivResult);
            addTestResultToContainer("listElements", "domElementIDs contains id of leDiv: ", hasIDResult);
        };

        ////DOM****END**************************************************

        ////EVENT****START**************************************************

        //////////////////////
        ////ATTACH EVENT LISTENER
        //////////////////////
        attachEventListener();

        function attachEventListener() {

            var
                testDiv = Spektral.getElement("aelDiv"),
                customEvent = Spektral.createEvent("testEvent"),
                evtTriggered = false, aelResult;

            Spektral.attachEventListener(testDiv, "testEvent", onTestEvent);

            Spektral.triggerEvent(testDiv, customEvent);

            function onTestEvent(evt) {
                //Event is triggered
                evtTriggered = true;
            };

            aelResult = testReturnedValue("attachEventListener", evtTriggered, true);

            addTestResultToContainer("attachEventListener", "Event has fired: ", aelResult);
        };

        //////////////////////
        ////DETACH EVENT LISTENER
        //////////////////////
        detachEventListener();

        function detachEventListener() {

            var
                testDiv = Spektral.getElement("delDiv"),
                customEvent = Spektral.createEvent("testEvent"),
                evtTriggered = false, delResult;

            //Attaching event listener to prove detachEventListener
            //is functioning properly
            Spektral.attachEventListener(testDiv, "testEvent", onTestEvent);

            Spektral.detachEventListener(testDiv, "testEvent", onTestEvent);

            Spektral.triggerEvent(testDiv, customEvent);

            function onTestEvent(evt) {
                //Event is triggered
                evtTriggered = true;
            };

            delResult = testReturnedValue("detachEventListener", evtTriggered, false);

            addTestResultToContainer("detachEventListener", "The evt was not triggered: ", delResult);
        };

        //////////////////////
        ////CREATE EVENT
        //////////////////////
        createEvent();

        function createEvent() {

            var
                testDiv = Spektral.getElement("ceDiv"),
                customEvent = Spektral.createEvent("testEvent", {foo : "bar", spektral : "js"}),
                foo, spektral, evtTriggered = false, ceResult, hasFoo, hasSpektral;

            Spektral.attachEventListener(testDiv, "testEvent", onTestEvent);

            Spektral.triggerEvent(testDiv, customEvent);

            function onTestEvent(evt) {

                //test event
                foo = evt.detail.foo;
                spektral = evt.detail.spektral;
                evtTriggered = true;
            };

            ceResult = testReturnedValue("createEvent", evtTriggered, true);
            hasFoo = testReturnedValue("createEvent", foo, "bar");
            hasSpektral = testReturnedValue("createEvent", spektral, "js");

            addTestResultToContainer("createEvent", "Event was created and triggered: ", ceResult);
            addTestResultToContainer("createEvent", "Returned event has a parameter foo that returns the value bar: ", hasFoo);
            addTestResultToContainer("createEvent", "Returned event has a parameter spektral that returns the value js: ", hasSpektral);
        };

        //////////////////////
        ////TRIGGER EVENT
        //////////////////////
        triggerEvent();

        function triggerEvent() {

            var
                testDiv = Spektral.getElement("teDiv"),
                customEvent = Spektral.createEvent("testEvent"),
                customTriggered = false, defaultTriggered = false,
                customResult, defaultResult;

            //Custom Event
            Spektral.attachEventListener(testDiv, "testEvent", onCustomEvent);
            //Default Event
            Spektral.attachEventListener(testDiv, "click", onClickEvent);

            Spektral.triggerEvent(testDiv, customEvent);
            Spektral.triggerEvent(testDiv, "click");

            function onCustomEvent(evt) {
                //Custom event triggered
                customTriggered = true;
            };

            function onClickEvent(evt) {
                //Click event triggered
                defaultTriggered = true;
            };

            customResult = testReturnedValue("triggerEvent", customTriggered, true);
            defaultResult = testReturnedValue("triggerEvent", defaultTriggered, true);

            addTestResultToContainer("triggerEvent", "Custom event was triggered: ", customResult);
            addTestResultToContainer("triggerEvent", "Default event was triggered: ", defaultResult);
        };

        //////////////////////
        ////CANCEL EVENT
        //////////////////////
        cancelEvent();

        function cancelEvent() {

            var
                testAnchor = Spektral.getElement("ceAnchor"),
                ceResult, canCancel, canBubble, hash, hashCheck;

            Spektral.attachEventListener(testAnchor, "click", onClickEvent);

            Spektral.triggerEvent(testAnchor, "click");

            function onClickEvent(evt) {

                //Stops browser from navigating to href
                hashCheck = Spektral.createTimeOut(3, checkForHash);
                Spektral.cancelEvent(evt);
            };

            function checkForHash() {
                hash = Spektral.hashDetected();
                ceResult = testReturnedValue("cancelEvent", hash, false);

                addTestResultToContainer("cancelEvent", "No hash #ceHash: ", ceResult);
            };
        };

        //////////////////////
        ////CANCEL PROPAGATION
        //////////////////////
        cancelPropagation();

        function cancelPropagation() {

            var
                testDiv = Spektral.getElement("cpDiv"),
                testEvent = Spektral.createEvent("testEvent"), callCount = 0,
                cpResult;

            Spektral.attachEventListener(document, "testEvent", onTestEvent);
            Spektral.attachEventListener(testDiv, "testEvent", onTestEvent);

            Spektral.triggerEvent(testDiv, testEvent);

            function onTestEvent(evt) {

                callCount += 1;
                //Without cancelPropagation this function
                //is called twice due to the event
                //bubbling up from testDiv to the document
                Spektral.cancelPropagation(evt);
            };

            cpResult = testReturnedValue("cancelPropagation", callCount, 1);

            addTestResultToContainer("cancelPropagation", "The function called only once: ", cpResult);
        };

        //////////////////////
        ////GET MOUSE POS
        //////////////////////
        getMousePos();

        function getMousePos() {

            var
                testDiv = Spektral.getElement("gmpDiv"),
                mousePos, divX, divY, pageX, pageY, offsetX, offsetY,
                targetID, viewX, viewY, screenX, screenY,
                objectReceived = false, gmpResult, hasInnerX, hasInnerY,
                hasViewX, hasViewY, hasScreenX, hasScreenY, hasPageX, hasPageY,
                hasOffsetX, hasOffsetY;

            Spektral.attachEventListener(window, "mousemove", onMouseMove);
            Spektral.attachEventListener(testDiv, "mousemove", onMouseMove);

            function onMouseMove(evt) {

                targetID = Spektral.getTargetID(evt);
                mousePos = Spektral.getMousePos(evt);

                if(objectReceived === false) {
                    gmpResult = testMethod("getMousePos", mousePos, "object");
                    addTestResultToContainer("getMousePos", "Returns an object: ", gmpResult);
                    objectReceived = true;
                }

                if(targetID === "gmpDiv") {
                    divX = mousePos.innerX;
                    divY = mousePos.innerY;
                    //console.log("divX: " + divX + " divY: " + divY);

                    hasInnerX = testMethod("getMousePos", divX, "number");
                    hasInnerY = testMethod("getMousePos", divY, "number");

                    addTestResultToContainer("getMousePos", "Object returns innerX: ", hasInnerX);
                    addTestResultToContainer("getMousePos", "Object returns innerY: ", hasInnerY);

                    Spektral.detachEventListener(testDiv, "mousemove", onMouseMove);
                } else {
                    //console.log("****VIEWPORT******************");
                    viewX = mousePos.viewportX;
                    viewY = mousePos.viewportY;
                    //console.log("viewX: " + viewX + " viewY: " + viewY);

                    hasViewX = testMethod("getMousePos", viewX, "number");
                    hasViewY = testMethod("getMousePos", viewY, "number");

                    addTestResultToContainer("getMousePos", "Object returns viewX: ", hasViewX);
                    addTestResultToContainer("getMousePos", "Object returns viewY: ", hasViewY);

                    //console.log("****SCREEN******************");
                    screenX = mousePos.screenX;
                    screenY = mousePos.screenY;
                    //console.log("screenX: " + screenX + " screenY: " + screenY);

                    hasScreenX = testMethod("getMousePos", screenX, "number");
                    hasScreenY = testMethod("getMousePos", screenY, "number");

                    addTestResultToContainer("getMousePos", "Object returns screenX: ", hasScreenX);
                    addTestResultToContainer("getMousePos", "Object returns screenY: ", hasScreenY);

                    //console.log("****PAGE******************");
                    pageX = mousePos.pageX;
                    pageY = mousePos.pageY;
                    //console.log("pageX: " + pageX + " pageY: " + pageY);

                    hasPageX = testMethod("getMousePos", pageX, "number");
                    hasPageY = testMethod("getMousePos", pageY, "number");

                    addTestResultToContainer("getMousePos", "Object returns pageX: ", hasPageX);
                    addTestResultToContainer("getMousePos", "Object returns pageY: ", hasPageY);

                    //OFFSET
                    offsetX = mousePos.offsetX;
                    offsetY = mousePos.offsetY;

                    hasOffsetX = testMethod("getMousePos", offsetX, "number");
                    hasOffsetY = testMethod("getMousePos", offsetY, "number");

                    addTestResultToContainer("getMousePos", "Object returns offsetX: ", hasOffsetX);
                    addTestResultToContainer("getMousePos", "Object returns offsetY: ", hasOffsetY);

                    Spektral.detachEventListener(window, "mousemove", onMouseMove);
                }
            };

            //////////////////////
            ////USE HAND CURSOR
            //////////////////////
            useHandCursor();

            function useHandCursor() {

                var
                    testDiv = Spektral.getElement("uhcDiv"),
                    cursorType, uhcResult;

                Spektral.useHandCursor(testDiv);
                cursorType = Spektral.getStyle(testDiv, "cursor");

                uhcResult = testReturnedValue("useHandCursor", cursorType, "pointer");
                addTestResultToContainer("useHandCursor", "Cursor has been set to pointer: ", uhcResult);
            };

            //////////////////////
            ////USE DEFAULT CURSOR
            //////////////////////
            useDefaultCursor();

            function useDefaultCursor() {

                var
                    testDiv = Spektral.getElement("udcDiv"),
                    cursorType, udcResult;

                //Set cursor to pointer
                Spektral.useHandCursor(testDiv);

                //Switch cursor back to default
                Spektral.useDefaultCursor(testDiv);

                cursorType = Spektral.getStyle(testDiv, "cursor");

                udcResult = testReturnedValue("useDefaultCursor", cursorType, "default");
                addTestResultToContainer("useDefaultCursor", "Cursor is set to default: ", udcResult);
            };

            //////////////////////
            ////CONVERT CASE
            //////////////////////
            convertCase();

            function convertCase() {

                var
                    toUpper = "upper text", toLower = "LOWER TEXT",
                    upper, lower, upperResult, lowerResult,
                    utDiv = Spektral.getElement("utDiv"),
                    ltDiv = Spektral.getElement("ltDiv");

                upper = Spektral.convertCase(toUpper, "upper");
                lower = Spektral.convertCase(toLower);

                Spektral.setInnerText(utDiv, upper);
                Spektral.setInnerText(ltDiv, lower);

                upperResult = testReturnedValue("convertCase", upper, "UPPER TEXT");
                lowerResult = testReturnedValue("convertCase", lower, "lower text");

                addTestResultToContainer("convertCase", "String is \"UPPER TEXT\": ", upperResult);
                addTestResultToContainer("convertCase", "String is \"lower text\": ", lowerResult);
            };

            //////////////////////
            ////SPLIT STRING
            //////////////////////
            splitString();

            function splitString() {

                var
                    testComma = "One, Two, Three, Four",
                    testHyphen = "Alpha-Bravo-Charlie-Delta",
                    commaArray = Spektral.splitString(testComma),
                    hyphenArray = Spektral.splitString(testHyphen, "-"),
                    commaResult = testMethod("splitString", commaArray, "array"),
                    hyphenResult = testMethod("splitString", hyphenArray, "array"),
                    hasThree = testArrayForValue("splitString", commaArray, "Three"),
                    hasBravo = testArrayForValue("splitString", hyphenArray, "Bravo");

                addTestResultToContainer("splitString", "testComma was converted to array: ", commaResult);
                addTestResultToContainer("splitString", "testHyphen was converted to array: ", hyphenResult);
                addTestResultToContainer("splitString", "commaArray has value Three: ", hasThree);
                addTestResultToContainer("splitString", "hyphenArray has value Bravo: ", hasBravo);
            };

            //////////////////////
            ////CHECK FOR WHITE SPACE
            //////////////////////
            checkForWhiteSpace();

            function checkForWhiteSpace() {

                var
                    testString = "White space",
                    hasWhiteSpace = Spektral.checkForWhiteSpace(testString),
                    cfwsResult = testReturnedValue("checkForWhiteSpace", hasWhiteSpace, true);

                addTestResultToContainer("checkForWhiteSpace", "testString has white space: ", cfwsResult);
            };

            //////////////////////
            ////STRIP STRING
            //////////////////////
            stripString();

            function stripString() {

                var
                    stripStringResult, stripFirstResult, stripSecondResult,
                    testString = "T#hi@s #is a@ #te#s@t.",
                    stripHash = Spektral.stripString(testString, "#"),
                    stripAt = Spektral.stripString(stripHash, "@"),

                    testStringTwo = "@First @ symbol is stripped.",
                    stripFirst = Spektral.stripString(testStringTwo, "@", "first"),

                    testStringThree = "#Remove this #hash tag.#",
                    stripSecondHash = Spektral.stripString(testStringThree, "#", 1);

                stripStringResult = testReturnedValue("stripString", stripAt, "This is a test.");
                stripFirstResult = testReturnedValue("stripString", stripFirst, "First @ symbol is stripped.");
                stripSecondResult = testReturnedValue("stripString", stripSecondHash, "#Remove this hash tag.#");

                addTestResultToContainer("stripString", "String = \"This is a test.\": ", stripStringResult);
                addTestResultToContainer("stripString", "String = \"First @ symbol is stripped.\": ", stripFirstResult);
                addTestResultToContainer("stripString", "String = \"#Remove this hash tag,#\": ", stripSecondResult);
            };

            //////////////////////
            ////STRIP WHITE SPACE
            //////////////////////
            stripWhiteSpace();

            function stripWhiteSpace() {

                var
                    testStringOne = "    Strip the white space on the end.    ",
                    startEndStripped = Spektral.stripWhiteSpace(testStringOne),
                    testStringTwo = "No white spaces.",
                    noWhite = Spektral.stripWhiteSpace(testStringTwo, true),
                    sesResult = testReturnedValue("stripWhiteSpace", startEndStripped, "Strip the white space on the end."),
                    nwResult = testReturnedValue("stripWhiteSpace", noWhite, "Nowhitespaces.");

                addTestResultToContainer("stripWhiteSpace", "String = \"Strip the white space on the end.\": ", sesResult);
                addTestResultToContainer("stripWhiteSpace", "String = \"Nowhitespaces.\": ", nwResult);
            };
        };

        //////////////////////
        ////STRIP BRACKETS
        //////////////////////
        stripBrackets();

        function stripBrackets() {

            var
                squareString = "[Strip square brackets.]",
                strippedSquare = Spektral.stripBrackets(squareString),
                curlyString = "{Strip curly brackets.}",
                strippedCurly = Spektral.stripBrackets(curlyString),
                roundedString = "(Strip round brackets.)",
                strippedRound = Spektral.stripBrackets(roundedString),
                ssResult = testReturnedValue("stripBrackets", strippedSquare, "Strip square brackets."),
                scResult = testReturnedValue("stripBrackets", strippedCurly, "Strip curly brackets."),
                srResult = testReturnedValue("stripBrackets", strippedRound, "Strip round brackets.");

            addTestResultToContainer("stripBrackets", "String = \"Strip square brackets.\": ", ssResult);
            addTestResultToContainer("stripBrackets", "String = \"Strip curly brackets.\": ", scResult);
            addTestResultToContainer("stripBrackets", "String = \"Strip round brackets.\": ", srResult);
        };

        //////////////////////
        ////DETECT CHARACTER
        //////////////////////
        detectCharacter();

        function detectCharacter() {

            var
                hashTest = "#spektral",
                hasHash = Spektral.detectCharacter(hashTest, "#"),
                dollarTest = "$999.99",
                hasDollar = Spektral.detectCharacter(dollarTest, "$"),
                hashResult = testReturnedValue("detectCharacter", hasHash, true),
                dollarResult = testReturnedValue("detectCharacter", hasDollar, true);

            addTestResultToContainer("detectCharacter", "Has hash character: ", hashResult);
            addTestResultToContainer("detectCharacter", "Has dollar character: ", dollarResult);
        };

        //////////////////////
        ////CREATE ARRAY
        //////////////////////
        createArray();

        function createArray() {

            var
                xmlArray, caResult;

            Spektral.loadXML("xml/createarray.xml", onXMLLoaded);

            function onXMLLoaded(e) {

                xmlArray = Spektral.createArray(e.firstChild.childNodes);
                caResult = testMethod("createArray", xmlArray, "array");

                addTestResultToContainer("createArray", "An array: ", caResult);
            };
        };

        //////////////////////
        ////LIST ARRAY OBJECTS
        //////////////////////
        listArrayObjects();

        function listArrayObjects() {

            var testArray = ["One", "Two", "Three", "Four"],
                consoleLog, hasValue, laoResult;

            Spektral.listArrayObjects(testArray);

            consoleLog = Spektral.getConsoleLog();

            hasValue = Spektral.arrayHasValue(consoleLog, "Array: listArrayElement: item0: One");

            laoResult = testReturnedValue("listArrayObjects", hasValue, true);

            addTestResultToContainer("listArrayObjects", "Test array was logged in console: ", laoResult);
        };

        //////////////////////
        ////GET POS
        //////////////////////
//        getPos();
//
//        function getPos() {
//
//            var
//                testDiv = Spektral.getElement("gpDiv"), pos, posX, posY;
//
//            pos = Spektral.getPos(testDiv);
//            posX = pos.x;
//            posY = pos.y;
//
//            console.log("getPos: posX: " + posX + " posY: " + posY);
//        };

        adjustExamples();
    };

    /////////////////////////////////////////////////////////////////
    ////TESTING**************************************************
    /////////////////////////////////////////////////////////////////

    ////////////////////
    ////TEST METHOD
    ////////////////////
    function testMethod(desc, result, expected) {

        var
            resultType = checkType(result),
            pass = false;

        //console.log("desc: " + desc + " resultType: " + resultType);

        if(resultType === expected) {
            pass = true;
        } else {
            console.log("!" + desc + " test failed. expected: " + expected + ", resultType: " + resultType + ".");
        }

        return pass;
    };

    ////////////////////
    ////CHECK TYPE
    ////////////////////
    function checkType(obj) {
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
    ////TEST RETURNED VALUE
    ////////////////////
    function testReturnedValue(desc, result, expected) {

        var pass = false;

        if(result === expected) {
            pass = true;
        } else {
            console.log("!" + desc + " test failed. expected: " + expected + ", result: " + result + ".");
        }

        return pass;
    };

    ////////////////////
    ////TEST ARRAY
    ////////////////////
    function testArray(desc, resultArray, expectedLength, compareArray) {

        compareArray = compareArray || null;

        var
            pass = false, i,
            resLength = resultArray.length;

        if(compareArray === null) {
            //Just check length
            if(resLength === expectedLength) {
                pass = true;
            } else {
                console.log("!" + desc + " test failed. Array length: " + resLength + " did not match expected length: " + expectedLength);
            }
        } else {
            //Check if result matches testArray
            if (resLength === compareArray.length) {

                for(i = 0; i < resLength; i += 1) {
                   if(resultArray[i] === compareArray[i]) {
                       console.log("MATCH! resultArray: " + resultArray[i] + " compareArray: " + compareArray[i]);
                   } else {
                       console.log("NO MATCH! resultArray: " + resultArray[i] + " compareArray: " + compareArray[i]);
                   }
                }

            } else {
                console.log("!" + desc + " test failed.");
            }
        }

        return pass;
    };

    ////////////////////
    ////TEST ARRAY FOR VALUE
    ////////////////////
    function testArrayForValue(desc, testArray, expectedValue) {

        var i, pass = false;

        for(i = 0; i < testArray.length; i += 1) {
            if(testArray[i] === expectedValue) {
                pass = true;
            }
        }

        return pass;
    };

    ////////////////////
    ////STRINGIFY OBJ
    ////////////////////
    function stringifyObj(obj) {
        var info;
        try {
            info = JSON.stringify(obj);
        } catch (err) {}

        return info;
    };

    ////////////////////
    ////ADD TEST RESULT TO CONTAINER
    ////////////////////
    function addTestResultToContainer(testID, desc, result) {

        var
            testContainer = Spektral.getElement(testID),
            test = Spektral.createNewElement("div", testContainer);

        Spektral.setInnerText(test, desc);

        if(result === true) {
            Spektral.createSetAttribute(test, "class", "pass");
        } else {
            Spektral.createSetAttribute(test, "class", "fail");
        }
    };

}(window));

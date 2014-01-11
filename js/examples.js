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
        Spektral.loadJSON("json/documentation.json", onJSONLoaded);
    }

    ////////////////////
    ////ON JSON LOADED
    ////////////////////
    function onJSONLoaded(e) {
        jsonObject = e;
        Spektral.removeElement(listLoading);
        buildGlossary();
        initExamples();
    }

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
    }

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
    }

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
    }

    ////////////////////
    ////ON WINDOW RESIZE
    ////////////////////
    function onWindowResize(evt) {

        //adjustExamples();
    }

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
    }

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
        }

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
        }

        ////////////////////
        ////QUERY
        ////////////////////
        query();

        function query() {

            var
                testDiv = Spektral.query("#queryDiv"),
                testDivResult = testMethod("query", testDiv, "div");

            addTestResultToContainer("query", "A div with the id of queryDiv: ", testDivResult);
        }

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
            }
        }

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
            }
        }

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
        }

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
        }

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
        }

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
        }

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
        }

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
        }

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
        }

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

        }

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
        }

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
        }

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
        }

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
        }

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
        }

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
        }

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
        }

        //////////////////////
        ////GET ALL ELEMENTS
        //////////////////////
        getAllElements();

        function getAllElements() {

            var
                domElements = Spektral.getAllElements(),
                domElementIDs = Spektral.getAllElements("id"),
                leResult = testMethod("getAllElements", domElements, "array"),
                hasDivResult = testArrayForValue("getAllElements", domElements, "div"),
                hasIDResult = testArrayForValue("getAllElements", domElementIDs, "leDiv");

            addTestResultToContainer("getAllElements", "An array: ", leResult);
            addTestResultToContainer("getAllElements", "domElements contains divs: ", hasDivResult);
            addTestResultToContainer("getAllElements", "domElementIDs contains id of leDiv: ", hasIDResult);
        }

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
            }

            aelResult = testReturnedValue("attachEventListener", evtTriggered, true);

            addTestResultToContainer("attachEventListener", "Event has fired: ", aelResult);
        }

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
            }

            delResult = testReturnedValue("detachEventListener", evtTriggered, false);

            addTestResultToContainer("detachEventListener", "The evt was not triggered: ", delResult);
        }

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
            }

            ceResult = testReturnedValue("createEvent", evtTriggered, true);
            hasFoo = testReturnedValue("createEvent", foo, "bar");
            hasSpektral = testReturnedValue("createEvent", spektral, "js");

            addTestResultToContainer("createEvent", "Event was created and triggered: ", ceResult);
            addTestResultToContainer("createEvent", "Returned event has a parameter foo that returns the value bar: ", hasFoo);
            addTestResultToContainer("createEvent", "Returned event has a parameter spektral that returns the value js: ", hasSpektral);
        }

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
            }

            function onClickEvent(evt) {
                //Click event triggered
                defaultTriggered = true;
            }

            customResult = testReturnedValue("triggerEvent", customTriggered, true);
            defaultResult = testReturnedValue("triggerEvent", defaultTriggered, true);

            addTestResultToContainer("triggerEvent", "Custom event was triggered: ", customResult);
            addTestResultToContainer("triggerEvent", "Default event was triggered: ", defaultResult);
        }

        //////////////////////
        ////CANCEL EVENT
        //////////////////////
        cancelEvent();

        function cancelEvent() {

            var
                testAnchor = Spektral.getElement("ceAnchor"),
                ceResult, hash, hashCheck;

            Spektral.attachEventListener(testAnchor, "click", onClickEvent);

            Spektral.triggerEvent(testAnchor, "click");

            function onClickEvent(evt) {

                //Stops browser from navigating to href
                hashCheck = Spektral.createTimeOut(3, checkForHash);
                Spektral.cancelEvent(evt);
            }

            function checkForHash() {
                hash = Spektral.getHash();

                ceResult = testIsNotValue("cancelEvent", hash, "#ceHash");
                addTestResultToContainer("cancelEvent", "Hash is not #ceHash: ", ceResult);
            }
        }

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
            }

            cpResult = testReturnedValue("cancelPropagation", callCount, 1);

            addTestResultToContainer("cancelPropagation", "The function called only once: ", cpResult);
        }

        ////EVENT****END**************************************************

        ////MOUSE****START**************************************************

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
            }

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
            }

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
            }

            ////MOUSE****END**************************************************

            ////STRING****START**************************************************

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
            }

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
            }

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
            }

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
            }

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
            }
        }

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
        }

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
        }

        //////////////////////
        ////HAS PATTERN
        //////////////////////
        hasPattern();

        function hasPattern() {

            var
                testString = "This is a test string that contains Spektral. This is a test string that contains Spektral.",
                hasSpektral = Spektral.hasPattern(testString, "Spektral"),
                hpResult = testMethod("hasPattern", hasSpektral, "object"),
                spektralMatch = hasSpektral.match,
                spektralAmount = hasSpektral.amount,
                matchResult = testReturnedValue("hasPattern", spektralMatch, true),
                amountResult = testReturnedValue("hasPattern", spektralAmount, 2);

            addTestResultToContainer("hasPattern", "Method returned an object: ", hpResult);
            addTestResultToContainer("hasPattern", "Match is true: ", matchResult);
            addTestResultToContainer("hasPattern", "Amount is 2: ", amountResult);
        }

        ////STRING****END**************************************************

        ////ARRAY****START**************************************************

        //////////////////////
        ////CREATE ARRAY
        //////////////////////
        createArray();

        function createArray() {

            var xmlArray, caResult;

            Spektral.loadXML("xml/createarray.xml", onXMLLoaded);

            function onXMLLoaded(e) {

                xmlArray = Spektral.createArray(e.firstChild.childNodes);
                caResult = testMethod("createArray", xmlArray, "array");

                addTestResultToContainer("createArray", "An array: ", caResult);

                adjustExamples();
            }
        }

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
        }

        //////////////////////
        ////ARRAY HAS VALUE
        //////////////////////
        arrayHasValue();

        function arrayHasValue() {

            var
                testArray = ["Item", "Item", "Spektral", "Item"],
                hasSpektral = Spektral.arrayHasValue(testArray, "Spektral"),
                hasFoo = Spektral.arrayHasValue(testArray, "Foo"),
                hsResult = testReturnedValue("arrayHasValue", hasSpektral, true),
                hfResult = testReturnedValue("arrayHasValue", hasFoo, false);

            addTestResultToContainer("arrayHasValue", "Array has value \"Spektral\": ", hsResult);
            addTestResultToContainer("arrayHasValue", "Array doesn't have value \"Foo\": ", hfResult);
        }

        //////////////////////
        ////QUERY ARRAY
        //////////////////////
        queryArray();

        function queryArray() {

            var
                singleMatchArray = ["Bar", "Spektral", "Foo", "Bar"],
                multiMatchArray = ["Foo", "Spektral", "Bar", "Foo", "Spektral"],
                singleMatchResult = Spektral.queryArray(singleMatchArray, "Spektral"),
                multiMatchResult = Spektral.queryArray(multiMatchArray, "Spektral"),
                smResult = testMethod("queryArray", singleMatchResult, "string"),
                mmResult = testMethod("queryArray", multiMatchResult, "array");

            addTestResultToContainer("queryArray", "Single match query returns string: ", smResult);
            addTestResultToContainer("queryArray", "Multiple match query returns array: ", mmResult);
        }

        ////ARRAY****END**************************************************

        ////OBJECT****START**************************************************

        //////////////////////
        ////QUERY OBJECT
        //////////////////////
        queryObject();

        function queryObject() {

            var
                testObject = {"foo" : "bar", "spektral" : "js"},
                spektralValue = Spektral.queryObject(testObject, "spektral"),
                noKey = Spektral.queryObject(testObject, "nokey"),
                qoResult = testMethod("queryObject", spektralValue, "string"),
                spektralResult = testReturnedValue("queryObject", spektralValue, "js"),
                noKeyResult = testReturnedValue("queryObject", noKey, false);

            addTestResultToContainer("queryObject", "Method returned a string: ", qoResult);
            addTestResultToContainer("queryObject", "spektralValue = \"js\": ", spektralResult);
            addTestResultToContainer("queryObject", "noValue is false: ", noKeyResult);
        }

        //////////////////////
        ////OBJECT HAS KEY
        //////////////////////
        objectHasKey();

        function objectHasKey() {

            var
                testObject = {"foo" : "bar", "spektral" : "js"},
                hasFoo = Spektral.objectHasKey(testObject, "foo"),
                noKey = Spektral.objectHasKey(testObject, "nokey"),
                ohkResult = testMethod("objectHasKey", hasFoo, "boolean"),
                fooResult = testReturnedValue("objectHasKey", hasFoo, true),
                noKeyResult = testReturnedValue("objectHasKey", noKey, false);

            addTestResultToContainer("objectHasKey", "Method returned an object: ", ohkResult);
            addTestResultToContainer("objectHasKey", "hasFoo is true: ", fooResult);
            addTestResultToContainer("objectHasKey", "noKey is false: ", noKeyResult);
        }

        ////OBJECT****END**************************************************

        ////STYLE****START**************************************************

        //////////////////////
        ////SET STYLE
        //////////////////////
        setStyle();

        function setStyle() {

            var
                testDiv = Spektral.getElement("ssDiv"),
                pad, ssResult;

            Spektral.setStyle(testDiv, "padding: 20px");
            pad = Spektral.getStyle(testDiv, "padding");

            ssResult = testReturnedValue("setStyle", pad, "20px");
            addTestResultToContainer("setStyle", "Padding is set to 20px: ", ssResult);
        }

        //////////////////////
        ////GET STYLE
        //////////////////////
        getStyle();

        function getStyle() {

            var
                testDiv = Spektral.getElement("gsDiv"),
                pad = Spektral.getStyle(testDiv, "padding"),
                border = Spektral.getStyle(testDiv, "border"),
                hasPad = testReturnedValue("getStyle", pad, "20px"),
                hasBorder = testReturnedValue("getStyle", border, "1px solid rgb(0, 128, 0)");

            addTestResultToContainer("getStyle", "Padding is 20px: ", hasPad);
            addTestResultToContainer("getStyle", "Border is 1px solid green: ", hasBorder);
        }

        //////////////////////
        ////APPEND STYLE
        //////////////////////
        appendStyle();

        function appendStyle() {

            var
                testDiv = Spektral.getElement("asDiv"),
                pad, border, padResult, borderResult;

            Spektral.appendStyle(testDiv, "padding:10px");
            Spektral.appendStyle(testDiv, "border:2px solid red");

            pad = Spektral.getStyle(testDiv, "padding");
            border = Spektral.getStyle(testDiv, "border");

            padResult = testReturnedValue(testDiv, pad, "10px");
            borderResult = testReturnedValue(testDiv, border, "2px solid rgb(255, 0, 0)");

            addTestResultToContainer("appendStyle", "Padding is now 10px: ", padResult);
            addTestResultToContainer("appendStyle", "Border is 2px solid rgb(255, 0, 0): ", borderResult);
        }

        //////////////////////
        ////CLEAR STYLE
        //////////////////////
        clearStyle();

        function clearStyle() {

            var
                testDiv = Spektral.getElement("csDiv"),
                hasStyle, csResult;

            Spektral.clearStyle(testDiv);
            hasStyle = Spektral.checkForAttribute(testDiv, "style");

            csResult = testReturnedValue("clearStyle", hasStyle, false);
            addTestResultToContainer("clearStyle", "Style attribute has been removed: ", csResult);
        }

        //////////////////////
        ////GET INLINE STYLE
        //////////////////////
        getInlineStyle();

        function getInlineStyle() {

            var
                testDiv = Spektral.getElement("gisDiv"),
                inlineStyleObj = Spektral.getInlineStyle(testDiv),
                padding = inlineStyleObj.padding, border = inlineStyleObj.border,
                gisResult = testMethod("getInlineStyle", inlineStyleObj, "object"),
                hasPadding = testReturnedValue("getInlineStyle", padding, "20px"),
                hasBorder = testReturnedValue("getInlineStyle", border, "1px solid rgb(0, 128, 0)");

            addTestResultToContainer("getInlineStyle", "Function returned an object: ", gisResult);
            addTestResultToContainer("getInlineStyle", "Padding value is 20px: ", hasPadding);
            addTestResultToContainer("getInlineStyle", "Border value is 1px solid rgb(0, 128, 0): ", hasBorder);
        }

        //////////////////////
        ////SHOW ELEMENT
        //////////////////////
        showElement();

        function showElement () {

            var
                displayDiv = Spektral.getElement("seDivOne"),
                visibilityDiv = Spektral.getElement("seDivTwo"),
                hasBlock, hasVis,
                displayResult, visResult;

            Spektral.showElement(displayDiv);
            Spektral.showElement(visibilityDiv);

            hasBlock = Spektral.getStyle(displayDiv, "display");
            hasVis = Spektral.getStyle(visibilityDiv, "visibility");

            displayResult = testReturnedValue("showElement", hasBlock, "block");
            visResult = testReturnedValue("showElement", hasVis, "visible");

            addTestResultToContainer("showElement", "seDivOne is visible: ", displayResult);
            addTestResultToContainer("showElement", "seDivTwo is visible: ", visResult);
        }

        //////////////////////
        ////HIDE ELEMENT
        //////////////////////
        hideElement();

        function hideElement() {

            var
                displayDiv = Spektral.getElement("heDivOne"),
                visibilityDiv = Spektral.getElement("heDivTwo"),
                dis, vis, disResult, visResult;

            Spektral.hideElement(displayDiv, true);
            Spektral.hideElement(visibilityDiv);

            dis = Spektral.getStyle(displayDiv, "display");
            vis = Spektral.getStyle(visibilityDiv, "visibility");

            disResult = testReturnedValue("hideElement", dis, "none");
            visResult = testReturnedValue("hideElement", vis, "hidden");

            addTestResultToContainer("hideElement", "heDivOne display property is set to none: ", disResult);
            addTestResultToContainer("hideElement", "heDivTwo visibility property is set to hidden: ", visResult);
        }

        //////////////////////
        ////TOGGLE VISIBILITY
        //////////////////////
        toggleVisibility();

        function toggleVisibility() {

            var
                hiddenDiv = Spektral.getElement("tvDivOne"),
                visibleDiv = Spektral.getElement("tvDivTwo"),
                hdVis, vdVis, hdResult, vdResult;

            //Show tvDivOne
            Spektral.toggleVisibility(hiddenDiv);
            //Hide tvDiveOne
            Spektral.toggleVisibility(hiddenDiv);

            //Hide tvDivTwo
            Spektral.toggleVisibility(visibleDiv);
            //Show tvDivTwo
            Spektral.toggleVisibility(visibleDiv);

            hdVis = Spektral.getStyle(hiddenDiv, "visibility");
            vdVis = Spektral.getStyle(visibleDiv, "visibility");

            hdResult = testReturnedValue("toggleVisibility", hdVis, "hidden");
            vdResult = testReturnedValue("toggleVisibility", vdVis, "visible");

            addTestResultToContainer("toggleVisibility", "tvDivOne's visibility property is set to hidden: ", hdResult);
            addTestResultToContainer("toggleVisibility", "tvDivTwo's visibility property is set to visible: ", vdResult);
        }

        //////////////////////
        ////TOGGLE DISPLAY
        //////////////////////
        toggleDisplay();

        function toggleDisplay() {

            var
                displayNone = Spektral.getElement("tdDivOne"),
                displayBlock = Spektral.getElement("tdDivTwo"),
                displayIB = Spektral.getElement("tdDivThree"),
                isNone, isBlock, isIB,
                noneResult, blockResult, ibResult;

            //Show displayNone
            Spektral.toggleDisplay(displayNone);
            //Hide displayNone
            Spektral.toggleDisplay(displayNone);

            //Hide displayBlock
            Spektral.toggleDisplay(displayBlock);
            //Show displayBlock
            Spektral.toggleDisplay(displayBlock);

            //Show displayIB
            Spektral.toggleDisplay(displayIB, "inline-block");

            isNone = Spektral.getStyle(displayNone, "display");
            isBlock = Spektral.getStyle(displayBlock, "display");
            isIB = Spektral.getStyle(displayIB, "display");

            noneResult = testReturnedValue("toggleDisplay", isNone, "none");
            blockResult = testReturnedValue("toggleDisplay", isBlock, "block");
            ibResult = testReturnedValue("toggleDisplay", isIB, "inline-block");

            addTestResultToContainer("toggleDisplay", "tdDivOne has its display set to none: ", noneResult);
            addTestResultToContainer("toggleDisplay", "tdDivTwo has its display set to block: ", blockResult);
            addTestResultToContainer("toggleDisplay", "tdDivThree has its display set to inline-block: ", ibResult);
        }

        //////////////////////
        ////MATCH HEIGHT
        //////////////////////
        matchHeight();

        function matchHeight() {

            var
                refElement = Spektral.getElement("mhDivOne"),
                targetElement = Spektral.getElement("mhDivTwo"),
                innerElement = Spektral.getElement("mhDivThree"),
                totalElement = Spektral.getElement("mhDivFour"),
                targetHeight, innerHeight, totalHeight,
                targetResult, innerResult, totalResult;

            Spektral.matchHeight(refElement, targetElement);
            Spektral.matchHeight(refElement, innerElement, "inner");
            Spektral.matchHeight(refElement, totalElement, "total");

            targetHeight = Spektral.getDimensions(targetElement).height;
            innerHeight = Spektral.getDimensions(innerElement).height;
            totalHeight = Spektral.getDimensions(totalElement).height;

            targetResult = testReturnedValue("matchHeight", targetHeight, 100);
            innerResult = testReturnedValue("matchHeight", innerHeight, 110);
            totalResult = testReturnedValue("matchHeight", totalHeight, 132);

            addTestResultToContainer("matchHeight", "mhDivTwo height is 100px: ", targetResult);
            addTestResultToContainer("matchHeight", "mhDivThree height is 110px: ", innerResult);
            addTestResultToContainer("matchHeight", "mhDivFour height is 132px: ", totalResult);
        }

        ////STYLE****END**************************************************

        ////AJAX****START**************************************************

        //////////////////////
        ////LOAD JSON
        //////////////////////
        loadJSON();

        function loadJSON() {

            var
                jsonObj, itemObj, key,
                item, value, num = 1,
                ljResult, titleResult, valueResult;

            Spektral.loadJSON("json/test.json", onJSONLoaded);

            function onJSONLoaded(data) {

                ljResult = testMethod("loadJSON", data, "object");

                addTestResultToContainer("loadJSON", "An object was returned: ", ljResult);

                jsonObj = data.items;

                for (key in jsonObj) {

                    itemObj = jsonObj[key];

                    item = itemObj.item;
                    value = itemObj.value;

                    titleResult = testReturnedValue("loadJSON", item, ("item" + num));
                    valueResult = testReturnedValue("loadJSON", value, ("value" + num));

                    addTestResultToContainer("loadJSON", ("item" + num + " was returned: "), titleResult);
                    addTestResultToContainer("loadJSON", ("value" + num + " was returned: "), valueResult);

                    num += 1;
                }

                adjustExamples();
            }
        }

        //////////////////////
        ////LOAD XML
        //////////////////////
        loadXML();

        function loadXML() {

            var
                items, i, name, id, val,
                lxResult, hasName, hasID, hasVal, num;

            Spektral.loadXML("xml/test.xml", onXMLLoaded);

            function onXMLLoaded(xmlDoc) {

                lxResult = testMethod("loadXML", xmlDoc, "document");

                addTestResultToContainer("loadXML", "XML document was returned: ", lxResult);

                items = Spektral.getChildNodes(xmlDoc.firstChild.childNodes[1]);

                for(i = 0; i < items.length; i += 1) {

                    name = items[i].nodeName;
                    id = Spektral.getAttributeValue(items[i], "id");
                    val = Spektral.getInnerText(items[i]);

                    num = (i + 1);

                    hasName = testReturnedValue("loadXML", name, "item");
                    hasID = testReturnedValue("loadXML", id, "Item" + num);
                    hasVal = testReturnedValue("loadXML", val, ("Inner content for item" + num));

                    addTestResultToContainer("loadXML", "Document has item node: ", hasName);
                    addTestResultToContainer("loadXML", ("Node has id of Item" + num + ": "), hasID);
                    addTestResultToContainer("loadXML", ("Node has value of \"Inner content for item" + num + "\": "), hasVal);
                }
            }
        }

        //////////////////////
        ////LOAD FILE
        //////////////////////
        loadFile();

        function loadFile() {

            var loadedText, lfResult, returnedText;

            Spektral.loadFile("txt/test.txt", onTxtLoaded);

            function onTxtLoaded(txt) {

                loadedText = txt;

                lfResult = testMethod("loadFile", txt, "string");
                returnedText = testReturnedValue("loadFile", loadedText, "Here is the text from test.txt");

                addTestResultToContainer("loadFile", "A string was returned: ", lfResult);
                addTestResultToContainer("loadFile", "String = \"Here is the text from test.txt\": ", returnedText);
            }
        }

        //////////////////////
        ////GET XHR
        //////////////////////
        getXHR();

        function getXHR() {

            var
                xhr = Spektral.getXHR(),
                xhrType = Spektral.getType(xhr),
                xhrResult = testReturnedValue("getXHR", xhrType, ["xmlhttprequest", "activexobject"]);

            addTestResultToContainer("getXHR", "Returned type is either XMLHttpRequest or ActiveXObject: ", xhrResult);
        }

        ////AJAX****END**************************************************

        ////UTILS****START**************************************************

        //////////////////////
        ////GET VIEWPORT SIZE
        //////////////////////
        getViewportSize();

        function getViewportSize() {

            var
                viewportSize = Spektral.getViewportSize(),
                vWidth = viewportSize.width,
                vHeight = viewportSize.height,
                winInnerWidth = window.innerWidth,
                winInnerHeight = window.innerHeight,
                gvsResult = testMethod("getViewportSize", viewportSize, "object"),
                hasWidth = testMethod("getViewportSize", vWidth, "number"),
                hasHeight = testMethod("getViewportSize", vHeight, "number"),
                widthCorrect = testReturnedValue("getViewportSize", vWidth, winInnerWidth),
                heightCorrect = testReturnedValue("getViewportSize", vHeight, winInnerHeight);


            addTestResultToContainer("getViewportSize", "An object was returned: ", gvsResult);
            addTestResultToContainer("getViewportSize", "Width is a number: ", hasWidth);
            addTestResultToContainer("getViewportSize", "Height is number: ", hasHeight);
            addTestResultToContainer("getViewportSize", "Width is correct: ", widthCorrect);
            addTestResultToContainer("getViewportSize", "Height is correct: ", heightCorrect);
        }

        //////////////////////
        ////ROUND NUM
        //////////////////////
        roundNum();

        function roundNum() {

            var
                unroundedNum = 23.45,
                roundDown = 27.8,
                roundedNum = Spektral.roundNum(unroundedNum),
                upRound = Spektral.roundNum(unroundedNum, "up"),
                downRound = Spektral.roundNum(roundDown, "down"),
                rnResult = testMethod("roundNum", roundedNum, "number"),
                isRounded = testReturnedValue("roundNum", roundedNum, 23),
                isUpRounded = testReturnedValue("roundNum", upRound, 24),
                isDownRounded = testReturnedValue("roundNum", downRound, 27);

            addTestResultToContainer("roundNum", "A number was returned: ", rnResult);
            addTestResultToContainer("roundNum", "Number is rounded: ", isRounded);
            addTestResultToContainer("roundNum", "Number is rounded up: ", isUpRounded);
            addTestResultToContainer("roundNum", "Number is rounded down: ", isDownRounded);
        }

        //////////////////////
        ////STRING TO NUM
        //////////////////////
        stringToNum();

        function stringToNum() {

            var
                tenPixels = "10px",
                fiveEms = "5em",
                twentyPoints = "20pt",
                ten = Spektral.stringToNum(tenPixels),
                five = Spektral.stringToNum(fiveEms),
                twenty = Spektral.stringToNum(twentyPoints),
                stnResult = testMethod("stringToNum", ten, "number"),
                isTen = testReturnedValue("stringToNum", ten, 10),
                isFive = testReturnedValue("stringToNum", five, 5),
                isTwenty = testReturnedValue("stringToNum", twenty, 20);

            addTestResultToContainer("stringToNum", "A number was returned: ", stnResult);
            addTestResultToContainer("stringToNum", "10px = 10: ", isTen);
            addTestResultToContainer("stringToNum", "5ems = 5: ", isFive);
            addTestResultToContainer("stringToNum", "20pt = 20: ", isTwenty);
        }

        //////////////////////
        ////GET KEY
        //////////////////////
        getKey();

        function getKey() {
            var
                enter = Spektral.getKey(13),
                up = Spektral.getKey(38),
                down = Spektral.getKey(40),
                isEnter = testReturnedValue("getKey", enter, "ENTER"),
                isUp = testReturnedValue("getKey", up, "UP"),
                isDown = testReturnedValue("getKey", down, "DOWN");

            addTestResultToContainer("getKey", "\"ENTER\" was returned: ", isEnter);
            addTestResultToContainer("getKey", "\"UP\" was returned: ", isUp);
            addTestResultToContainer("getKey", "\"DOWN\" was returned: ", isDown);
        }

        //////////////////////
        ////IS MATCH
        //////////////////////
        isMatch();

        function isMatch() {

            var
                itemA = "A string",
                itemB = 20,
                itemC = true,
                itemD = "Another string",
                itemE = false,
                itemF = 5,
                itemG = 20,
                stringMatch, numberMatch, booleanMatch,
                badMatchOne, badMatchTwo,
                imResult, isString, isNum, isBoolean,
                isBadOne, isBadTwo;

            //String - Compare types
            stringMatch = Spektral.isMatch(itemA, itemD, true);

            //Number - Compare values
            numberMatch = Spektral.isMatch(itemB, itemG);

            //Boolean - Compare types
            booleanMatch = Spektral.isMatch(itemC, itemE, true);

            //Compare a string with a number
            badMatchOne = Spektral.isMatch(itemA, itemB);

            //Compare a boolean type with a string type
            badMatchTwo = Spektral.isMatch(itemC, itemD, true);

            imResult = testMethod("isMatch", stringMatch, "boolean");
            isString = testReturnedValue("isMatch", stringMatch, true);
            isNum = testReturnedValue("isMatch", numberMatch, true);
            isBoolean = testReturnedValue("isMatch", booleanMatch, true);
            isBadOne = testReturnedValue("isMatch", badMatchOne, false);
            isBadTwo = testReturnedValue("isMatch", badMatchTwo, false);

            addTestResultToContainer("isMatch", "Method returned a boolean: ", imResult);
            addTestResultToContainer("isMatch", "stringMatch is true: ", isString);
            addTestResultToContainer("isMatch", "numberMatch is true: ", isNum);
            addTestResultToContainer("isMatch", "booleanMatch is true: ", isBoolean);
            addTestResultToContainer("isMatch", "badMatchOne is false: ", isBadOne);
            addTestResultToContainer("isMatch", "badMatchTwo is false: ", isBadTwo);
        }

        //////////////////////
        ////IS HTML ELEMENT
        //////////////////////
        isHTMLElement();

        function isHTMLElement() {

            var
                isEl = Spektral.isHTMLElement("div"),
                notEl = Spektral.isHTMLElement("iheDiv"),
                iheResult = testMethod("isHTMLElement", isEl, "boolean"),
                isElResult = testReturnedValue("isHTMLElement", isEl, true),
                notElResult = testReturnedValue("isHTMLElement", notEl, false);

            addTestResultToContainer("isHTMLElement", "Method returned a boolean: ", iheResult);
            addTestResultToContainer("isHTMLElement", "div is element in DOM: ", isElResult);
            addTestResultToContainer("isHTMLElement", "iheDiv is not an element node name: ", notElResult);

        }

        //////////////////////
        ////IS HTML ID
        //////////////////////
        isHTMLID();

        function isHTMLID() {

            var
                isID = Spektral.isHTMLID("ihiDiv"),
                notID = Spektral.isHTMLID("div"),
                ihiResult = testMethod("isHTMLID", isID, "boolean"),
                isIDResult = testReturnedValue("isHTMLID", isID, true),
                notIDResult = testReturnedValue("isHTMLID", notID, false);

            addTestResultToContainer("isHTMLID", "Method returned a boolean: ", ihiResult);
            addTestResultToContainer("isHTMLID", "ihiDiv is an id: ", isIDResult);
            addTestResultToContainer("isHTMLID", "div is not an id: ", notIDResult);
        }

        //////////////////////
        ////IS HTML NAME
        //////////////////////
        isHTMLName();

        function isHTMLName() {
            var
                isName = Spektral.isHTMLName("ihnTextArea"),
                notName = Spektral.isHTMLName("div"),
                ihnResult = testMethod("isHTMLName", isName, "boolean"),
                isNameResult = testReturnedValue("isHTMLName", isName, true),
                notNameResult = testReturnedValue("isHTMLName", notName, false);

            addTestResultToContainer("isHTMLName", "Method returned a boolean: ", ihnResult);
            addTestResultToContainer("isHTMLName", "ihnTextArea is a name: ", isNameResult);
            addTestResultToContainer("isHTMLName", "div is not a name: ", notNameResult);
        }

        //////////////////////
        ////GET POS
        //////////////////////
        getPos();

        function getPos() {

            var
                testDiv = Spektral.getElement("gpDiv"),
                testDivPos, viewport, divDim, elRect,
                dynTop, dynRight, dynBottom, dynLeft,
                X, Y, top, right, bottom, left,
                dX, dY, dTop, dRight, dBottom, dLeft,
                gpResult, XResult, YResult, topResult, rightResult, bottomResult, leftResult,
                dXResult, dYResult, dTopResult, dRightResult, dBottomResult, dLeftResult;

            //There is a lot of stuff populating on this page,
            // proper values for this test can't be taken
            //until the page completely loads
            Spektral.createTimeOut(5, testGetPos);

            function testGetPos() {

                testDivPos = Spektral.getPos(testDiv);
                viewport = Spektral.getViewportSize();
                divDim = Spektral.getDimensions(testDiv);
                elRect = testDiv.getBoundingClientRect();

                gpResult = testMethod("getPos", testDivPos, "object");

                //Determine what the right, left, and bottom positions of
                //the element should be relative to the document
                dynTop = elRect.top;
                dynRight = (viewport.width - elRect.right);
                dynBottom = (viewport.height - elRect.bottom);
                dynLeft = elRect.left;

                X = testDivPos.x;
                Y = testDivPos.y;
                top = testDivPos.top;
                right = testDivPos.right;
                bottom = testDivPos.bottom;
                left = testDivPos.left;

                XResult = testReturnedValue("XResult test", X, 20);
                YResult = testReturnedValue("YResult test", Y, 64);
                topResult = testReturnedValue("top test", top, 64);
                rightResult = testReturnedValue("right test", right, 20);
                bottomResult = testReturnedValue("bottom test", bottom, 204);
                leftResult = testReturnedValue("left test", left, 20);

                dX = testDivPos.dX;
                dY = testDivPos.dY;
                dTop = testDivPos.dTop;
                dRight = testDivPos.dRight;
                dBottom = testDivPos.dBottom;
                dLeft = testDivPos.dLeft;

                //Note: dBottom is returning a negative number because of the
                //populating of the examples list - will fix when I make a
                //more user friendly version of examples

                dXResult = testReturnedValue("dX test", dX, dynLeft);
                dYResult = testReturnedValue("dY test", dY, dynTop);
                dTopResult = testReturnedValue("dTop test", dTop, dynTop);
                dRightResult = testReturnedValue("dRight test", dRight, dynRight);
                dBottomResult = testReturnedValue("dBottom test", dBottom, dynBottom);
                dLeftResult = testReturnedValue("dLeft test", dLeft, dynLeft);

                //Test result for returned type
                addTestResultToContainer("getPos", "Method returned an object: ", gpResult);

                //Test result for x, y, top, right, bottom, left
                addTestResultToContainer("getPos", "X is 20: ", XResult);
                addTestResultToContainer("getPos", "Y is 64: ", YResult);
                addTestResultToContainer("getPos", "top is 64: ", topResult);
                addTestResultToContainer("getPos", "right is 20: ", rightResult);
                addTestResultToContainer("getPos", "bottom is 204: ", bottomResult);
                addTestResultToContainer("getPos", "left is 20: ", leftResult);

                //Test result for dX, dY, dTop, dRight, dBottom, dLeft
                addTestResultToContainer("getPos", "dX is " + Spektral.roundNum(dynLeft) + ": ", dXResult);
                addTestResultToContainer("getPos", "dY is " + Spektral.roundNum(dynTop) + ": ", dYResult);
                addTestResultToContainer("getPos", "dTop is " + Spektral.roundNum(dynTop) + ": ", dTopResult);
                addTestResultToContainer("getPos", "dRight is " + Spektral.roundNum(dynRight) + ": ", dRightResult);
                addTestResultToContainer("getPos", "dBottom is " + Spektral.roundNum(dynBottom) + ": ", dBottomResult);
                addTestResultToContainer("getPos", "dLeft is " + Spektral.roundNum(dynLeft) + ": ", dLeftResult);

                adjustExamples();
            }
        }

        //////////////////////
        ////GET DIMENSIONS
        //////////////////////
        getDimensions();

        function getDimensions() {

            var
                testDiv = Spektral.getElement("gdDiv"),
                borderDiv = Spektral.getElement("gdBorderDiv"),
                divDim = Spektral.getDimensions(testDiv),
                borderDim = Spektral.getDimensions(borderDiv),

                //width/height = width/height of element itself, no border/padding/margin
                width = Spektral.roundNum(divDim.width),
                height = divDim.height,

                //innerWidth/innerHeight = element width/height + padding
                innerWidth = divDim.innerWidth,
                innerHeight = divDim.innerHeight,

                //Padding
                padding = divDim.padding,
                paddingTop = divDim.paddingTop,
                paddingRight = divDim.paddingRight,
                paddingBottom = divDim.paddingBottom,
                paddingLeft = divDim.paddingLeft,

                //borderWidth/borderHeight = element width/height + border + padding
                borderWidth = divDim.borderWidth,
                borderHeight = divDim.borderHeight,

                //Border
                border = borderDim.border,
                borderTop = divDim.borderTop,
                borderRight = divDim.borderRight,
                borderBottom = divDim.borderBottom,
                borderLeft = divDim.borderLeft,

                //Margin
                margin = divDim.margin,
                marginTop = divDim.marginTop,
                marginRight = divDim.marginRight,
                marginBottom = divDim.marginBottom,
                marginLeft = divDim.marginLeft,

                //totalWidth/totalHeight = element width/height + padding + border + margin
                totalWidth = divDim.totalWidth,
                totalHeight = divDim.totalHeight,

                //testing
                dynWidth = getDynamicWidth(testDiv),
                gdResult = testMethod("getDimensions", divDim, "object"),

                widthResult = testReturnedValue("getDimensions", width, dynWidth),
                heightResult = testReturnedValue("getDimensions", height, 175),

                iWidthResult = testReturnedValue("getDimensions", innerWidth, (dynWidth + 25)),
                iHeightResult = testReturnedValue("getDimensions", innerHeight, 200),

                paddingResult = testReturnedValue("getDimensions", padding, "5px 10px 20px 15px"),
                padTopResult = testReturnedValue("getDimensions", paddingTop, 5),
                padRightResult = testReturnedValue("getDimensions", paddingRight, 10),
                padBottomResult = testReturnedValue("getDimensions", paddingBottom, 20),
                padLeftResult = testReturnedValue("getDimesions", paddingLeft, 15),

                bWidthResult = testReturnedValue("getDimensions", borderWidth, (dynWidth + 30)),
                bHeightResult = testReturnedValue("getDimensions", borderHeight, 205),

                borderResult = testReturnedValue("getDimensions", border, "1px solid rgb(241, 215, 178)"),
                borderTopResult = testReturnedValue("getDimensions", borderTop, 1),
                borderRightResult = testReturnedValue("getDimensions", borderRight, 2),
                borderBottomResult = testReturnedValue("getDimensions", borderBottom, 4),
                borderLeftResult = testReturnedValue("getDimensions", borderLeft, 3),

                marginResult = testReturnedValue("getDimensions", margin, "10px 5px 15px 20px"),
                marginTopResult = testReturnedValue("getDimensions", marginTop, 10),
                marginRightResult = testReturnedValue("getDimensions", marginRight, 5),
                marginBottomResult = testReturnedValue("getDimensions", marginBottom, 15),
                marginLeftResult = testReturnedValue("getDimensions", marginLeft, 20),

                totalWidthResult = testReturnedValue("getDimensions", totalWidth, (dynWidth + 55)),
                totalHeightResult = testReturnedValue("getDimensions", totalHeight, 230);

            addTestResultToContainer("getDimensions", "Method returned an object: ", gdResult);

            addTestResultToContainer("getDimensions", "width = " + dynWidth + ": ", widthResult);
            addTestResultToContainer("getDimensions", "height = 175: ", heightResult);

            addTestResultToContainer("getDimensions", "innerWidth = " + (dynWidth + 25) + ": ", iWidthResult);
            addTestResultToContainer("getDimensions", "innerHeight = 200: ", iHeightResult);

            addTestResultToContainer("getDimensions", "padding = 5px 10px 20px 15px: ", paddingResult);
            addTestResultToContainer("getDimensions", "paddingTop = 5: ", padTopResult);
            addTestResultToContainer("getDimensions", "paddingRight = 10: ", padRightResult);
            addTestResultToContainer("getDimensions", "paddingBottom = 20: ", padBottomResult);
            addTestResultToContainer("getDimensions", "paddingLeft = 15: ", padLeftResult);

            addTestResultToContainer("getDimensions", "borderWidth = " + (dynWidth + 28) + ": ", bWidthResult);
            addTestResultToContainer("getDimensions", "borderHeight = 205: ", bHeightResult);

            addTestResultToContainer("getDimensions", "border = 1px solid rgb(241, 215, 178): ", borderResult);
            addTestResultToContainer("getDimensions", "borderTop = 1: ", borderTopResult);
            addTestResultToContainer("getDimensions", "borderRight = 2: ", borderRightResult);
            addTestResultToContainer("getDimensions", "borderBottom = 4: ", borderBottomResult);
            addTestResultToContainer("getDimensions", "borderLeft = 3: ", borderLeftResult);

            addTestResultToContainer("getDimensions", "margin = 10px 5px 15px 20px: ", marginResult);
            addTestResultToContainer("getDimensions", "marginTop = 10: ", marginTopResult);
            addTestResultToContainer("getDimensions", "marginRight = 5: ", marginRightResult);
            addTestResultToContainer("getDimensions", "marginBottom = 15: ", marginBottomResult);
            addTestResultToContainer("getDimensions", "marginLeft = 20: ", marginLeftResult);

            addTestResultToContainer("getDimensions", "totalWidth = " + (dynWidth + 55) + ": ", totalWidthResult);
            addTestResultToContainer("getDimensions", "totalHeight = 230: ", totalHeightResult);

            //I want to use an non Spektral method to ensure the width
            //is returning correctly in case Spektral.getStyle's
            //logic gets changed in the future
            function getDynamicWidth(element) {

                var widthStr, returnedWidth;

                try {
                    widthStr = element.currentStyle["width"];
                } catch(err) {
                    widthStr = document.defaultView.getComputedStyle(element, null).getPropertyValue("width");
                }

                returnedWidth = parseInt(widthStr, 10);
                returnedWidth = Math.round(returnedWidth);

                return returnedWidth;
            }
        }

        //////////////////////
        ////IS OBJECT EMPTY
        //////////////////////
        isObjectEmpty();

        function isObjectEmpty() {

            var
                emptyObject = {},
                populatedObject = {"foo" : "bar", "foo" : "bar"},
                emptyArray = [],
                populatedArray = ["foo", "foo", "bar"],
                emptyObjCheck = Spektral.isObjectEmpty(emptyObject),
                popObjCheck = Spektral.isObjectEmpty(populatedObject),
                emptyArrCheck = Spektral.isObjectEmpty(emptyArray),
                popArrCheck = Spektral.isObjectEmpty(populatedArray),

                ioeResult = testMethod("isObjectEmpty", populatedObject, "object"),
                emptyObjResult = testReturnedValue("isObjectEmpty", emptyObjCheck, true),
                popObjResult = testReturnedValue("isObjectEmpty", popObjCheck, false),
                emptyArrResult = testReturnedValue("isObjectEmpty", emptyArrCheck, true),
                popArrResult = testReturnedValue("isObjectEmpty", popArrCheck, false);

            addTestResultToContainer("isObjectEmpty", "Method returned an object: ", ioeResult);
            addTestResultToContainer("isObjectEmpty", "emptyObject is empty: ", emptyObjResult);
            addTestResultToContainer("isObjectEmpty", "populatedObject is populated: ", popObjResult);
            addTestResultToContainer("isObjectEmpty", "emptyArray is empty: ", emptyArrResult);
            addTestResultToContainer("isObjectEmpty", "populatedArray is populated: ", popArrResult)

        }

        //////////////////////
        ////GET INFO
        //////////////////////
        getInfo();

        function getInfo() {

            var
                testObject = {"foo" : "bar", "spektral" : "js"},
                objectInfo = Spektral.getInfo(testObject),
                giResult = testMethod("getInfo", objectInfo, "string"),
                stringTest = testReturnedValue("getInfo", objectInfo, "{\"foo\":\"bar\",\"spektral\":\"js\"}");

            addTestResultToContainer("getInfo", "Method returned a string: ", giResult);
            addTestResultToContainer("getInfo", "String returned = \"{\"foo\":\"bar\",\"spektral\":\"js\"}\": ", stringTest);
        }

        //////////////////////
        ////IS ELEMENT
        //////////////////////
        isElement();

        function isElement() {

            var
                testDiv = Spektral.getElement("ieDiv"),
                nonElement = "This is not an element",
                elementCheck = Spektral.isElement(testDiv),
                nonElementCheck = Spektral.isElement(nonElement),
                ieResult = testMethod("isElement", elementCheck, "boolean"),
                elementIsTrue = testReturnedValue("isElement", elementCheck, true),
                elementIsFalse = testReturnedValue("isElement", nonElementCheck, false);

            addTestResultToContainer("isElement", "Method returned a boolean: ", ieResult);
            addTestResultToContainer("isElement", "testDiv is an element: ", elementIsTrue);
            addTestResultToContainer("isElement", "string is not an element: ", elementIsFalse);
        }

        //////////////////////
        ////GET ELEMENT IDENTIFIERS
        //////////////////////
        getElementIdentifiers();

        function getElementIdentifiers() {

            var
                testDiv = Spektral.getElement("geiDiv"),
                testTa = Spektral.getElement("geiTextArea"),
                divIds = Spektral.getElementIdentifiers(testDiv),
                textIds = Spektral.getElementIdentifiers(testTa),
                divID = divIds.id,
                divClass = divIds.class,
                taName = textIds.name,
                taNodeName = textIds.node,
                geiResult = testMethod("getElementIdentifiers", divIds, "object"),
                hasID = testReturnedValue("getElementIdentifiers", divID, "geiDiv"),
                hasClass = testReturnedValue("getElementIdentifiers", divClass, "testDiv"),
                hasName = testReturnedValue("getElementIdentifiers", taName, "geiTextArea"),
                hasNode = testReturnedValue("getElementIdentifiers", taNodeName, "textarea");

            addTestResultToContainer("getElementIdentifiers", "Method returned an object: ", geiResult);
            addTestResultToContainer("getElementIdentifiers", "div has id of geiDiv: ", hasID);
            addTestResultToContainer("getElementIdentifiers", "div has class of testDiv: ", hasClass);
            addTestResultToContainer("getElementIdentifiers", "textarea has name of geiTextArea: ", hasName);
            addTestResultToContainer("getElementIdentifiers", "geiTextArea has node name of textarea: ", hasNode);
        }

        //////////////////////
        ////GET TYPE
        //////////////////////
        getType();

        function getType() {

            var
                testObject = {"foo" : "bar", "spektral" : "js"},
                testDiv = Spektral.getElement("gtDiv"),
                testString = "This is a test string for demonstrating getType.",
                testNumber = 25,
                objectType = Spektral.getType(testObject),
                divType = Spektral.getType(testDiv),
                stringType = Spektral.getType(testString),
                numberType = Spektral.getType(testNumber),
                gtResult = testMethod("getType", objectType, "string"),
                objectResult = testReturnedValue("getType", objectType, "object"),
                divResult = testReturnedValue("getType", divType, "div"),
                stringResult = testReturnedValue("getType", stringType, "string"),
                numberResult = testReturnedValue("getType", numberType, "number");

            addTestResultToContainer("getType", "Method returned a string: ", gtResult);
            addTestResultToContainer("getType", "testObject has type of object: ", objectResult);
            addTestResultToContainer("getType", "testDiv has type of div: ", divResult);
            addTestResultToContainer("getType", "testString has type of string: ", stringResult);
            addTestResultToContainer("getType", "testNumber has type of string: ", numberResult);
        }

        //////////////////////
        ////GET EXTENSION
        //////////////////////
        getExtension();

        function getExtension() {

            var
                jpgString = "imageOne.jpg",
                txtString = "data.txt",
                jsonString = "data.json",
                multiplePeriods = "a.file.with.multiple.periods.png",
                jpgExt = Spektral.getExtension(jpgString),
                txtExt = Spektral.getExtension(txtString),
                jsonExt = Spektral.getExtension(jsonString),
                multiExt = Spektral.getExtension(multiplePeriods),
                geResult = testMethod("getExtension", jpgExt, "string"),
                jpgResult = testReturnedValue("getExtension", jpgExt, "jpg"),
                txtResult = testReturnedValue("getExtension", txtExt, "txt"),
                jsonResult = testReturnedValue("getExtension", jsonExt, "json"),
                multiResult = testReturnedValue("getExtension", multiExt, "png");

            addTestResultToContainer("getExtension", "Method returned a string: ", geResult);
            addTestResultToContainer("getExtension", "jpgString has extension of jpg: ", jpgResult);
            addTestResultToContainer("getExtension", "txtString has extension of txt: ", txtResult);
            addTestResultToContainer("getExtension", "jsonString has extension of json: ", jsonResult);
            addTestResultToContainer("getExtension", "multiPeriods has extension of png: ", multiResult);
        }

        //////////////////////
        ////GET URL PATH
        //////////////////////
        getURLPath();

        function getURLPath() {

            Spektral.setHash("#testHash");

            var
                currentHost = window.location.hostname,
                urlObj = Spektral.getURLPath(),
                protocol = urlObj.protocol,
                host = urlObj.host,
                path = urlObj.path,
                pathArray = urlObj.pathArray,
                fileType = urlObj.fileType,
                hash = urlObj.hash,
                fullURL = urlObj.fullURL,
                gupResult = testMethod("getURLPath", urlObj, "object"),
                protocolResult = testReturnedValue("getURLPath", protocol, "http"),
                hostResult = testReturnedValue("getURLPath", host, currentHost),
                pathResult = testReturnedValue("getURLPath", path, "/spektraljs/examples.html"),
                pathArrayResult = testMethod("getURLPath", pathArray, "array"),
                fileTypeResult = testReturnedValue("getURLPath", fileType, "html"),
                hashResult = testReturnedValue("getURLPath", hash, "#testHash"),
                fullURLResult = testReturnedValue("getURLPath", fullURL, "http://" + currentHost + "/spektraljs/examples.html?valueOne=foo&valueTwo=bar&valueThree=spektral#testHash");

            addTestResultToContainer("getURLPath", "Method returns object: ", gupResult);
            addTestResultToContainer("getURLPath", "protocol is http: ", protocolResult);
            addTestResultToContainer("getURLPath", "host is " + currentHost + ": ", hostResult);
            addTestResultToContainer("getURLPath", "path is /spektraljs/examples.html: ", pathResult);
            addTestResultToContainer("getURLPath", "pathArray is an array: ", pathArrayResult);
            addTestResultToContainer("getURLPath", "fileType is html: ", fileTypeResult);
            addTestResultToContainer("getURLPath", "hash is #testHash: ", hashResult);
            addTestResultToContainer("getURLPath", "fullURL is http://" + currentHost + "/spektraljs/examples.html#testHash: ", fullURLResult);
        }

        //////////////////////
        ////SET HASH
        //////////////////////
        setHash();

        function setHash() {

            Spektral.setHash("#setHash");

            var
                hash = Spektral.getHash(),
                hashSet = testReturnedValue("setHash", hash, "#setHash");

            addTestResultToContainer("setHash", "hash was set to #setHash: ", hashSet);
        }

        //////////////////////
        ////GET HASH
        //////////////////////
        getHash();

        function getHash() {

            var
                hash = Spektral.getHash(),
                ghResult = testMethod("getHash", hash, "string"),
                isHash = testReturnedValue("getHash", hash, "#setHash");

            addTestResultToContainer("getHash", "Method returned a string: ", ghResult);
            addTestResultToContainer("getHash", "hash is #setHash: ", isHash);
        }

        //////////////////////
        ////HASH DETECTED
        //////////////////////
        hashDetected();

        function hashDetected() {

            var
                hashDetected = Spektral.hashDetected(),
                hdResult = testMethod("hashDetected", hashDetected, "boolean"),
                hasHash = testReturnedValue("hashDetected", hashDetected, true);

            addTestResultToContainer("hashDetected", "Method returned a boolean: ", hdResult);
            addTestResultToContainer("hashDetected", "hashDetected is true: ", hasHash);
        }

        //////////////////////
        ////GET QUERY STRING
        //////////////////////
        getQueryString();

        function getQueryString() {

            //Test string = ?valueOne=foo&valueTwo=bar&valueThree=spektral

            var
                queryObj = Spektral.getQueryString(),
                valTwo = queryObj.valueTwo,
                gqsResult = testMethod("getQueryString", queryObj, "object"),
                checkValTwo = testReturnedValue("getQueryString", valTwo, "bar");

            addTestResultToContainer("getQueryString", "Method returned an object: ", gqsResult);
            addTestResultToContainer("getQueryString", "valTwo = \"bar\": ", checkValTwo);
        }

        //////////////////////
        ////GET QUERY STRING
        //////////////////////
        setQueryString();

        function setQueryString() {

            Spektral.setQueryString("valueFour=foobar");
        }

        adjustExamples();
    }

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
            console.warn("!" + desc + " failed. expected: " + expected + ", resultType: " + resultType + ".");
        }

        return pass;
    }

    ////////////////////
    ////CHECK TYPE
    ////////////////////
    function checkType(obj) {
        var type;
        if (obj.nodeName !== undefined) {
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
    }

    ////////////////////
    ////TEST RETURNED VALUE
    ////////////////////
    function testReturnedValue(desc, result, expected) {

        var
            pass = false,
            expectedType = checkType(expected), i;

        if(expectedType === "array") {

            for (i = 0; i < expected.length; i += 1) {
                if (result === expected[i]) {
                    pass = true;
                }
            }
        } else {

            if (result === expected) {
                pass = true;
            } else {
                console.warn("!" + desc + " failed. expected: " + expected + ", result: " + result + ".");
            }
        }
        return pass;
    }

    ////////////////////
    ////TEST IS NOT VALUE
    ////////////////////
    function testIsNotValue(desc, result, notExpected) {

        var pass = false;

        if(result !== notExpected) {
            pass = true;
        } else {
            console.warn("!" + desc + " failed. Result matches with not expected.");
        }
        return pass;
    }

    ////////////////////
    ////TEST ARRAY - NOT IN USE!!!
    ////////////////////
//    function testArray(desc, resultArray, expectedLength, compareArray) {
//
//        compareArray = compareArray || null;
//
//        var
//            pass = false, i,
//            resLength = resultArray.length;
//
//        if (compareArray === null) {
//            //Just check length
//            if (resLength === expectedLength) {
//                pass = true;
//            } else {
//                console.log("!" + desc + " test failed. Array length: " + resLength + " did not match expected length: " + expectedLength);
//            }
//        } else {
//            //Check if result matches testArray
//            if (resLength === compareArray.length) {
//
//                for (i = 0; i < resLength; i += 1) {
//                   if (resultArray[i] === compareArray[i]) {
//                       console.log("MATCH! resultArray: " + resultArray[i] + " compareArray: " + compareArray[i]);
//                   } else {
//                       console.log("NO MATCH! resultArray: " + resultArray[i] + " compareArray: " + compareArray[i]);
//                   }
//                }
//
//            } else {
//                console.log("!" + desc + " test failed.");
//            }
//        }
//
//        return pass;
//    }

    ////////////////////
    ////TEST ARRAY FOR VALUE
    ////////////////////
    function testArrayForValue(desc, testArray, expectedValue) {

        var i, pass = false;

        for (i = 0; i < testArray.length; i += 1) {
            if(testArray[i] === expectedValue) {
                pass = true;
            }
        }

        return pass;
    }

    ////////////////////
    ////STRINGIFY OBJ
    ////////////////////
    function stringifyObj(obj) {
        var info;
        try {
            info = JSON.stringify(obj);
        } catch (err) {}

        return info;
    }

    ////////////////////
    ////ADD TEST RESULT TO CONTAINER
    ////////////////////
    function addTestResultToContainer(testID, desc, result) {

        var
            testContainer = Spektral.getElement(testID),
            test = Spektral.createNewElement("div", testContainer);

        Spektral.setInnerText(test, desc);

        if (result === true) {
            Spektral.createSetAttribute(test, "class", "pass");
        } else {
            Spektral.createSetAttribute(test, "class", "fail");
        }
    }

}(window));

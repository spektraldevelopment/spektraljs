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

            infoHeight = Spektral.getDimensions(infoHolder[i]).height
            elHeight = Spektral.getDimensions(elHolder[i]).height

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

        ////////////////////
        ////GET ELEMENT
        ////////////////////
        getElement();

        function getElement() {

            var
                testDivOne = Spektral.getElement("geTestOne"),
                testDivOneResult = testMethod("getElement()", testDivOne, "div"),

                testDivTwo = Spektral.getElement("geTestTwo"),
                testDivTwoResult = testMethod("getElement()", testDivTwo, "div"),

                testDivThree = Spektral.getElement("geTestThree"),
                testDivThreeResult = testMethod("getElement()", testDivThree, "textarea");

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
                testDivsResult = testMethod("getElementByClass()", testDivs, "nodelist"),

                testDivTwo = Spektral.getElementByClass("gebc", 1),
                testDivTwoResult = testMethod("getElementByClass()", testDivTwo, "div");

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

        ///////////////////////
        ////CREATE NEW ELEMENT
        //////////////////////
        createNewElement();

        function createNewElement() {

            var
                container = Spektral.getElement("cNEContainer"),
                createdDiv = Spektral.createNewElement("div", container, "newlyCreatedDiv"),
                createdImg = Spektral.createNewElement("img", container, "newlyCreatedImg"),
                createdDivResult = testMethod("createNewElement", createdDiv, "div"),
                createdImgResult = testMethod("createNewElement", createdImg, "img");

            //Set class for div and text for div
            Spektral.createSetAttribute(createdDiv, "class", "testDiv");
            Spektral.setTextContent(createdDiv, "div - id=\"newlyCreatedDiv\"");

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
            Spektral.setTextContent(container, "div - parent container");

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

            addTestResultToContainer("getAttributeValue", "Value of attribute returned as string: ", srcValueResult)
        };

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

        console.log("desc: " + desc + " resultType: " + resultType);

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

        Spektral.setTextContent(test, desc);

        if(result === true) {
            Spektral.createSetAttribute(test, "class", "pass");
        } else {
            Spektral.createSetAttribute(test, "class", "fail");
        }
    };

}(window));

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

    ////////////////////////////////////////////////
    ////**************TESTING**********************
    ////////////////////////////////////////////////

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
            addTestResultToContainer("getElement", "A div with the class of Class: ", testDivTwoResult);
            addTestResultToContainer("getElement", "Name: ", testDivThreeResult);

            adjustExamples();
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

            adjustExamples();
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

            adjustExamples();
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

            adjustExamples();
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
                Spektral.log("targetID: " + targetID);
            };
        };
    };

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

    ////////////////////
    ////ADJUST HEIGHTS
    ////////////////////
    function adjustHeights(elem) {
        var fontstep = 2;
        if ($(elem).height()>$(elem).parent().height() || $(elem).width()>$(elem).parent().width()) {
            $(elem).css('font-size',(($(elem).css('font-size').substr(0,2)-fontstep)) + 'px').css('line-height',(($(elem).css('font-size').substr(0,2))) + 'px');
            adjustHeights(elem);
        }
    };

}(window));

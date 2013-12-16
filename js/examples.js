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
        adjustExamples();
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
    };

    ////////////////////
    ////BUILD GLOSSARY
    ////////////////////
    function buildGlossary() {

        var key, catSection, catTitle;
        for (key in jsonObject) {

            catSection = Spektral.createNewElement("div", key + "Section", glossary);
            Spektral.createSetAttribute(catSection, "class", "glossSection");

            catTitle = Spektral.createNewElement("h2", "", catSection);
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

        catList = Spektral.createNewElement("ul", cat, section);

        for (key in catObject) {

            item = catObject[key];
            listItem = Spektral.createNewElement("li", "item" + itemNum, catList);
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

        adjustExamples();
    };

    ////////////////////
    ////ADJUST EXAMPLES
    ////////////////////
    function adjustExamples() {
        var
            infoHolder = Spektral.getElement("innerInfoHolder"),
            elHolder = Spektral.getElement("innerElementHolder"),
            infoHeight = Spektral.getDimensions(infoHolder).height,
            elHeight = Spektral.getDimensions(elHolder).height;

        if(infoHeight >= elHeight) {
            Spektral.matchHeight(infoHolder, elHolder);
        } else {
            Spektral.matchHeight(elHolder, infoHolder);
        }
    };

    ////////////////////////////////////////////////
    ////**************TESTING**********************
    ////////////////////////////////////////////////


    ////////////////////
    ////GET ELEMENT
    ////////////////////
    getElement();

    function getElement() {

        var
            geTestOne = Spektral.getElement("geTestOne"),
            geTestOneResult = testMethod("getElement()", geTestOne, "div"),
            geTestTwo = Spektral.getElement("geTestTwo"),
            geTestTwoResult = testMethod("getElement()", geTestTwo, "div");
//            geTestThree = Spektral.getElement("geTestThree"),
//            geTestThreeResult = testMethod("getElement()", geTestThree, "input");
    };


    ////////////////////
    ////TEST METHOD
    ////////////////////
    function testMethod(desc, result, expected) {

        var
            resultType = checkType(result),
            pass = false;

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

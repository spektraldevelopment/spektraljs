//Examples Spektral.js
(function(){

    //vars
    var
        jsonObject = {};

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
    }

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
    }

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

}(window));

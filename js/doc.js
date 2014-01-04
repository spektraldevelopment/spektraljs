//API Documentation Spektral.js
(function(){

    //vars
    var
        jsonObject = {},
        glossary = Spektral.getElement("glossary"),
        listLoading = Spektral.getElement("listLoading"),
        methodContainer = Spektral.getElement("methodContainer");

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
        Spektral.loadJSON("json/documentation.json", onJSONLoaded);
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

            catSection = Spektral.createNewElement("div", glossary, key + "Section");
            Spektral.createSetAttribute(catSection, "class", "glossSection");

            catTitle = Spektral.createNewElement("h2", catSection);
            catTitle.innerHTML = key;
            populateCategories(key, jsonObject[key], catSection);
        }
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

        scrollToTop(e);

        var
            target = Spektral.getTarget(e),
            targetID = Spektral.getTargetID(e),
            cat = Spektral.getParent(target).id,
            num = Spektral.stripString(targetID, "item");

        populateMethodContainer(cat, num);
    }

    ////////////////////
    ////POPULATE METHOD CONTAINER
    ////////////////////
    function populateMethodContainer(cat, id) {

        clearMethodContainer();

        var
            methodObject, title,
            description,
            code, params,
            paramsList, paramObj,
            parameter, paramTitle,
            paramDesc, returnsTitle, returns, depend,
            dependTitle, compatibilityTitle,
            compatibility, key,
            k, details, info;

          methodObject = jsonObject[cat][id];

        info = Spektral.getInfo(methodObject);
        //Spektral.log("Method info: " + info);

        title = Spektral.createNewElement("h2", methodContainer, "title");
        title.innerHTML = methodObject.title;

        description = Spektral.createNewElement("p", methodContainer, "description");
        description.innerHTML = methodObject.description;

        code = Spektral.createNewElement("code", methodContainer, "code");
        code.innerHTML = methodObject.code;

        params = Spektral.createNewElement("section", methodContainer, "params");

        paramsList = methodObject.params;

        parameter = Spektral.createNewElement("div", params, "paramContainer");

        if (Spektral.isObjectEmpty(paramsList) === false) {
            for (key in paramsList) {
            paramObj = paramsList[key];
                for(k in paramObj) {
                    paramTitle = Spektral.createNewElement("h3", parameter, "paramTitle");
                    paramTitle.innerHTML = k;

                    paramDesc = Spektral.createNewElement("p", parameter, "paramDesc");
                    paramDesc.innerHTML = paramObj[k];
                }
            }
        } else {
            paramDesc = Spektral.createNewElement("p", parameter, "paramDesc");
            paramDesc.innerHTML = "No parameters."
        }

        details = Spektral.createNewElement("section", methodContainer, "details");

        returnsTitle = Spektral.createNewElement("h3", details, "returnsTitle");
        returnsTitle.innerHTML = "Returns";

        returns = Spektral.createNewElement("p", details, "returns");
        returns.innerHTML = methodObject.returns;

        dependTitle = Spektral.createNewElement("h3", details, "dependTitle");
        dependTitle.innerHTML = "Dependencies";

        depend = Spektral.createNewElement("p", details, "dependencies");
        depend.innerHTML = methodObject.dependencies;

        compatibilityTitle = Spektral.createNewElement("h3", details, "compatibilityTitle");
        compatibilityTitle.innerHTML = "Compatibility";

        compatibility = Spektral.createNewElement("p", details, "compatibility");
        compatibility.innerHTML = methodObject.compatibility;

        TweenLite.to(methodContainer, 0.25, {opacity:"1", ease:Expo.easeIn});
    }

    ////////////////////
    ////CLEAR METHOD CONTAINER
    ////////////////////
    function clearMethodContainer() {
        Spektral.setStyle(methodContainer, "opacity:0");
        Spektral.clearAllChildren(methodContainer);
    }

    ////////////////////
    ////SCROLL TO TOP
    ////////////////////
    function scrollToTop(e) {
        TweenLite.to(window, 0.5, {scrollTo:{y:0}, ease: Expo.easeOut});
    }

}(window));

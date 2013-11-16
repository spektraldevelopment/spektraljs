//API Documentation Spektral.js
(function(){

    //vars
    var
        jsonObject = {},
        glossary = Spektral.getElement("glossary"),
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
        Spektral.loadJSON("js/documentation2.json", onJSONLoaded);
    }

    ////////////////////
    ////ON JSON LOADED
    ////////////////////
    function onJSONLoaded(e) {
        jsonObject = e;
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

        title = Spektral.createNewElement("h2", "title", methodContainer);
        title.innerHTML = methodObject.title;

        description = Spektral.createNewElement("p", "description", methodContainer);
        description.innerHTML = methodObject.description;

        code = Spektral.createNewElement("code", "code", methodContainer);
        code.innerHTML = methodObject.code;

        params = Spektral.createNewElement("section", "params", methodContainer);

        paramsList = methodObject.params;

        parameter = Spektral.createNewElement("div", "paramContainer", params);

        if (Spektral.isObjectEmpty(paramsList) === false) {
            for (key in paramsList) {
            //parameter = Spektral.createNewElement("div", "param" + key, params);
            paramObj = paramsList[key];
                for(k in paramObj) {
                    paramTitle = Spektral.createNewElement("h3", "paramTitle", parameter);
                    paramTitle.innerHTML = k;

                    paramDesc = Spektral.createNewElement("p", "paramDesc", parameter);
                    paramDesc.innerHTML = paramObj[k];
                }
            }
        } else {
            paramDesc = Spektral.createNewElement("p", "paramDesc", parameter);
            paramDesc.innerHTML = "No parameters."
        }

        details = Spektral.createNewElement("section", "details", methodContainer);

        returnsTitle = Spektral.createNewElement("h3", "returnsTitle", details);
        returnsTitle.innerHTML = "Returns";

        returns = Spektral.createNewElement("p", "returns", details);
        returns.innerHTML = methodObject.returns;

        dependTitle = Spektral.createNewElement("h3", "dependTitle", details);
        dependTitle.innerHTML = "Dependencies";

        depend = Spektral.createNewElement("p", "dependencies", details);
        depend.innerHTML = methodObject.dependencies;

        compatibilityTitle = Spektral.createNewElement("h3", "compatibilityTitle", details);
        compatibilityTitle.innerHTML = "Compatibility";

        compatibility = Spektral.createNewElement("p", "compatibility", details);
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

    var buttonGroup = Spektral.getElement("buttonGroup"), info;

    info = Spektral.getCSSStyle(buttonGroup, "margin-left");

    //Spektral.log("info: " + Spektral.getInfo(info));

}(window));

//API Documentation JS
(function(){

    //vars
    var
        jsonObject = {},
        glossList = Spektral.getElement("glossaryList"),
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
        Spektral.loadJSON("js/documentation.json", onJSONLoaded);
    }

    ////////////////////
    ////ON JSON LOADED
    ////////////////////
    function onJSONLoaded(e) {
        jsonObject = e.methods;
        buildGlossary();
    }

    ////////////////////
    ////BUILD GLOSSARY
    ////////////////////
    function buildGlossary() {
        var key, item, listItem;

        for (key in jsonObject) {
            item = jsonObject[key].title;

            listItem = Spektral.createNewElement("li", "item" + key, glossList);
            listItem.innerHTML = item;
            Spektral.attachEventListener(listItem, 'click', onListItemClick);
        }
    }

    ////////////////////
    ////ON LIST ITEM CLICK
    ////////////////////
    function onListItemClick (e) {

        scrollToTop(e);
        var target = Spektral.getTargetID(e), num = Spektral.stripString(target, "item");
        populateMethodContainer(num);
    }

    ////////////////////
    ////POPULATE METHOD CONTAINER
    ////////////////////
    function populateMethodContainer(id) {

        clearMethodContainer();

        var
            title,
            description,
            code, params,
            paramsList, paramObj,
            parameter, paramTitle,
            paramDesc, depend,
            dependTitle, compatibilityTitle,
            compatibility, key,
            k, details;

        title = Spektral.createNewElement("h2", "title", methodContainer);
        title.innerHTML = jsonObject[id].title;

        description = Spektral.createNewElement("p", "description", methodContainer);
        description.innerHTML = jsonObject[id].description;

        code = Spektral.createNewElement("code", "code", methodContainer);
        code.innerHTML = jsonObject[id].code;

        params = Spektral.createNewElement("section", "params", methodContainer);

        paramsList = jsonObject[id].params;

        parameter = Spektral.createNewElement("div", "param" + key, params);

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

        dependTitle = Spektral.createNewElement("h3", "dependTitle", details);
        dependTitle.innerHTML = "Dependencies";

        depend = Spektral.createNewElement("p", "dependencies", details);
        depend.innerHTML = jsonObject[id].dependencies;

        compatibilityTitle = Spektral.createNewElement("h3", "compatibilityTitle", details);
        compatibilityTitle.innerHTML = "Compatibility";

        compatibility = Spektral.createNewElement("p", "compatibility", details);
        compatibility.innerHTML = jsonObject[id].compatibility;


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

    var test = Spektral.isHTMLElement(methodContainer);
    console.log("test is HTML element?:" + test);

}(window));

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
        var target = Spektral.getTargetID(e), num = Spektral.stripString(target, "item");
        populateMethodContainer(num);
    }

    ////////////////////
    ////POPULATE METHOD CONTAINER
    ////////////////////
    function populateMethodContainer(id) {

        clearMethodContainer();

        var title, description, code, params, paramsList, paramObj, parameter, paramTitle, paramDesc, dependencies, support, i, key, k;

//        title = jsonObject[id].title;
//        description = jsonObject[id].description;
//        code = jsonObject[id].code;
//        params = jsonObject[id].params;
//        dependencies = jsonObject[id].dependencies;
//        support = jsonObject[id].support;

        title = Spektral.createNewElement("h2", "title", methodContainer);
        title.innerHTML = jsonObject[id].title;

        description = Spektral.createNewElement("p", "description", methodContainer);
        description.innerHTML = jsonObject[id].description;

        code = Spektral.createNewElement("code", "code", methodContainer);
        code.innerHTML = jsonObject[id].code;

        params = Spektral.createNewElement("section", "params", methodContainer);

        paramsList = jsonObject[id].params;

        if (Spektral.isObjectEmpty(paramsList) === false) {
            //Have to create a div with p tags in them for each
            for (key in paramsList) {
            parameter = Spektral.createNewElement("div", key, params);
            paramObj = paramsList[key];
                for(k in paramObj) {
                  //parameter.innerHTML = k + " : " + paramObj[k];
                  //Spektral.log("k is: " + k + " paramObj: " + paramObj[k]);
                    paramTitle = Spektral.createNewElement("h3", "paramTitle", parameter);
                    paramTitle.innerHTML = k;

                    paramDesc = Spektral.createNewElement("p", "paramDesc", parameter);
                    paramDesc.innerHTML = paramObj[k];
                }
            }
        } else {
            params.innerHTML = "Parameters: None."
        }

        TweenLite.to(methodContainer, 0.25, {opacity:"1", ease:Expo.easeIn});
    }

    ////////////////////
    ////CLEAR METHOD CONTAINER
    ////////////////////
    function clearMethodContainer() {
        Spektral.setStyle(methodContainer, "opacity:0");
        Spektral.clearAllChildren(methodContainer);
    }


}(window));

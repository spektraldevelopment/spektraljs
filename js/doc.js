//API Documentation JS
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

        var key;
        jsonObject = e;
        //Spektral.log("JSON Loaded: " + Spektral.getInfo(jsonObject));
    }

}(window));

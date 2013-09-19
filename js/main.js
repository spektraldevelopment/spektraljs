//console.log("Spektral: " + Spektral.about());

Spektral.attachEventListener(window, 'click', handleEvent);

function handleEvent(e)
{
    Spektral.detachEventListener(window, 'click', handleEvent);
    console.log("Handle Event");
}

Spektral.attachEventListener(window, 'keydown', onKeyEvent);

function onKeyEvent(e)
{
    var key = Spektral.getKey(e.keyCode);
    console.log("key: " + key);
}

var vHeight = Spektral.getViewportHeight();
var vWidth = Spektral.getViewportWidth();

console.log("vHeight: " + vHeight);
console.log("vWidth: " + vWidth);

var a = "dog";
var b = "cat";
var c = "dog";

var matchA = Spektral.isMatch(a, b);
var matchB = Spektral.isMatch(a, c);

console.log("b is dog?: " + matchA + " c is dog?: " + matchB);

var jsonString = {
    "projects" : [

        {
            "title" : "Project One",
            "hash" : "projectone",
            "thumb" : "img/placeholder.jpg",
            "desc" : "Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.",
            "url" : "#One"
        },
        {
            "title" : "Portfolio",
            "hash" : "projecttwo",
            "thumb" : "img/placeholder2.jpg",
            "desc" : "Lorem ipsum dolor sit amet.",
            "url" : "http://spektraldevelopment.com/projects/portfolio/"
        },
        {
            "title" : "Project Three",
            "hash" : "projectthree",
            "thumb" : "img/placeholder.jpg",
            "desc" : "Lorem ipsum dolor sit amet.",
            "url" : "#Three"
        },
        {
            "title" : "Project Four",
            "hash" : "projectfour",
            "thumb" : "img/placeholder2.jpg",
            "desc" : "Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.",
            "url" : "#Four"
        },
        {
            "title" : "Project Five",
            "hash" : "projectfive",
            "thumb" : "img/placeholder.jpg",
            "desc" : "Lorem ipsum dolor sit amet.",
            "url" : "#Five"
        },
        {
            "title" : "Project Six",
            "hash" : "projectsix",
            "thumb" : "img/placeholder2.jpg",
            "desc" : "Lorem ipsum dolor sit amet.",
            "url" : "#Six"
        }

    ]
}

var dataArrayA = Spektral.getParseJSON("js/data.json");
var dataArrayB = Spektral.getParseJSON(jsonString);

var s = "I'm a string";
var n = 33;
var b = true;
var o = {};
var a = [];

console.log("Type: " + Spektral.getType(s));
console.log("Type: " + Spektral.getType(n));
console.log("Type: " + Spektral.getType(b));
console.log("Type: " + Spektral.getType(o));
console.log("Type: " + Spektral.getType(a));



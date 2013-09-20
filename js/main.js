//console.log("Spektral: " + Spektral.about());

Spektral.debug();

console.log(Spektral.about());

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

console.log("Viewport Size: width: " + Spektral.getViewportSize().width + " height: " + Spektral.getViewportSize().height);

var a = "dog";
var b = "cat";
var c = "dog";

var matchA = Spektral.isMatch(a, b);
var matchB = Spektral.isMatch(a, c);

console.log("b is dog?: " + matchA + " c is dog?: " + matchB);

var jsonObject = {
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
};

var jsonFile = Spektral.loadJSON("js/data.json", onFileLoaded);

function onFileLoaded(d) {
    console.log("External json file ready for traversing.");
}
//var badData = Spektral.loadJSON([]);

var xmlFile = Spektral.loadXML("xml/content.xml", onXMLLoaded);

function onXMLLoaded(d) {
    var thumb4 = Spektral.getNodeValue(d, "header.thumb[4]");
    console.log("XML Data is ready: " + d);
}

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



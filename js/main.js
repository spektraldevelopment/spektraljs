//var spek = Spektral;
//spek.debug();
//spek.about();
Spektral.debug();

////
//var about = Spektral.about();
////
//console.log("About Spektral: " + about);
//Spektral.about();

//
//Spektral.attachEventListener(window, 'click', handleEvent);
//
//function handleEvent(e)
//{
//    Spektral.detachEventListener(window, 'click', handleEvent);
//    //console.log("Handle Event");
//}
//
//Spektral.attachEventListener(window, 'keydown', onKeyEvent);
//
//function onKeyEvent(e)
//{
//    var key = Spektral.getKey(e.keyCode);
//    //console.log("key: " + key);
//}
//
////console.log("Viewport Size: width: " + Spektral.getViewportSize().width + " height: " + Spektral.getViewportSize().height);
//
//var a = "dog";
//var b = "cat";
//var c = "dog";
//
//var matchA = Spektral.isMatch(a, b);
//var matchB = Spektral.isMatch(a, c);
//
////console.log("b is dog?: " + matchA + " c is dog?: " + matchB);
//
//var jsonObject = {
//    "projects" : [
//
//        {
//            "title" : "Project One",
//            "hash" : "projectone",
//            "thumb" : "img/placeholder.jpg",
//            "desc" : "Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.",
//            "url" : "#One"
//        },
//        {
//            "title" : "Portfolio",
//            "hash" : "projecttwo",
//            "thumb" : "img/placeholder2.jpg",
//            "desc" : "Lorem ipsum dolor sit amet.",
//            "url" : "http://spektraldevelopment.com/projects/portfolio/"
//        },
//        {
//            "title" : "Project Three",
//            "hash" : "projectthree",
//            "thumb" : "img/placeholder.jpg",
//            "desc" : "Lorem ipsum dolor sit amet.",
//            "url" : "#Three"
//        },
//        {
//            "title" : "Project Four",
//            "hash" : "projectfour",
//            "thumb" : "img/placeholder2.jpg",
//            "desc" : "Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.",
//            "url" : "#Four"
//        },
//        {
//            "title" : "Project Five",
//            "hash" : "projectfive",
//            "thumb" : "img/placeholder.jpg",
//            "desc" : "Lorem ipsum dolor sit amet.",
//            "url" : "#Five"
//        },
//        {
//            "title" : "Project Six",
//            "hash" : "projectsix",
//            "thumb" : "img/placeholder2.jpg",
//            "desc" : "Lorem ipsum dolor sit amet.",
//            "url" : "#Six"
//        }
//
//    ]
//};
//
var jsonFile = Spektral.loadJSON("js/data.json", onFileLoaded);
//
function onFileLoaded(jsonObj) {
    //console.log("JSON: " + jsonObj.projects[1].title);
    //console.log("External json file ready for traversing.");
}
//
//var multipleGroups = {
//    "groups" : [
//    {"group":[
//    {"item":"Group 1 Item 1 content","id":"Group 1 item 1 id"},
//    {"item":"Group 1 Item 2 content","id":"Group 1 item 2 id"}]},
//
//    {"group":[
//    {"item":"Group 2 Item 1 content","id":"Group 2 item 1 id"},
//    {"item":"Group 2 Item 2 content","id":"Group 2 item 2 id"}]}
//]};
//
//var xmlFile = Spektral.loadXML("xml/test.xml", onXMLLoaded);
//
//function onXMLLoaded(xmlDoc) {
//
//   var xmlObj = Spektral.xmlToJSON(xmlDoc);
//   //console.log("fullXML: " + Spektral.getInfo(xmlObj));
//
//   //var item = xmlObj.groups[0].group[0].item[0];
//
//   //console.log("item: " + item);
//}
//
//var s = "I'm a string";
//var n = 33;
//var b = true;
//var o = {};
//var a = [];
//
//console.log("Type: " + Spektral.getType(s));
//console.log("Type: " + Spektral.getType(n));
//console.log("Type: " + Spektral.getType(b));
//console.log("Type: " + Spektral.getType(o));
//console.log("Type: " + Spektral.getType(a));
//
//var square = "[square]";
//Spektral.stripBrackets(square);
//
//var round = "(round)";
//Spektral.stripBrackets(round);
//
//var curly = "[curly]";
//Spektral.stripBrackets(curly);
//
////var h = Spektral.getElement("header", 0);
////h.innerHTML = "Here's some new text.";
////
////var headingOne = Spektral.getElement("headingOne");
////headingOne.innerHTML = "h1 new text!";
////
////var sImage = Spektral.getElement("spektralImage");
////sImage.alt = "New alt description.";
////
////var newSection = Spektral.createNewElement("section", {parent: "paragraphOne"});//{parent: targetDiv}
////newSection.innerHTML = "This is a dynamically created section.";
////
////console.log("newSection: " + newSection);
//
////var badId = Spektral.getElement("nonExistent");
////
////console.log("badId: " + badId);
//
//var uList = Spektral.getElement("ul");
//
//console.log("uList: " + uList);
//
//var newItem = Spektral.createNewElement("li", "newItem", uList);
//newItem.innerHTML = "New Item";
//
//var item2 = Spektral.getElement("itemTwo");
//console.log("item2: " + item2);
//
//Spektral.moveToAfter(newItem, item2);
//
//var image = Spektral.getElement("spektralImage");

//Spektral.attachEventListener(image, "click", imageClick);
//
//function imageClick(e) {
//    console.log("Image Clicked!");
//    Spektral.detachEventListener(image, "click", imageClick);
//}
//
//var ol = Spektral.getElement("ol");
//Spektral.listNodeAttributes(ol);

//var qList = Spektral.query("ul.queryList");
//var qList = Spektral.getElement(".queryList");
//console.log("qList: " + qList);

//var qItems = Spektral.getElement(".queryItem");
//console.log("qItems: " + qItems);

//var ftr = Spektral.query("#mainFooter", false);
//Spektral.removeElement(ftr);
//ftr.innerHTML = "I changed the footer text.";

//var notFound = Spektral.getElement("notFound");
//console.log("Not Found: " + notFound);
var tt = Spektral.getElement("toggleTarget");
//Spektral.destroyAttribute(tt, "style");
//console.log("tt is: " + tt);
Spektral.getElementIdentifiers(tt);

var style = Spektral.getInlineStyle(tt);
//console.log("Style: " + style.margin);
//Spektral.rememberStyle(tt);

//Spektral.rememberInlineStyle(tt);

var toggVisibility = Spektral.getElement("toggleVis");
var toggDisplay = Spektral.getElement("toggleDis");

Spektral.attachEventListener(toggVisibility, "click", onToggVisClick);
Spektral.attachEventListener(toggDisplay, "click", onToggVisClick);

function onToggVisClick(e) {

    var target = Spektral.getTarget(e);
    var useType = Spektral.retrieveAttribute(target, "data-usetype");

    //Spektral.log("Togg clicked: useType: " + useType);
    //Spektral.toggleVisibility(tt, useType);
    if(useType === "display") {
        Spektral.toggleDisplay(tt);
    }

    if(useType === "visibility") {
        Spektral.toggleVisibility(tt);
    }
}

Spektral.attachEventListener("showElement", "click", hideShowElement);
Spektral.attachEventListener("hideElement", "click", hideShowElement);

function hideShowElement(e) {
    var target = Spektral.getTarget(e).id;
    if(target === "showElement") {
        //Spektral.log("Show Element");
        Spektral.showElement(tt);
    } else {
        Spektral.hideElement(tt, true);
        //Spektral.log("hideElement");
    }

};



//var ttMargin = Spektral.getStyle(tt, "margin");
//console.log("Margin: " + ttMargin);

//var ttSrc = Spektral.retrieveAttribute(tt, "src");
//console.log("ttSrc: " + ttSrc);

var headOne = Spektral.getElement("headingOne");
var headTwo = Spektral.getElement("headingTwo");

//Spektral.rememberInlineStyle(headOne);
//Spektral.rememberInlineStyle(headTwo);

//var headOneStyle = Spektral.queryInlineStyleLib("headingOne");

//console.log("headingONe padding-top: " + headOneStyle.paddingTop);

var tooManyHyphens = Spektral.convertToCamel("one-two-three-four");

//console.log("TOO MANY HYPHENS: " + tooManyHyphens);

Spektral.saveInlineStyle(tt);

var styleAttrs = Spektral.getInfo(Spektral.queryInlineStyleLib(tt));
//console.log("BEFORE styleAttrs: " + styleAttrs);

Spektral.updateLibItem(tt, "border:2px solid grey");

styleAttrs = Spektral.getInfo(Spektral.queryInlineStyleLib(tt));
//console.log("AFTER styleAttrs: " + styleAttrs);

//Perhaps make this work with having to define a var
var spektralEvent = Spektral.createEvent("Spektral");

Spektral.attachEventListener(window, "Spektral", onSpektralCalled);

function onSpektralCalled(e) {
    if (e.detail === undefined) {
        console.log("Event: " + e);
    } else {
        console.log("Custom Event: " + Spektral.getInfo(e.detail));
    }
};

window.dispatchEvent(spektralEvent);

var custEvent = Spektral.createEvent("custEvent", { id: "customEvent", message: "Here's a message from this custom event.", value: "5678"});

Spektral.attachEventListener(window, "custEvent", onSpektralCalled);

window.dispatchEvent(custEvent);

// var event = new Event('build');

// // Listen for the event.
// window.addEventListener('build', function (e) { console.log("This works!!!") }, false);

// // Dispatch the event.
// window.dispatchEvent(event);

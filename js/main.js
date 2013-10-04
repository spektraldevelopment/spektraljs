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
var toggVisibility = Spektral.getElement("toggleVis");

Spektral.attachEventListener(toggVisibility, "click", onToggVisClick);

function onToggVisClick() {
  Spektral.toggleVisibility(tt, true);
};



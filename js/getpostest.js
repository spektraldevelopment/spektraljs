(function(){

    Spektral.debug();

    var
        testDivOne = Spektral.getElement("testDivOne"),
        testDivTwo = Spektral.getElement("testDivTwo"),
        divOnePos = Spektral.getPos(testDivOne),
        X, Y, top, right, bottom, left,
        dX, dY, dTop, dRight, dBottom, dLeft,
        XResult, YResult, topResult, rightResult, bottomResult, leftResult;

    X = divOnePos.x;
    Y = divOnePos.y;
    top = divOnePos.top;
    right = divOnePos.right;
    bottom = divOnePos.bottom;
    left = divOnePos.left;

    //
    XResult = Spektral.testValue("XResult test", X, 10, true);
    YResult = Spektral.testValue("YResult test", Y, 10, true);
    topResult = Spektral.testValue("top test", top, 10, true);
    rightResult = Spektral.testValue("right test", right, 10, true);
    bottomResult = Spektral.testValue("bottom test", bottom, 49, true);
    leftResult = Spektral.testValue("left test", left, 10, true);



    console.log("divOnePos: " + Spektral.getInfo(divOnePos));

    console.log("GET POS TEST");

}(window));
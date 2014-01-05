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

    XResult = Spektral.testValue("XResult test", X, 10, true);
    YResult = Spektral.testValue("YResult test", Y, 9, true);

    console.log("divOnePos: " + Spektral.getInfo(divOnePos));

    console.log("GET POS TEST");

}(window));
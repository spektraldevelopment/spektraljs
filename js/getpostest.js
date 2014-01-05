(function(){

    Spektral.debug();

    var
        testDivOne = Spektral.getElement("testDivOne"),
        testDivTwo = Spektral.getElement("testDivTwo"),
        outputDiv = Spektral.getElement("output"), outputInfo = "",
        divOnePos = Spektral.getPos(testDivOne),
        viewport = Spektral.getViewportSize(),
        X, Y, top, right, bottom, left,
        dX, dY, dTop, dRight, dBottom, dLeft,
        XResult, YResult, topResult, rightResult, bottomResult, leftResult,
        dXResult, dYResult, dTopResult, dRightResult, dBottomResult, dLeftResult;

    X = divOnePos.x;
    Y = divOnePos.y;
    top = divOnePos.top;
    right = divOnePos.right;
    bottom = divOnePos.bottom;
    left = divOnePos.left;

    XResult = Spektral.testValue("XResult test", X, 10, true);
    YResult = Spektral.testValue("YResult test", Y, 10, true);
    topResult = Spektral.testValue("top test", top, 10, true);
    rightResult = Spektral.testValue("right test", right, 10, true);
    bottomResult = Spektral.testValue("bottom test", bottom, 49, true);
    leftResult = Spektral.testValue("left test", left, 10, true);

    dX = divOnePos.dX;
    dY = divOnePos.dY;
    dTop = divOnePos.dTop;
    dRight = divOnePos.dRight;
    dBottom = divOnePos.dBottom;
    dLeft = divOnePos.dLeft;

    dXResult = Spektral.testValue("dX test", dX, 168, true);
    dYResult = Spektral.testValue("dY test", dY, 170, true);
    dLeftResult = Spektral.testValue("dLeft test", dLeft, 168, true);
    dTopResult = Spektral.testValue("dTop test", dTop, 170, true);

    //console.log("dRight: " + dRight);
    console.log("dBottom: " + dBottom);

    Spektral.setInnerText(outputDiv, ": viewport: width: " + viewport.width + " height: " + viewport.height, true);
    Spektral.setInnerText(outputDiv, " | dBottom: " + dBottom, true);

    console.log("viewport: width: " + viewport.width + " height: " + viewport.height);

    console.log("GET POS TEST");

}(window));
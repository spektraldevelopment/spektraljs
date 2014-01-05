(function(){

    Spektral.debug();

    //Problem! The dLeft, dRight, and dBottom change
    //depending on sizing of browser

    var
        testDiv = Spektral.getElement("testDivOne"),
        outputDiv = Spektral.getElement("output"),
        divOnePos = Spektral.getPos(testDiv),
        viewport = Spektral.getViewportSize(),
        divDim = Spektral.getDimensions(testDiv),
        elRect = testDiv.getBoundingClientRect(),
        dynLeft, dynRight, dynBottom,
        X, Y, top, right, bottom, left,
        dX, dY, dTop, dRight, dBottom, dLeft,
        XResult, YResult, topResult, rightResult, bottomResult, leftResult,
        dXResult, dYResult, dTopResult, dRightResult, dBottomResult, dLeftResult;

    //Determine what the right, left, and bottom positions of
    //the element should be relative to the document
    dynLeft = elRect.left;
    dynRight = (elRect.right - divDim.borderWidth);
    dynBottom = (viewport.height - elRect.bottom);

    X = divOnePos.x;
    Y = divOnePos.y;
    top = divOnePos.top;
    right = divOnePos.right;
    bottom = divOnePos.bottom;
    left = divOnePos.left;

    XResult = Spektral.testValue("XResult test", X, 10, true);
    YResult = Spektral.testValue("YResult test", Y, 10, true);
    topResult = Spektral.testValue("top test", top, 10, true);
    rightResult = Spektral.testValue("right test", Spektral.roundNum(right), 861, true);
    bottomResult = Spektral.testValue("bottom test", bottom, 49, true);
    leftResult = Spektral.testValue("left test", left, 10, true);

    dX = divOnePos.dX;
    dY = divOnePos.dY;
    dTop = divOnePos.dTop;
    dRight = divOnePos.dRight;
    dBottom = divOnePos.dBottom;
    dLeft = divOnePos.dLeft;

    console.log("dRight: " + dRight);

    dXResult = Spektral.testValue("dX test", dX, dynLeft, true);
    dYResult = Spektral.testValue("dY test", dY, 170, true);
    dTopResult = Spektral.testValue("dTop test", dTop, 170, true);
    dRightResult = Spektral.testValue("dRight test", dRight, dynRight, true);
    dBottomResult = Spektral.testValue("dBottom test", dBottom, dynBottom, true);
    dLeftResult = Spektral.testValue("dLeft test", dLeft, dynLeft, true);

    Spektral.setInnerText(outputDiv, ": viewport: width: " + viewport.width + " height: " + viewport.height, true);
    Spektral.setInnerText(outputDiv, " | dBottom: " + dBottom, true);

    console.log("GET POS TEST");

}(window));
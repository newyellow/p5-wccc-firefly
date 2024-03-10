
function drawLightBall(_x, _y, _size, _targetCanvas) {

    _targetCanvas.blendMode(ADD);

    let layerDensity = random(0.06, 0.12);
    let layerCount = _size * layerDensity;

    let nowGlowCurve = random(glowCurves);

    for (let i = 0; i < layerCount; i++) {
        let t = i / layerCount;

        let nowSize = lerp(0, _size, t);

        let thicknessT = nowGlowCurve(t);
        let nowThickness = lerp(6, 0, thicknessT);

        drawLightCircle (_x, _y, nowSize, nowThickness, _targetCanvas);
    }

    // _targetCanvas.circle(_x, _y, _size);
}

function drawLightCircle(_x, _y, _size, _thickness, _targetCanvas) {
    let dotDensity = random(0.3, 0.8);
    let circleRadius = _size * 2 * PI;
    let dotCount = circleRadius * dotDensity;

    for(let i=0; i<dotCount; i++) {
        let t = i / dotCount;
        let nowAngle = lerp(0, 360, t);
        
        let nowX = _x + sin(radians(nowAngle)) * _size;
        let nowY = _y - cos(radians(nowAngle)) * _size;

        let nowSize = random(_thickness);

        let nowHue = processHue(60 + random(-30, 30));
        let nowSat = random(30, 60);
        let nowBri = random(80, 100);

        let nowColor = new NYColor(nowHue, nowSat, nowBri);

        if(random() < 0.2)
            continue;

        if(random() < 0.12) {
            nowColor.h = processHue(nowColor.h + 180);
        }

        _targetCanvas.fill(nowColor.h, nowColor.s, nowColor.b, nowColor.a);
        _targetCanvas.noStroke();
        _targetCanvas.ellipse(nowX, nowY, nowSize, nowSize);
    }
}

function drawGrassBranch(_fromX, _fromY, _toX, _toY, _thickness, _fromColor, _toColor, _sizeCurve, _posCurve, _targetCanvas) {
    let strokeDensity = 0.8;

    let strokeCount = dist(_fromX, _fromY, _toX, _toY) * strokeDensity;

    canvasFront.strokeWeight(3);

    for (let i = 0; i < strokeCount; i++) {
        let t = i / strokeCount;
        let sizeT = _sizeCurve(t);
        let posT = _posCurve(t);

        let nowX = lerp(_fromX, _toX, t);
        let nowY = lerp(_fromY, _toY, posT);

        let nowColor = NYLerpColor(_fromColor, _toColor, t);
        nowColor.slightRandomize(30, 40, 30);
        let nowSize = lerp(_thickness, 0, sizeT);

        _targetCanvas.stroke(nowColor.h, nowColor.s, nowColor.b, nowColor.a);
        _targetCanvas.push();
        _targetCanvas.translate(nowX, nowY);

        _targetCanvas.line(-0.5 * nowSize, 0, 0.5 * nowSize, 0);

        _targetCanvas.pop();
    }
}

function drawRipple(_x, _y, _width, _height, _thicknessT) {
    let dotDensity = 0.1;
    let dotCount = _width * _height * dotDensity;

    for (let i = 0; i < dotCount; i++) {
        let t = i / dotCount;
        let nowAngle = lerp(0, 360, t);
        let nowSizeRatio = sin(radians(lerp(0, 180, t))) * 0.5 + 0.5; // 0.5 ~ 1.0

        let nowX = _x + sin(radians(nowAngle)) * _width;
        let nowY = _y - cos(radians(nowAngle)) * _height;

        let nowSize = nowSizeRatio * 6 * easeInCubic(_thicknessT);

        let nowHue = processHue(mainHue + random(-30, 30) + 180);
        let nowSat = random(30, 60);
        let nowBri = random(80, 100);

        let nowColor = new NYColor(nowHue, nowSat, nowBri, 0.6 * _thicknessT);

        if (random() < 0.6)
            continue;

        if (random() < 0.6) {
            nowColor.s = 0;
            nowColor.b = 100;
        }

        if (random() < 0.12) {
            nowColor.h = processHue(nowColor.h + 180);
        }



        canvasRipples.fill(nowColor.h, nowColor.s, nowColor.b, nowColor.a);
        canvasRipples.noStroke();
        canvasRipples.ellipse(nowX, nowY, nowSize, nowSize);
    }
}
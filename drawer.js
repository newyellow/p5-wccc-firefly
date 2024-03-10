function drawGrassAndReflection(_x, _y, _toX, _toY, _thickness, _fromColor, _toColor, _sizeCurve, _posCurve) {

    // draw front
    drawGrassBranch(_x, _y, _toX, _toY, _thickness, _fromColor, _toColor, _sizeCurve, _posCurve, canvasFront);
  
    let reflectionY = _y - (_toY - _y);
    let newFromColor = _fromColor.copy();
    let newToColor = _toColor.copy();
    newFromColor.a = 0.6;
    newToColor.a = -0.6;
  
    // draw reflection
    drawGrassBranch(_x, _y, _toX, reflectionY, _thickness, newFromColor, newToColor, _sizeCurve, _posCurve, canvasReflection);
  }

function drawFirefly(_x, _y, _height, _heightT, _size) {

    let ballX = _x;
    let ballY = _y - _height;

    drawLightBall(ballX, ballY, _size * 0.5, 1.0, canvasFront);

    canvasRipples.blendMode(ADD);
    drawFireflyReflection(_x, _y, _heightT, _size);

    let reflectionBallY = _y + _height;
    drawLightBall(ballX, reflectionBallY, _size * 0.5, 0.2, canvasReflection);
}

function drawFireflyReflection(_x, _y, _heightT, _size) {
    let sizeMultiplier = lerp(2.4, 0.6, _heightT);
    let reflectionSize = _size * sizeMultiplier;

    let alpha = lerp(0.6, 0.1, _heightT);

    let lineDensity = 0.6;
    let lineCount = reflectionSize * circlePerspectiveRatio * lineDensity;

    let dotDensity = 0.6;

    for (let y = 0; y < lineCount; y++) {

        let t = y / (lineCount - 1);
        let centerYt = sin(radians(lerp(10, 170, t))) * 0.8 + 0.2;

        let lineWidthMultiplier = sin(radians(lerp(10, 170, t))) * 0.9 + 0.1;
        let lineWidth = reflectionSize * lineWidthMultiplier * 2;
        let dotCount = lineWidth * dotDensity;

        let circleYRadius = reflectionSize * circlePerspectiveRatio;
        let nowY = lerp(_y - circleYRadius, _y + circleYRadius, t);

        for (let x = 0; x < dotCount; x++) {
            let xt = x / (dotCount - 1);
            let alphaMultiplier = sin(radians(lerp(0, 180, xt))) * 0.9 + 0.1;


            let dotX = lerp(_x - lineWidth * 0.5, _x + lineWidth * 0.5, xt);
            let dotY = nowY;

            // wave noise
            let waveNoise = noise(dotX * 0.06, dotY * 0.03);

            // add wave y
            // dotY += getWaveValue(dotX, dotY);

            let nowSize = waveNoise * 3 * alphaMultiplier * centerYt;

            let nowColor = getRippleColor();
            nowColor.a = alpha * alphaMultiplier;
            // let nowColor = new NYColor(nowHue, nowSat, nowBri, alpha * alphaMultiplier);

            canvasRipples.fill(nowColor.h, nowColor.s, nowColor.b, nowColor.a);
            canvasRipples.noStroke();
            canvasRipples.circle(dotX, dotY, nowSize);
        }
    }
}

function drawLightBall(_x, _y, _size, _alpha, _targetCanvas) {

    _targetCanvas.blendMode(ADD);

    let layerDensity = random(0.12, 0.24);
    let layerCount = _size * layerDensity;

    let nowGlowCurve = random(glowCurves);

    for (let i = 0; i < layerCount; i++) {
        let t = i / layerCount;

        let nowSize = lerp(0, _size, t);

        let thicknessT = nowGlowCurve(t);
        let nowThickness = lerp(6, 0, thicknessT);

        drawLightCircle(_x, _y, nowSize, nowThickness, _alpha, _targetCanvas);
    }

    // _targetCanvas.circle(_x, _y, _size);
}

function drawLightCircle(_x, _y, _size, _thickness, _alpha, _targetCanvas) {
    let dotDensity = random(0.3, 0.8);
    let circleRadius = _size * 2 * PI;
    let dotCount = circleRadius * dotDensity;

    for (let i = 0; i < dotCount; i++) {
        let t = i / dotCount;
        let nowAngle = lerp(0, 360, t);

        let nowX = _x + sin(radians(nowAngle)) * _size;
        let nowY = _y - cos(radians(nowAngle)) * _size;

        let nowSize = random(_thickness);

        let nowColor = getFireflyColor();
        nowColor.a = _alpha;
        
        if (random() < 0.2)
            continue;

        _targetCanvas.fill(nowColor.h, nowColor.s, nowColor.b, nowColor.a);
        _targetCanvas.noStroke();
        _targetCanvas.ellipse(nowX, nowY, nowSize, nowSize);
    }
}

function drawGrassBranch(_fromX, _fromY, _toX, _toY, _thickness, _fromColor, _toColor, _sizeCurve, _posCurve, _targetCanvas) {
    let strokeDensity = 0.8;

    let strokeCount = dist(_fromX, _fromY, _toX, _toY) * strokeDensity;

    canvasFront.strokeWeight(1);

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
    let dotDensity = 0.12;
    let dotCount = _width * _height * dotDensity;

    for (let i = 0; i < dotCount; i++) {
        let t = i / dotCount;
        let nowAngle = lerp(0, 360, t);
        let nowSizeRatio = sin(radians(lerp(0, 180, t))) * 0.5 + 0.5; // 0.5 ~ 1.0

        let nowX = _x + sin(radians(nowAngle)) * _width;
        let nowY = _y - cos(radians(nowAngle)) * _height;

        nowY += getWaveValue(nowX, nowY);

        let nowSize = nowSizeRatio * 6 * easeInSine(_thicknessT);

        let nowColor = getRippleColor();
        nowColor.a = 0.3 * _thicknessT;

        if (random() < 0.6)
            continue;

        canvasRipples.fill(nowColor.h, nowColor.s, nowColor.b, nowColor.a);
        canvasRipples.noStroke();
        canvasRipples.ellipse(nowX, nowY, nowSize, nowSize);
    }
}

let waveHeight = 1;
let waveStrength = 3;

function getWaveValue(_x, _y) {
    let waveValue = (_x * waveStrength) % 360;
    return (sin(radians(waveValue)) * 2 - 1) * waveHeight;
}
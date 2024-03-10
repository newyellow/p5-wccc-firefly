// Weekly Creative Coding Challenge Topic 'Firefly'
//
// Check the challenge page if you would like to join:
// https://openprocessing.org/curation/78544 
//

let canvasFront;
let canvasRipples;
let canvasReflection;

let canvasDensity = 3;

// need to put curves later due to the import order
let sizeCurves = [];
let posCurves = [];
let glowCurves = [];

let circlePerspectiveRatio = 0.4;
let baseGrassHeight = 300;

let drawObjs = [];

let colorSet = {};
let baseGrassThickness = 3;

async function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  canvasFront = createGraphics(width, height);
  canvasRipples = createGraphics(width, height);
  canvasReflection = createGraphics(width, height);

  colorMode(HSB);
  canvasFront.colorMode(HSB);
  canvasRipples.colorMode(HSB);
  canvasReflection.colorMode(HSB);

  pixelDensity(canvasDensity);
  canvasFront.pixelDensity(canvasDensity);
  canvasRipples.pixelDensity(canvasDensity);
  canvasReflection.pixelDensity(canvasDensity);

  // prepare curves
  sizeCurves = [
    linear,
    easeOutSine,
    easeInSine,
  ];

  posCurves = [
    easeOutSine,
    easeOutCirc,
    easeOutBack,
    easeOutCubic,
  ];

  glowCurves = [
    easeOutSine,
    easeOutCubic,
    easeInOutSine,
    easeInOutCubic,
  ];

  // variables
  colorSet = getRandomColorSet();
  baseGrassThickness = random(3, 6);

  // prepare objs
  let groupsCount = int(random(6, 12));

  for (let i = 0; i < groupsCount; i++) {

    let xPos = random(0, width);
    let yPos = random(0, height);

    let rangeSizeX = random(60, 240);
    let rangeSizeY = circlePerspectiveRatio * rangeSizeX;

    let grassHeight = random(0.2, 1.0) * baseGrassHeight;

    let grassCount = int(random(12, 48));
    await prepareGrassGroup(xPos, yPos, rangeSizeX, rangeSizeY, grassHeight, grassCount);
  }

  let soloGrassCount = random(100, 300);

  for (let i = 0; i < soloGrassCount; i++) {
    let xPos = random(0, width);
    let yPos = random(0, height);
    let grassHeight = random(0.2, 1.0) * baseGrassHeight;

    prepareGrassSingle(xPos, yPos, grassHeight);
  }

  // prepare fireflies
  let fireflyCount = random(3, 36);
  for (let i = 0; i < fireflyCount; i++) {

    let yPosT = random(0.2, 1.0);

    let lightBallX = random(-100, width + 100);
    let lightBallY = lerp(-100, height + 100, yPosT);

    let lightBallSize = lerp(30, 120, yPosT);
    lightBallSize *= random(0.8, 1.2);

    let ballPosHeightT = random(0.2, 1.0);
    let ballPosHeight = lerp(10, 300, ballPosHeightT);

    drawObjs.push({
      type: 'firefly',
      x: lightBallX,
      y: lightBallY,
      size: lightBallSize,
      posHeight: ballPosHeight,
      posHeightT: ballPosHeightT
    });
    // drawFirefly(lightBallX, lightBallY, ballPosHeight, ballPosHeightT, lightBallSize);
  }

  // sort objs
  drawObjs.sort((a, b) => {
    if (a.y < b.y) {
      return -1;
    }
    else if (a.y > b.y) {
      return 1;
    }
    else {
      return 0;
    }
  });

  // draw all objs
  for (let i = 0; i < drawObjs.length; i++) {
    let nowObj = drawObjs[i];
    if (nowObj.type == 'grass') {
      drawGrassAndReflection(nowObj.x, nowObj.y, nowObj.toX, nowObj.toY, nowObj.thickness, nowObj.fromColor, nowObj.toColor, nowObj.sizeCurve, nowObj.posCurve);
    }
    else if (nowObj.type == 'ripple') {
      drawRipple(nowObj.x, nowObj.y, nowObj.width, nowObj.height, nowObj.sizeT);
    }
    else if (nowObj.type == 'firefly') {
      drawFirefly(nowObj.x, nowObj.y, nowObj.posHeight, nowObj.posHeightT, nowObj.size);
    }
    await sleep(1);
    redrawAll();
    await sleep(1);
  }

  redrawAll();
}

function prepareGrassSingle(_x, _y, _tall) {
  let growX = _x;
  let growY = _y;

  let nowTall = _tall;
  let directionAngle = random(-60, 60);

  let toX = growX + sin(radians(directionAngle)) * nowTall;
  let toY = growY - cos(radians(directionAngle)) * nowTall;

  let nowSizeCurve = random(sizeCurves);
  let nowPosCurve = random(posCurves);

  let nowThickness = random(0.8, 1.2) * baseGrassThickness;

  let fromColor = getRandomColor();
  let toColor = getRandomColor();

  let hasRipple = random() < 0.2;

  drawObjs.push({
    type: 'grass',
    x: growX,
    y: growY,
    toX: toX,
    toY: toY,
    thickness: nowThickness,
    fromColor: fromColor,
    toColor: toColor,
    sizeCurve: nowSizeCurve,
    posCurve: nowPosCurve,
  });

  if (hasRipple) {
    let rippleSizeT = random(0.3, 1.0);
    let rippleWidth = lerp(30, 120, rippleSizeT);
    let rippleHeight = circlePerspectiveRatio * rippleWidth;

    drawObjs.push({
      type: 'ripple',
      x: _x,
      y: _y,
      width: rippleWidth,
      height: rippleHeight,
      sizeT: (1.0 - rippleSizeT),
    });

  }
}

function prepareGrassGroup(_x, _y, _width, _height, _tall, _count) {
  for (let i = 0; i < _count; i++) {
    let growPosDirection = random(0, 360);
    let growPosDist = random(0, 1);

    let growX = _x + sin(radians(growPosDirection)) * growPosDist * _width;
    let growY = _y - cos(radians(growPosDirection)) * growPosDist * _height;

    let nowTallRatio = 1.0 - growPosDist;
    let nowTall = nowTallRatio * random(0.6, 1.2) * _tall;
    let directionAngle = random(-60, 60);

    let toX = growX + sin(radians(directionAngle)) * nowTall;
    let toY = growY - cos(radians(directionAngle)) * nowTall;

    let nowSizeCurve = random(sizeCurves);
    let nowPosCurve = random(posCurves);

    let nowThickness = baseGrassThickness * random(0.8, 1.2);

    let fromColor = getRandomColor();
    let toColor = getRandomColor();

    drawObjs.push({
      type: 'grass',
      x: growX,
      y: growY,
      toX: toX,
      toY: toY,
      thickness: nowThickness,
      fromColor: fromColor,
      toColor: toColor,
      sizeCurve: nowSizeCurve,
      posCurve: nowPosCurve,
    });
  }

  // draw ripples
  canvasRipples.blendMode(ADD);
  let rippleCount = random(0, 4);

  for (let i = 0; i < rippleCount; i++) {
    let rippleSizeT = random(0.3, 2.0);
    let rippleWidth = rippleSizeT * _width * 2;
    let rippleHeight = circlePerspectiveRatio * rippleWidth;

    drawObjs.push({
      type: 'ripple',
      x: _x,
      y: _y,
      width: rippleWidth,
      height: rippleHeight,
      sizeT: (1.0 - rippleSizeT),
    });

    // drawRipple(_x, _y, rippleWidth, rippleHeight, (1.0 - rippleSizeT));
  }

}


function getRippleColor() {
  let nowHue = processHue(colorSet.rippleHue + random(-30, 30));
  let nowSat = random(20, 40);
  let nowBri = random(80, 100);

  if (random() < 0.4) {
    nowSat = 0;
    nowBri = 100;
  }

  if (random() < 0.12) {
    nowHue = processHue(nowHue + 180);
  }

  return new NYColor(nowHue, nowSat, nowBri, 1.0);
}

function getRandomColor() {
  let nowHue = processHue(colorSet.grassHue + random(-30, 30));
  let nowSat = random(20, 60);
  let nowBri = random(30, 100);

  if (random() < 0.12) {
    nowHue = processHue(nowHue + 60);
  }

  return new NYColor(nowHue, nowSat, nowBri, 1.0);
}

function getFireflyColor() {

  let nowHue = processHue(colorSet.fireflyHue + random(-30, 30));
  let nowSat = random(30, 60);
  let nowBri = random(80, 100);

  if (random() < 0.12) {
    nowHue = processHue(nowHue + 180);
  }

  return new NYColor(nowHue, nowSat, nowBri);
}

function redrawAll() {
  background(0);
  image(canvasReflection, 0, 0);
  image(canvasRipples, 0, 0);
  image(canvasFront, 0, 0);
}

// async sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
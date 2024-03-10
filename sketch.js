
let canvasFront;
let canvasRipples;
let canvasReflection;

let canvasDensity = 1;

let sizeCurves = [
  linear,
  easeOutSine,
  easeInSine,
];

let posCurves = [
  easeOutSine,
  // easeInOutSine,
  easeOutCirc,
  easeOutBack,
  easeOutCubic,
  // easeInOutCubic,
];

let glowCurves = [
  linear,
  easeInSine,
  easeInCubic,
  easeInOutSine,
  easeInOutCubic
];

let mainHue = 220;
let circlePerspectiveRatio = 0.4;

async function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  linear

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

  mainHue = 120;

  // let groupsCount = int(random(3, 12));
  let groupsCount = 3;

  for (let i = 0; i < groupsCount; i++) {

    let xPos = random(0, width);
    let yPos = random(0, height);

    let rangeSizeX = random(0.1, 0.4) * width;
    let rangeSizeY = circlePerspectiveRatio * rangeSizeX;

    let grassHeight = random(0.2, 0.4) * height;

    let grassCount = int(random(4, 12));
    await drawGrassGroup(xPos, yPos, rangeSizeX, rangeSizeY, grassHeight, grassCount);
  }

  let soloGrassCount = int(random(10, 20));

  for (let i = 0; i < soloGrassCount; i++) {
    let xPos = random(0, width);
    let yPos = random(0, height);

    let rangeSizeX = random(0.1, 0.4) * width;
    let rangeSizeY = 0.4 * rangeSizeX;

    let grassHeight = random(0.2, 0.4) * height;

    await drawGrassGroup(xPos, yPos, rangeSizeX, rangeSizeY, grassHeight, 1);
  }

  for (let i = 0; i < 40; i++) {

    let yPosT = random(0, 1);

    let lightBallX = random(-100, width + 100);
    let lightBallY = lerp(-100, height + 100, yPosT);

    let lightBallSize = lerp(30, 120, yPosT);
    lightBallSize *= random(0.8, 1.2);

    drawLightBall(lightBallX, lightBallY, lightBallSize, canvasFront);
  }
  redrawAll();
}

async function drawGrassGroup(_x, _y, _width, _height, _tall, _count) {
  for (let i = 0; i < _count; i++) {
    let growPosDirection = random(0, 360);
    let growPosDist = random(0, 1);

    let growX = _x + sin(radians(growPosDirection)) * growPosDist * _width;
    let growY = _y - cos(radians(growPosDirection)) * growPosDist * _height;

    let nowTallRatio = 1.0 - growPosDist;
    let nowTall = nowTallRatio * random(0.6, 1.2) * _tall;
    let directionAngle = random(-70, 70);

    let toX = growX + sin(radians(directionAngle)) * nowTall;
    let toY = growY - cos(radians(directionAngle)) * nowTall;

    let nowSizeCurve = random(sizeCurves);
    let nowPosCurve = random(posCurves);

    let nowThickness = random(6, 36);

    let fromColor = getRandomColor();
    let toColor = getRandomColor();

    drawGrassAndReflection(growX, growY, toX, toY, nowThickness, fromColor, toColor, nowSizeCurve, nowPosCurve);

    await sleep(1);
  }
}

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

  // draw ripples
  let rippleCount = random(0, 6);

  for (let i = 0; i < rippleCount; i++) {
    let rippleSizeT = random(0.05, 1.0);
    let rippleWidth = lerp(20, 600, rippleSizeT);
    let rippleHeight = circlePerspectiveRatio * rippleWidth;

    drawRipple(_x, _y, rippleWidth, rippleHeight, (1.0 - rippleSizeT));
  }

}

function getRandomColor() {
  let nowHue = mainHue + random(-30, 30);
  let nowSat = random(20, 60);
  let nowBri = random(30, 100);

  if (random() < 0.12) {
    nowHue = processHue(nowHue + 60);
  }

  return new NYColor(nowHue, nowSat, nowBri, 1.0);
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
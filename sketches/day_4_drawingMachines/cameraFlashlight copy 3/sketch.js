let camInput;
let pixelsToDraw = [];
let drawnPositions = [];
let rasterizeDivider = 2;
let spaceDown = false;
let initialized = false;
let totalPixels;

function preload() {
  camInput = createCapture(VIDEO, () => {
    initialized = true;
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  camInput.size(width / rasterizeDivider, height / rasterizeDivider);
  totalPixels = camInput.width * camInput.height;
  camInput.hide();
  frameRate(100);
}

function draw() {
  if (initialized === true) {
    // background(220);
    randomSeed(0);
    displayCamInput();

    drawAtMaxRed();
  }
}

function displayCamInput() {
  push();
  scale(-1, 1);
  translate(-width, 0);
  image(camInput, 0, 0, camInput.width, camInput.height);
  pop();
}

function drawAtMaxRed() {
  let rMax = 0;
  let gMin = 255;
  let bMin = 255;

  let avgR = 0;
  let avgG = 0;
  let avgB = 0;

  let avgBright = 0;

  let xPos_target = 0;
  let yPos_target = 0;

  camInput.loadPixels();
  for (let x = 0; x < camInput.width; x++) {
    for (let y = 0; y < camInput.height; y++) {
      let loc = 4 * (y * camInput.width + x);
      let r = camInput.pixels[loc];
      let g = camInput.pixels[loc + 1];
      let b = camInput.pixels[loc + 2];
      let a = camInput.pixels[loc + 3];

      avgR += r / totalPixels;
      avgG += g / totalPixels;
      avgB += b / totalPixels;

      let c = color(r, g, b, a);
      if (r > rMax && g < gMin && b < bMin) {
        rMax = r;
        gMin = g;
        bMin = b;
        xPos_target = map(x, 0, width / rasterizeDivider, width, 0);
        yPos_target = map(y, 0, height / rasterizeDivider, 0, height);
      }

      let bright = brightness(c);
      avgBright += bright / totalPixels;
      // if (bright > brightestValue) {
      //   xPos_source = map(x, 0, width / rasterizeDivider, width, 0);
      //   yPos_source = map(y, 0, height / rasterizeDivider, 0, height);
      // }
    }
  }

  drawnPositions.push({
    x: xPos_target,
    y: yPos_target,
  });

  for (let i = 0; i < 10; i++) {
    noFill();
    strokeWeight(map(i, 0, 9, 15, 2));

    let alpha = map(i, 0, 9, 100, 10);

    colorMode(HSB);
    console.log(avgBright);
    stroke(map(avgBright, 100, 200, 0, 360), 100, 100);
    let elipseWidth = map(i, 0, 9, 10, 200);
    ellipse(
      xPos_target,
      yPos_target,
      elipseWidth * sin(millis() / 1000),
      elipseWidth * cos(millis() / 1000)
    );
    colorMode(RGB);
  }

  let randomDrawnPosition = Math.floor(Math.random() * drawnPositions.length);

  stroke(0, 0, 0, 100);

  line(
    drawnPositions[randomDrawnPosition].x,
    drawnPositions[randomDrawnPosition].y,
    xPos_target,
    yPos_target
  );
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight, false);
  camInput.size(windowWidth, windowHeight);
}

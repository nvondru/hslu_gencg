let camInput;
let pixelsToDraw = [];
let drawnPositions = [];
let rasterizeDivider = 4;
let spaceDown = false;
let initialized = false;
function preload() {
  camInput = createCapture(VIDEO, () => {
    initialized = true;
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  camInput.size(width / rasterizeDivider, height / rasterizeDivider);
  camInput.hide();
  frameRate(100);
  background(100);
}

function draw() {
  if (initialized === true) {
    randomSeed(0);
    // displayCamInput();

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
  let brightestValue = 0;

  let xPos_target = 0;
  let yPos_target = 0;

  let xPos_source = 0;
  let yPos_source = 0;

  camInput.loadPixels();
  for (let x = 0; x < camInput.width; x++) {
    for (let y = 0; y < camInput.height; y++) {
      let loc = 4 * (y * camInput.width + x);
      let r = camInput.pixels[loc];
      let g = camInput.pixels[loc + 1];
      let b = camInput.pixels[loc + 2];
      let a = camInput.pixels[loc + 3];

      let c = color(r, g, b, a);
      if (r > rMax && g < gMin && b < bMin) {
        rMax = r;
        gMin = g;
        bMin = b;
        xPos_target = map(x, 0, width / rasterizeDivider, width, 0);
        yPos_target = map(y, 0, height / rasterizeDivider, 0, height);
      }

      let bright = brightness(c);
      if (bright > brightestValue) {
        xPos_source = map(x, 0, width / rasterizeDivider, width, 0);
        yPos_source = map(y, 0, height / rasterizeDivider, 0, height);
      }
    }
  }
  // if (spaceDown) {
  drawnPositions.push({
    x: xPos_target,
    y: yPos_target,
  });
  // }

  // for (let i = 0; i < pixelsToDraw.length; i++) {
  // const pixel = pixelsToDraw[i];

  // draw 10 circles increasing in size by index
  for (let i = 0; i < 10; i++) {
    noFill();
    // decrease the strokeWeight according to the index
    strokeWeight(map(i, 0, 9, 15, 2));
    // map colors and alpha to position and index parameters
    let r = map(random(xPos_target - 100, xPos_target + 100), 0, width, 0, 255);
    let g = map(
      random(yPos_target - 100, yPos_target + 100),
      0,
      height,
      0,
      255
    );
    let b = random(0, 255);
    let alpha = map(i, 0, 9, 100, 10);
    stroke(r, g, b, alpha);

    let elipseWidth = map(i, 0, 9, 10, 400);
    // if (spaceDown) {
    ellipse(
      xPos_target,
      yPos_target,
      // create a 3D rotating effect by calculating width and height with sine / cosine
      elipseWidth * sin(millis() / 1000),
      elipseWidth * cos(millis() / 1000)
    );
    // }
  }

  let randomDrawnPosition = Math.floor(random(0, drawnPositions.length));

  stroke(0, 0, 0, 255);
  // if (spaceDown) {
  line(
    drawnPositions[randomDrawnPosition].x,
    drawnPositions[randomDrawnPosition].y,
    xPos_target,
    yPos_target
  );
  // }
}

function keyPressed() {
  console.log(keyCode);
  // Space
  if (keyCode === 32) {
    spaceDown = true;
    // R
  } else if (keyCode === 82) {
    drawnPositions = [];
    background(100);
  }
}

function keyReleased() {
  if (keyCode === 32) {
    spaceDown = false;
  }
}

function windowResized() {
  resizeCanvas(innerWidth, innerHeight, false);
  drawnPositions = [];
  background(100);
}

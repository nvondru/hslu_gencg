let camInput;
let pixelsToDraw = [];
let rasterizeDivider = 2;
let spaceDown = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  camInput = createCapture(VIDEO);
  camInput.size(width / rasterizeDivider, height / rasterizeDivider);
  camInput.hide();
  frameRate(100);
}

function draw() {
  background(220);

  push();
  scale(-1, 1);
  translate(-width, 0);
  image(camInput, 0, 0, width, height);
  pop();
  let rMax = 0;
  let gMin = 255;
  let bMin = 255;

  let xPos = 0;
  let yPos = 0;
  camInput.loadPixels();
  for (let x = 0; x < camInput.width; x++) {
    for (let y = 0; y < camInput.height; y++) {
      let loc = 4 * (y * camInput.width + x);
      let r = camInput.pixels[loc];
      let g = camInput.pixels[loc + 1];
      let b = camInput.pixels[loc + 2];

      if (r > rMax && g < gMin && b < bMin) {
        rMax = r;
        gMin = g;
        bMin = b;
        xPos = map(x, 0, width / rasterizeDivider, width, 0);
        yPos = map(y, 0, height / rasterizeDivider, 0, height);
      }
    }
  }
  // if (spaceDown) {
  pixelsToDraw.push({
    x: xPos,
    y: yPos,
  });
  // } else {
  fill(255, 255, 255, 255);
  stroke(0, 0, 0, 255);
  strokeWeight(5);
  ellipse(xPos, yPos, 20);
  // }
  fill(0, 255, 0, 255);
  noStroke();
  for (let i = 0; i < pixelsToDraw.length; i++) {
    const pixel = pixelsToDraw[i];
    ellipse(pixel.x, pixel.y, 20);
  }
}

function keyPressed() {
  console.log(keyCode);
  // Space
  if (keyCode === 32) {
    spaceDown = true;
    // R
  } else if (keyCode === 82) {
    pixelsToDraw = [];
  }
}

function keyReleased() {
  if (keyCode === 32) {
    spaceDown = false;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight, false);
  camInput.size(windowWidth, windowHeight);
}

let camInput;
let pixelsToDraw = [];
let rasterizeDivider = 5;

function setup() {
  createCanvas(windowWidth, windowHeight);
  camInput = createCapture(VIDEO);
  camInput.size(width / rasterizeDivider, height / rasterizeDivider);
  camInput.hide();

  fill(0, 255, 0, 255);
  stroke(255, 0, 0, 255);
  strokeWeight(5);
}

function draw() {
  background(220);

  push();
  scale(-1, 1);
  translate(-width, 0);
  image(camInput, 0, 0, width, height);
  pop();
  let brightestValue = 0;
  let brightestPixelIndex;
  let xPos = 0;
  let yPos = 0;
  camInput.loadPixels();
  for (let x = 0; x < camInput.width; x++) {
    for (let y = 0; y < camInput.height; y++) {
      let loc = 4 * (y * camInput.width + x);
      let r = camInput.pixels[loc];
      let g = camInput.pixels[loc + 1];
      let b = camInput.pixels[loc + 2];
      let a = camInput.pixels[loc + 3];
      let c = color(r, g, b, a);
      let bright = brightness(c);
      if (bright > brightestValue) {
        brightestValue = bright;
        brightestPixelIndex = loc;
        xPos = map(x, 0, width / rasterizeDivider, width, 0);
        yPos = map(y, 0, height / rasterizeDivider, 0, height);
      }
    }
  }
  // if (keyIsPressed === true) {
  pixelsToDraw.push({
    x: xPos,
    y: yPos,
  });
  // } else {
  // ellipse(xPos, yPos, 20);
  // }
  for (let i = 0; i < pixelsToDraw.length; i++) {
    const pixel = pixelsToDraw[i];
    ellipse(pixel.x, pixel.y, 20);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight, false);
  camInput.size(windowWidth, windowHeight);
}

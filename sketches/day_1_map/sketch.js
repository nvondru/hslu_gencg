let zOff = 0;
function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
}

function draw() {
  let xOff = Date.now() / 3000;
  let yOff = 0;

  loadPixels();
  for (let x = 0; x < width; x++) {
    yOff = 0;
    for (let y = 0; y < height; y++) {
      let loc = (x + y * width) * 4;
      log;
      let v = Math.floor(map(noise(xOff, yOff), 0, 1, 0, 256));
      pixels[loc + 0] = v;
      pixels[loc + 1] = v;
      pixels[loc + 2] = v;
      pixels[loc + 3] = 255;
      yOff += 0.01;
    }

    xOff += 0.01;
  }
  updatePixels();
  zOff += 0.1;
}

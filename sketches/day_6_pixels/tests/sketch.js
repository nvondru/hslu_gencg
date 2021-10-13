function setup() {
  createCanvas(400, 400);

  loadPixels();

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let loc = (x + y * width) * 4;

      pixels[loc + 0] = 0;
      pixels[loc + 1] = 0;
      pixels[loc + 2] = 0;
      pixels[loc + 3] = 255;
    }
  }

  updatePixels();
}

function draw() {}

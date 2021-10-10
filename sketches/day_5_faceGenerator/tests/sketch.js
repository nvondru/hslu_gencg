let xoff_1 = 0;
let xoff_2 = 10000;

let points = [];

function setup() {
  createCanvas(800, 400);
  noFill();
  // strokeWeight(1);
  stroke(255, 255, 255, 255);
  frameRate(500);
  background(40);
}

function draw() {
  noSmooth();
  // randomSeed(0);
  // var y = map(noise(xoff), 0, 1, 0, height);
  // var x = map(noise(xoff_1), 0, 1, 0, width);
  // var y = map(noise(xoff_2), 0, 1, 0, height);
  // points.push({ x: xoff * 100, y: y });
  // beginShape();
  // for (let i = 0; i < points.length; i++) {
  //   const point = points[i];
  //   vertex(point.x, point.y);
  // }
  // endShape();

  // ellipse(x, y, 1, 1);

  point(random(0, width), random(0, height));
  xoff_1 += 0.1;
  xoff_2 += 0.1;

  loadPixels();
  for (let i = 0; i < pixels.length; i += 4) {
    const pixel = pixels[i];
    if (pixel == 255) {
      pixels[i] = 255;
      pixels[i + 1] = 0;
      pixels[i + 2] = 0;
      pixels[i + 3] = 255;
    }
  }
  updatePixels();
}

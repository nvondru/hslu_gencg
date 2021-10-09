let xoff = 0;

let points = [];

function setup() {
  createCanvas(800, 400);
  noFill();
  strokeWeight(1);
  stroke(255, 255, 255, 255);
}

function draw() {
  background(40);
  randomSeed(0);

  // var y = map(noise(xoff), 0, 1, 0, height);
  var x = map(noise(xoff), 0, 1, 0, width);
  // points.push({ x: xoff * 100, y: y });
  // beginShape();
  // for (let i = 0; i < points.length; i++) {
  //   const point = points[i];
  //   vertex(point.x, point.y);
  // }
  // endShape();

  // ellipse(x, height / 2, 10, 10);
  ellipse(random(0, width), height / 2, 10, 10);
  xoff += 0.01;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight, false);
}

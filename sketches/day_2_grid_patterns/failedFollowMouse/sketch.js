let cols = 20;
let rows;
let tileWidth;

function setup() {
  createCanvas(windowWidth, windowHeight);

  fill(255, 0, 0, 255);
  stroke(0);
  strokeWeight(0);
}

function draw() {
  background(220);
  tileWidth = width / cols;
  rows = Math.floor(height / tileWidth);
  strokeWeight(10);
  stroke(255, 0, 0, 255);
  // draw lines in a grid
  for (let y = tileWidth / 2; y < rows * tileWidth; y += tileWidth) {
    for (let x = tileWidth / 2; x < cols * tileWidth; x += tileWidth) {
      push();
      // calculate the angle so the line points to the mouse position
      let angle = Math.atan2(mouseY - y, mouseX - x);
      rotate(angle);
      line(x - tileWidth / 2, y, x + tileWidth / 2, y);
      pop();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight, false);
}

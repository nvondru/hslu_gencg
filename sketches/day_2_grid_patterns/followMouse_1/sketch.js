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
  for (let iY = 0; iY < rows; iY++) {
      for (let iX = 0; iX < cols; iX++) {
        let x = iX * tileWidth;
        let y = iY * tileWidth;

        let angle = atan2(mouseY - y, mouseX - x);
        line(x - cos(angle) * tileWidth / 2, y - sin(angle) * tileWidth / 2, x + cos(angle) * tileWidth / 2, y + sin(angle) * tileWidth / 2);
      }
    
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight, false);
}

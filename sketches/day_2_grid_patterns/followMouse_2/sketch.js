let cols = 20;
let rows;
let tileWidth;
let clearBackground = false;
let globalAlpha = 20;

function setup() {
  createCanvas(windowWidth, windowHeight);

  strokeCap(PROJECT);
  background(220);
}

function draw() {
  randomSeed(0);
  if (clearBackground == true) {
    background(220);
    globalAlpha = 255;
  } else {
    globalAlpha = 20;
  }
  tileWidth = width / cols;
  rows = Math.floor(height / tileWidth);
  strokeWeight(10);
  stroke(255, 0, 0, 255);
  for (let iY = 0; iY < rows; iY++) {
    for (let iX = 0; iX < cols; iX++) {
      let x = iX * tileWidth;
      let y = iY * tileWidth;

      // set colors according to mouseposition and some random values
      let r = map(random(mouseX - 100, mouseX + 100), 0, width, 0, 255);
      let g = map(random(mouseY - 100, mouseY + 100), 0, height, 0, 255);
      let b = random(0, 255);
      stroke(r, g, b, globalAlpha);

      // calculate angle between line position and mousePosition
      let angle = atan2(mouseY - y, mouseX - x);
      let lineWidth =
        (tileWidth + random(-tileWidth, tileWidth * 3)) *
        sin(millis() / 300) *
        tan(millis() / 300) *
        cos(millis() / 150);

      // apply different effects for randomly chosen lines
      let flipped = random(0, 1);
      if (flipped <= 0.5) {
        strokeWeight(map(mouseX, 0, width, 0, 30));
        line(
          x - (sin(angle) * lineWidth) / 2,
          y - (cos(angle) * lineWidth) / 2,
          x + (sin(angle) * lineWidth) / 2,
          y + (cos(angle) * lineWidth) / 2
        );
      } else {
        strokeWeight(map(mouseY, 0, height, 0, 30));
        line(
          x - (cos(angle) * lineWidth) / 2,
          y - (sin(angle) * lineWidth) / 2,
          x + (cos(angle) * lineWidth) / 2,
          y + (sin(angle) * lineWidth) / 2
        );
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight, false);
}

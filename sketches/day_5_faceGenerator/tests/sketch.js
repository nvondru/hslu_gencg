let slider;
let cheekOffset = 50;

function setup() {
  createCanvas(windowWidth, windowHeight);
  slider = createSlider(0, 255, 50);
  slider.position(10, 10);
  slider.style("width", "80px");
}

function draw() {
  translate(width / 2, height / 2);
  cheekOffset = slider.value();
  background(220);
  noFill();
  beginShape();
  curveVertex(0, -100);
  curveVertex(0, -100);
  curveVertex(-cheekOffset, 0);
  curveVertex(0, 100);
  curveVertex(cheekOffset, 0);
  curveVertex(0, -100);
  curveVertex(0, -100);
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight, false);
}

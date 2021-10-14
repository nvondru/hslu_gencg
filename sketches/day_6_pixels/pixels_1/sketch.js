let sourceImg;
let d;

function preload() {
  sourceImg = loadImage("./img/mountain.jpg");
}

function setup() {
  createCanvas(800, 800);
  background(80);
  sourceImg.resize(width, 0);
  pixelDensity(1);
  background(80);
  image(sourceImg, 0, 0);
  loadPixels();
  frameRate(1000);
}

let xOff = 0;
let yOff = 10000;

function draw() {
  let currentIndex = 0;
  do {
    let currentR = 0;
    let currentG = 0;
    let currentB = 0;
    let currentA = 0;
    let r = pixels[currentIndex];
    let g = pixels[currentIndex + 1];
    let b = pixels[currentIndex + 2];
    let a = pixels[currentIndex + 3];
    let nextIndex =
      currentIndex + Math.floor(map(noise(xOff), 0, 1, 1, 12)) * 4;

    // let nextIndex =
    //   currentIndex + Math.floor(map(noise(xOff, yOff), 0, 1, 1, 8)) * 8;

    currentR = pixels[nextIndex + 0];
    currentG = pixels[nextIndex + 1];
    currentB = pixels[nextIndex + 2];
    currentA = pixels[nextIndex + 3];
    pixels[nextIndex + 0] = r;
    pixels[nextIndex + 1] = g;
    pixels[nextIndex + 2] = b;
    pixels[nextIndex + 3] = a;
    pixels[currentIndex + 0] = currentR;
    pixels[currentIndex + 1] = currentG;
    pixels[currentIndex + 2] = currentB;
    pixels[currentIndex + 3] = currentA;
    currentIndex = nextIndex;
    xOff += 0.01;
    yOff += 0.01;
  } while (currentIndex <= width * height * 4);
  updatePixels();
}

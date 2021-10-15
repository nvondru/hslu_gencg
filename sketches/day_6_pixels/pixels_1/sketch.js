let sourceImg;
let d;

function preload() {
  sourceImg = loadImage("./img/mountain.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  if (sourceImg.width >= sourceImg.height) {
    sourceImg.resize(width, 0);
  } else {
    sourceImg.resize(0, height);
  }
  resizeCanvas(sourceImg.width, sourceImg.height);
  pixelDensity(1);
  background(80);
  image(sourceImg, 0, 0);
  loadPixels();
  frameRate(1000);
}

let xOff = 0;
let yOff = 10000;

function draw() {
  // each frame the process starts with the very first pixel in the image
  let currentIndex = 0;
  do {
    // these variables serve as a temporary storage for caching RGBA values during the swap process
    let currentR = 0;
    let currentG = 0;
    let currentB = 0;
    let currentA = 0;

    let r = pixels[currentIndex];
    let g = pixels[currentIndex + 1];
    let b = pixels[currentIndex + 2];
    let a = pixels[currentIndex + 3];
    // the index of the pixel to swap colors with is determined by perlin noise and mapped to some range
    // the bigger this range (in this case 1 - 12) the less recoginzeable the resulting image will be
    let nextIndex =
      currentIndex + Math.floor(map(noise(xOff), 0, 1, 1, 12)) * 4;

    //RGBA values of the next pixel are saved
    currentR = pixels[nextIndex + 0];
    currentG = pixels[nextIndex + 1];
    currentB = pixels[nextIndex + 2];
    currentA = pixels[nextIndex + 3];

    // next pixel receives color values from the original pixel
    pixels[nextIndex + 0] = r;
    pixels[nextIndex + 1] = g;
    pixels[nextIndex + 2] = b;
    pixels[nextIndex + 3] = a;

    // original pixel receives color values from the pixel he swapped with
    pixels[currentIndex + 0] = currentR;
    pixels[currentIndex + 1] = currentG;
    pixels[currentIndex + 2] = currentB;
    pixels[currentIndex + 3] = currentA;

    // the next pixel will be the original pixel for the next loop
    currentIndex = nextIndex;

    xOff += 0.01;
    yOff += 0.01;

    // loops until the whole image is processed once
  } while (currentIndex <= width * height * 4);
  updatePixels();
}

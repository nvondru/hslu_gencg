let imgToReplicate;
let imgSource;
let imgReplicated;

let sampledSize = 100;

let replicationThreshold = 701;

let thresholdDisplay;

function preload() {
  imgSource = loadImage("./images/palette.jpg");
  imgToReplicate = loadImage("./images/me.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  background(120);
  let btnStart = createButton("Start");
  btnStart.elt.classList.add("btnStart");
  btnStart.mousePressed(() => {
    loop();
  });
  noStroke();
  textSize(30);
  fill(255, 0, 0, 255);
  textAlign(CENTER);

  if (imgToReplicate.width >= imgToReplicate.height) {
    imgToReplicate.resize(sampledSize, 0);
  } else {
    imgToReplicate.resize(0, sampledSize);
  }
  imgSource.resize(imgToReplicate.width, imgToReplicate.height);
  noLoop();
}

function draw() {
  if (replicationThreshold > 0) {
    replicationThreshold -= 1;
    calculateReplicatedImage();
  }
}

function calculateReplicatedImage() {
  imgReplicated = createImage(imgToReplicate.width, imgToReplicate.height);
  let sourceColors = analyzeImg(imgSource);
  imgToReplicate.loadPixels();
  imgReplicated.loadPixels();

  for (let y = 0; y < imgToReplicate.height; y++) {
    for (let x = 0; x < imgToReplicate.width; x++) {
      let loc = (x + y * imgToReplicate.width) * 4;

      let r = imgToReplicate.pixels[loc + 0];
      let g = imgToReplicate.pixels[loc + 1];
      let b = imgToReplicate.pixels[loc + 2];
      let a = imgToReplicate.pixels[loc + 3];

      let closestColor = findClosestColor(r, g, b, a, sourceColors);
      sourceColors.splice(sourceColors.indexOf(closestColor), 1);
      imgReplicated.pixels[loc + 0] = red(closestColor);
      imgReplicated.pixels[loc + 1] = green(closestColor);
      imgReplicated.pixels[loc + 2] = blue(closestColor);
      imgReplicated.pixels[loc + 3] = alpha(closestColor);
    }
  }
  imgReplicated.updatePixels();
  imgSource.loadPixels();
  imgReplicated.loadPixels();
  imgSource.pixels = imgReplicated.pixels;
  imgSource.updatePixels();

  if (imgReplicated.width >= imgReplicated.height) {
    imgReplicated.resize(width, 0);
  } else {
    imgReplicated.resize(0, height);
  }
  push();
  translate(width / 2 - imgReplicated.width / 2, 0);
  image(imgReplicated, 0, 0);
  pop();
  thresholdDisplay = text("Threshold: " + replicationThreshold, width / 2, 40);
}

// this function is called for every pixel of the source image which should be replicated
// it returns the closest color of the source image accordings to the threshold value
function findClosestColor(r, g, b, a, sourceColors) {
  // the cumulativeDiff represents the total difference of the sum of the RGBA values
  // the smaller this value becomes, the closer is the found pixel in terms of color values
  let closestCumulativeDiff = 1016;
  let closestColor = color(255, 255, 255, 255);

  // all remaining pixel colors are iterated to find a closer color value
  for (let i = 0; i < sourceColors.length; i++) {
    const c = sourceColors[i];
    let diff =
      Math.abs(r - red(c)) +
      Math.abs(g - green(c)) +
      Math.abs(b - blue(c)) +
      Math.abs(a - alpha(c));

    if (diff < closestCumulativeDiff) {
      closestCumulativeDiff = diff;
      closestColor = c;
    }

    // the replicationThreshold determines how similar the pixels must be in order to be matched
    // 0 means the pixels must be identical
    if (closestCumulativeDiff <= replicationThreshold) {
      return closestColor;
    }
  }
  return closestColor;
}

function analyzeImg(img) {
  let colors = [];
  img.loadPixels();
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      let loc = (x + y * img.width) * 4;

      let r = img.pixels[loc + 0];
      let g = img.pixels[loc + 1];
      let b = img.pixels[loc + 2];
      let a = img.pixels[loc + 3];

      colors.push(color(r, g, b, a));
    }
  }

  return colors;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight, false);
}

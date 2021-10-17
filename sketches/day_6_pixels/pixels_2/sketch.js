let imgToReplicate;
let imgSource;
let imgReplicated;

let startTime;

let sampledSize = 100;

let replicationThreshold;
let btnApplyThreshold;

function preload() {
  imgSource = loadImage("./images/landscape.jpg");
  imgToReplicate = loadImage("./images/me.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  background(120);

  if (imgToReplicate.width >= imgToReplicate.height) {
    imgToReplicate.resize(sampledSize, 0);
  } else {
    imgToReplicate.resize(0, sampledSize);
  }
  imgSource.resize(imgToReplicate.width, imgToReplicate.height);

  replicationThreshold = createSlider(0, 1016, 200, 1);
  replicationThreshold.position(10, 10);
  btnApplyThreshold = createButton("Apply");
  btnApplyThreshold.position(10, 40);
  btnApplyThreshold.mousePressed(() => {
    calculateReplicatedImage();
  });

  calculateReplicatedImage();
}

function calculateReplicatedImage() {
  startTime = Date.now();
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
  console.log(
    "Render time was: " + (Date.now() - startTime) / 1000 + " seconds..."
  );
  if (imgReplicated.width >= imgReplicated.height) {
    imgReplicated.resize(width, 0);
  } else {
    imgReplicated.resize(0, height);
  }
  image(imgReplicated, 0, 0);
}

function findClosestColor(r, g, b, a, sourceColors) {
  let closestCumulativeDiff = 1016;
  let closestColor = color(255, 255, 255, 255);

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
    if (closestCumulativeDiff <= replicationThreshold.value()) {
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
  console.log(
    "Finished analyzing after " +
      (Date.now() - startTime) / 1000 +
      " seconds..."
  );
  return colors;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight, false);
  imgReplicated.resize(width, 0);
  image(imgReplicated, 0, 0);
}

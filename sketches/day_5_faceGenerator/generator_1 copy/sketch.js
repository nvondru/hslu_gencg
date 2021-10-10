// Forked from https://editor.p5js.org/lingdong/sketches/ef6FB-uNq
// --> https://github.com/LingDong-/ Check his work!

let VTX = VTX68;

// select the right triangulation based on vertices
let TRI;
if (VTX == VTX7) {
  TRI = TRI7;
} else if (VTX == VTX33) {
  TRI = TRI33;
} else if (VTX == VTX68) {
  TRI = TRI68;
} else {
  TRI = TRI468;
}

// this will be loaded with the facemesh model
// WARNING: do NOT call it 'model', because p5 already has something called 'model'
let facemeshModel = null;

// is webcam capture ready?
let videoDataLoaded = false;

let statusText = "Loading facemesh model...";

// faces detected in this browser
// currently facemesh only supports single face, so this will be either empty or singleton
let myFace;

// webcam capture, managed by p5.js
let capture;

let outline = [17, 5, 8, 11, 26];

let eyeLeft = [36, 41, 39, 38];
let eyeRight = [45, 46, 42, 43];

let nose = [27, 31, 33, 35];

let mouthOuter = [48, 57, 54, 51];
// let mouthInner = [];

let seed = 0;

let mouthMultiplier;
let eyeMultiplier;
let noseMultiplier;
let outlineMultiplier;

// Load the MediaPipe facemesh model assets.
facemesh.load().then(function (_model) {
  console.log("model initialized.");
  statusText = "Model loaded.";
  facemeshModel = _model;
});

function setup() {
  createCanvas(600, 400);
  capture = createCapture(VIDEO);
  capture.size(width, height);
  frameRate(100);
  pixelDensity(1);

  // this is to make sure the capture is loaded before asking facemesh to take a look otherwise facemesh will be very unhappy
  capture.elt.onloadeddata = function () {
    console.log("video initialized");
    videoDataLoaded = true;
  };
  background(80);

  // create sliders
  mouthMultiplier = createSlider(0, 2, 1, 0.1);
  mouthMultiplier.position(20, 20);
  eyeMultiplier = createSlider(0, 2, 1, 0.1);
  eyeMultiplier.position(20, 50);
  noseMultiplier = createSlider(0, 2, 1, 0.1);
  noseMultiplier.position(20, 80);
  outlineMultiplier = createSlider(0, 2, 1, 0.1);
  outlineMultiplier.position(20, 110);

  let btnGenerate = createButton("Generate Face");
  btnGenerate.position(20, 140);
  btnGenerate.mousePressed(() => {
    background(80);

    seed = millis();
    // now draw all the other users' faces (& drawings) from the server
    push();
    translate(-width / 2, -height / 2);
    scale(2);
    strokeWeight(2);
    noFill();
    stroke(255, 255, 255);
    drawFace(myFace);
    pop();

    loadPixels();

    let xOff = 0;

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const i = (x + y * width) * 4;
        let r = pixels[i + 0];
        let g = pixels[i + 1];
        let b = pixels[i + 2];
        let a = pixels[i + 3];
        let bright = brightness(color(r, g, b));
        if (bright >= 40) {
          let v = map(noise(xOff), 0, 1, 0, 255);
          pixels[i + 0] = v;
          pixels[i + 1] = v;
          pixels[i + 2] = v;
        }
        xOff += 0.01;
      }
    }
    updatePixels();
  });

  capture.hide();
}

function draw() {
  randomSeed(seed);
  //otherwise super gnarly
  strokeJoin(ROUND);
  // if model and video both loaded,
  if (facemeshModel && videoDataLoaded) {
    facemeshModel.estimateFaces(capture.elt).then(function (_faces) {
      // we're faceling an async promise best to avoid drawing something here!
      // it might produce weird results due to racing

      // update the global myFaces object with the detected faces
      let _myFaces = _faces.map((x) => packFace(x, VTX));

      // console.log(myFaces);
      if (!_myFaces.length) {
        // haven't found any faces
        statusText = "Show some faces!";
      } else {
        myFace = _myFaces[0];
        // display the confidence, to 3 decimal places
        const confidence =
          Math.round(_faces[0].faceInViewConfidence * 1000) / 1000;
        statusText = "Confidence: " + confidence;
      }
    });
  }

  fill(255, 255, 255, 255);
  noStroke();
  textSize(15);
  text("Mouth randomness", mouthMultiplier.x * 2 + mouthMultiplier.width, 35);
  text("Eye randomness", eyeMultiplier.x * 2 + eyeMultiplier.width, 65);
  text("Nose randomness", noseMultiplier.x * 2 + noseMultiplier.width, 95);
  text(
    "Outline randomness",
    outlineMultiplier.x * 2 + outlineMultiplier.width,
    125
  );
}

function mouseClicked() {}

// draw a face object returned by facemesh
function drawFace(faceVertices, filled) {
  if (faceVertices != undefined) {
    const mesh = faceVertices.scaledMesh;
    connectOutlineVertices(mesh, outline);
    connectNoseVertices(mesh, nose);
    connectEyeVertices(mesh, eyeLeft);
    connectEyeVertices(mesh, eyeRight);
    connectOuterMouthVertices(mesh, mouthOuter);
  }
}

function connectOuterMouthVertices(vertices, connectionIndices) {
  let xOffset_1 = random(-20, 10) * mouthMultiplier.value();
  let xOffset_2 = random(-10, 20) * mouthMultiplier.value();
  beginShape();

  for (let i = 0; i < connectionIndices.length; i++) {
    const vertexPoint = vertices[connectionIndices[i]];
    if (
      connectionIndices[i] === 48 ||
      connectionIndices[i] === 49 ||
      connectionIndices[i] === 59
    ) {
      vertex(vertexPoint[0] + xOffset_1, vertexPoint[1]);
    } else if (
      connectionIndices[i] === 53 ||
      connectionIndices[i] === 54 ||
      connectionIndices[i] === 55
    ) {
      vertex(vertexPoint[0] + xOffset_2, vertexPoint[1]);
    } else {
      vertex(vertexPoint[0], vertexPoint[1]);
    }
  }

  endShape(CLOSE);
}

function connectNoseVertices(vertices, connectionIndices) {
  beginShape();

  for (let i = 0; i < connectionIndices.length; i++) {
    const vertexPoint = vertices[connectionIndices[i]];
    if (i == 0) {
      vertex(
        vertexPoint[0],
        vertexPoint[1] + random(-20, 20) * noseMultiplier.value()
      );
    } else if (i == 1) {
      vertex(
        vertexPoint[0] + random(-20, 20) * noseMultiplier.value(),
        vertexPoint[1]
      );
    } else if (i == 2) {
      vertex(
        vertexPoint[0],
        vertexPoint[1] + random(-20, 20) * noseMultiplier.value()
      );
    } else if (i == 3) {
      vertex(
        vertexPoint[0] + random(-20, 20) * noseMultiplier.value(),
        vertexPoint[1]
      );
    }
  }

  endShape(CLOSE);
}

function connectOutlineVertices(vertices, connectionIndices) {
  beginShape();

  for (let i = 0; i < connectionIndices.length; i++) {
    const vertexPoint = vertices[connectionIndices[i]];
    if (i == 0) {
      vertex(
        vertexPoint[0] + random(-30, 0) * outlineMultiplier.value(),
        vertexPoint[1] + random(-30, 10) * outlineMultiplier.value()
      );
    } else if (i == 1) {
      vertex(
        vertexPoint[0] + random(-30, 30) * outlineMultiplier.value(),
        vertexPoint[1]
      );
    } else if (i == 2) {
      vertex(
        vertexPoint[0],
        vertexPoint[1] + random(-10, 50) * outlineMultiplier.value()
      );
    } else if (i == 3) {
      vertex(
        vertexPoint[0] + random(-30, 30) * outlineMultiplier.value(),
        vertexPoint[1]
      );
    } else if (i == 4) {
      vertex(
        vertexPoint[0] + random(-30, 0) * outlineMultiplier.value(),
        vertexPoint[1] + random(-30, 10) * outlineMultiplier.value()
      );
    }
  }

  endShape(CLOSE);
}

function connectEyeVertices(vertices, connectionIndices) {
  beginShape();

  for (let i = 0; i < connectionIndices.length; i++) {
    const vertexPoint = vertices[connectionIndices[i]];
    if (i == 0) {
      vertex(
        vertexPoint[0] + random(-10, 10) * eyeMultiplier.value(),
        vertexPoint[1]
      );
    } else if (i == 1) {
      vertex(
        vertexPoint[0],
        vertexPoint[1] + random(-10, 0) * eyeMultiplier.value()
      );
    } else if (i == 2) {
      vertex(
        vertexPoint[0] + random(-10, 10) * eyeMultiplier.value(),
        vertexPoint[1]
      );
    } else if (i == 3) {
      vertex(
        vertexPoint[0],
        vertexPoint[1] + random(0, 10) * eyeMultiplier.value()
      );
    }
  }

  endShape(CLOSE);
}

// reduces the number of keypoints to the desired set
// (VTX7, VTX33, VTX68, etc.)
function packFace(face, set) {
  let ret = {
    scaledMesh: [],
  };
  for (let i = 0; i < set.length; i++) {
    let j = set[i];
    ret.scaledMesh[i] = [
      face.scaledMesh[j][0],
      face.scaledMesh[j][1],
      face.scaledMesh[j][2],
    ];
  }
  return ret;
}

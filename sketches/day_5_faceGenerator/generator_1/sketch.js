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

let outline = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 26, 25, 24, 23, 22,
  21, 20, 19, 18, 17,
];

let eyeLeft = [36, 37, 38, 39, 40, 41];
let eyeRight = [42, 43, 44, 45, 45, 47];

let nose = [27, 28, 29, 30, 31, 32, 33, 34, 35];

let mouthOuter = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59];
let mouthInner = [60, 61, 62, 63, 64, 65, 66, 67];

let seed = 0;

// Load the MediaPipe facemesh model assets.
facemesh.load().then(function (_model) {
  console.log("model initialized.");
  statusText = "Model loaded.";
  facemeshModel = _model;
});

function setup() {
  createCanvas(windowWidth, windowHeight);
  capture = createCapture(VIDEO);
  // capture.size(width, height);

  // this is to make sure the capture is loaded before asking facemesh to take a look otherwise facemesh will be very unhappy
  capture.elt.onloadeddata = function () {
    console.log("video initialized");
    videoDataLoaded = true;
  };

  capture.hide();
}

function draw() {
  randomSeed(seed);
  //otherwise super gnarly
  strokeJoin(ROUND);
  background(80);
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

  image(capture, 0, 0, capture.width, capture.height);
  // now draw all the other users' faces (& drawings) from the server
  push();
  scale(2);
  strokeWeight(2);
  noFill();
  stroke(255, 0, 0);
  drawFace(myFace);
  pop();

  push();
  fill(255, 0, 0);
  text(statusText, 2, 60);
  pop();
}

// draw a face object returned by facemesh
function drawFace(faceVertices, filled) {
  if (faceVertices != undefined) {
    const mesh = faceVertices.scaledMesh;
    connectOutlineVertices(mesh, outline);
    connectNoseVertices(mesh, nose);
    connectEyeVertices(mesh, eyeLeft);
    connectEyeVertices(mesh, eyeRight);
    connectOuterMouthVertices(mesh, mouthOuter);
    connectInnerMouthVertices(mesh, mouthInner);
  }
}

function connectInnerMouthVertices(vertices, connectionIndices) {
  stroke(255);
  strokeWeight(2);
  beginShape();

  for (let i = 0; i < connectionIndices.length; i++) {
    const vertexPoint = vertices[connectionIndices[i]];
    curveVertex(vertexPoint[0], vertexPoint[1]);
  }

  endShape(CLOSE);
}

function connectOuterMouthVertices(vertices, connectionIndices) {
  stroke(255);
  strokeWeight(2);
  beginShape();

  for (let i = 0; i < connectionIndices.length; i++) {
    const vertexPoint = vertices[connectionIndices[i]];
    if (
      connectionIndices[i] === 48 ||
      connectionIndices[i] === 49 ||
      connectionIndices[i] === 59
    ) {
      curveVertex(vertexPoint[0], vertexPoint[1]);
    } else if (
      connectionIndices[i] === 53 ||
      connectionIndices[i] === 54 ||
      connectionIndices[i] === 55
    ) {
      curveVertex(vertexPoint[0], vertexPoint[1]);
    } else {
      curveVertex(vertexPoint[0], vertexPoint[1]);
    }
  }

  endShape(CLOSE);
}

function connectNoseVertices(vertices, connectionIndices) {
  stroke(255);
  strokeWeight(2);
  beginShape();

  curveVertex(
    vertices[connectionIndices[0]][0],
    vertices[connectionIndices[0]][1]
  );
  curveVertex(
    vertices[connectionIndices[4]][0],
    vertices[connectionIndices[4]][1]
  );
  curveVertex(
    vertices[connectionIndices[6]][0],
    vertices[connectionIndices[6]][1]
  );
  curveVertex(
    vertices[connectionIndices[8]][0],
    vertices[connectionIndices[8]][1]
  );

  endShape(CLOSE);
}

function connectOutlineVertices(vertices, connectionIndices) {
  stroke(255);
  strokeWeight(2);
  beginShape();
  let yOffset = random(-10, 40);

  for (let i = 0; i < connectionIndices.length; i++) {
    const vertexPoint = vertices[connectionIndices[i]];
    if (connectionIndices[i] >= 6 && connectionIndices[i] <= 10) {
      curveVertex(vertexPoint[0], vertexPoint[1] + yOffset);
    } else {
      curveVertex(vertexPoint[0], vertexPoint[1]);
    }
  }

  endShape(CLOSE);
}

function connectEyeVertices(vertices, connectionIndices) {
  stroke(255);
  strokeWeight(2);
  beginShape();
  curveVertex(
    vertices[connectionIndices[0]][0],
    vertices[connectionIndices[0]][1]
  );
  for (let i = 0; i < connectionIndices.length; i++) {
    const vertexPoint = vertices[connectionIndices[i]];
    curveVertex(vertexPoint[0], vertexPoint[1]);
  }
  curveVertex(
    vertices[connectionIndices[0]][0],
    vertices[connectionIndices[0]][1]
  );
  curveVertex(
    vertices[connectionIndices[0]][0],
    vertices[connectionIndices[0]][1]
  );
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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight, false);
  // capture.size(windowWidth, windowHeight);
}

function mouseClicked() {
  seed = millis();
}

let shapeCollections = [];
let shapes = [];

let seconds = 0;
let minutes = 0;
let hours = 0;

let stepWidth = 40;
let clockRadius;

let dayPassed = false;

let ORIENTATIONS = {
  below: 0,
  above: 1,
};

let initialIterations = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  if (windowHeight <= windowWidth) {
    clockRadius = windowHeight / 2 - windowHeight / 10;
  } else {
    console.log("yes");
    clockRadius = windowWidth / 2 - windowWidth / 10;
  }
  if (height <= width) {
    stepWidth = height / 60;
  } else {
    stepWidth = width / 60;
  }
  colorMode(RGB);
  fill(52, 140, 235, 100);
  frameRate(1);
  translate(width / 2, height / 2, 0);
  drawStartingShape();
  angleMode(DEGREES);
}

function draw() {
  background("#5d7691");
  randomSeed(0);

  let currentDate = new Date();
  let currentHours = currentDate.getHours();
  let currentMinutes = currentDate.getMinutes();
  let currentSeconds = currentDate.getSeconds();
  if (currentHours >= 12) {
    currentHours -= 12;
  }

  initialIterations =
    currentHours * 3600 + currentMinutes * 60 + currentSeconds;
  for (let i = 0; i < initialIterations; i++) {
    if (i == initialIterations - 1) {
      stroke("#ffffff");
    } else {
      noStroke();
    }
    tick();
  }

  hours = 0;
  minutes = 0;
  seconds = 0;
}

function tick() {
  push();
  translate(width / 2, height / 2, 0);
  angleMode(DEGREES);
  let angle = map(hours, 0, 11, 0, 360);
  rotate(angle);
  translate(0, -clockRadius);

  let lastShape;
  if (seconds == 0) {
    lastShape = shapes[0];
  } else {
    lastShape = shapes[shapes.length - 1];
  }
  let startingPoint = lastShape.points[lastShape.points.length - 1];
  let connectingPoint = lastShape.getConnectorFor(startingPoint);
  let line = {
    start: startingPoint,
    end: connectingPoint,
  };
  let newPoint;
  if (lastShape.center.isAboveLine(line)) {
    newPoint = getNonOverlappingPoint(line, ORIENTATIONS.below);
  } else {
    newPoint = getNonOverlappingPoint(line, ORIENTATIONS.above);
  }
  let newShape = new Shape([startingPoint, connectingPoint, newPoint]);

  shapes.push(newShape);
  newShape.drawShape();
  updateTime();
  pop();
}

function updateTime() {
  seconds += 1;
  if (seconds >= 60) {
    seconds = 0;
    minutes += 1;
    if (minutes >= 60) {
      minutes = 0;
      hours += 1;
      if (hours >= 12) {
        hours = 0;
        dayPassed = true;
      }
    }
  }
}

function getNonOverlappingPoint(line, orientation) {
  let lineCenter = new Point(
    (line.start.x + line.end.x) / 2,
    (line.start.y + line.end.y) / 2
  );
  let newPoint;

  if (orientation == ORIENTATIONS.above) {
    do {
      newPoint = new Point(
        random(lineCenter.x - stepWidth, lineCenter.x + stepWidth),
        random(lineCenter.y - stepWidth, lineCenter.y + stepWidth)
      );
    } while (!newPoint.isAboveLine(line));
  } else {
    do {
      newPoint = new Point(
        random(lineCenter.x - stepWidth, lineCenter.x + stepWidth),
        random(lineCenter.y - stepWidth, lineCenter.y + stepWidth)
      );
    } while (newPoint.isAboveLine(line));
  }
  return newPoint;
}

function drawStartingShape() {
  let p1 = new Point(-10, -10);
  let p2 = new Point(10, -10);
  let p3 = new Point(10, 10);
  let p4 = new Point(-10, 10);
  let startingShape = new Shape([p1, p2, p3, p4]);
  shapes.push(startingShape);
  startingShape.drawShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight, false);
  background("#5d7691");
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  isAboveLine(line) {
    return (
      (line.end.x - line.start.x) * (this.y - line.start.y) -
        (line.end.y - line.start.y) * (this.x - line.start.x) >
      0
    );
  }
}

class Shape {
  constructor(points) {
    this.points = points;
    let centerX = (points[0].x + points[1].x + points[2].x) / 3;
    let centerY = (points[0].y + points[1].y + points[2].y) / 3;
    this.center = new Point(centerX, centerY);
  }

  drawShape() {
    colorMode(HSB);
    let h = map(hours, 0, 11, 0, 360);
    let s = map(seconds, 0, 59, 0, 100);
    let b = map(minutes, 0, 59, 0, 100);
    let a = map(seconds, 0, 59, 0, 1);
    fill(h, s, b, a);

    beginShape();
    for (let i = 0; i < this.points.length; i++) {
      const point = this.points[i];
      vertex(point.x, point.y);
    }
    endShape(CLOSE);
  }
  getConnectorFor(point) {
    if (random(0, 1) < 0.5) {
      if (this.points.indexOf(point) == 0) {
        return this.points[this.points.length - 1];
      } else {
        return this.points[this.points.indexOf(point) - 1];
      }
    } else {
      if (this.points.indexOf(point) == this.points.length - 1) {
        return this.points[0];
      } else {
        return this.points[this.points.indexOf(point) + 1];
      }
    }
  }
}

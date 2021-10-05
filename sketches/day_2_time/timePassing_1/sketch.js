let shapeCollections = [];
let shapes = [];

let ORIENTATIONS = {
  below: 0,
  above: 1,
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  fill(52, 140, 235, 100);
  noStroke();
  frameRate(1);
  translate(width / 2, height / 2, 0);
  background("#5d7691");
  drawStartingShape();
  angleMode(DEGREES);
}

function draw() {
  translate(width / 2, height / 2, 0);

  let lastShape = shapes[shapes.length - 1];
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

  for (let i = 0; i < shapes.length - 1; i++) {
    const shape = shapes[i];
    if (collidePointPoly(newShape.points[2], shape.points)) {
      console.log(
        "new point " +
          newShape.points[2] +
          " of new shape " +
          newShape +
          " collides with existing shape: " +
          shape
      );
    }
  }

  shapes.push(newShape);
  newShape.drawShape();
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
        random(lineCenter.x - 100, lineCenter.x + 100),
        random(lineCenter.y - 100, lineCenter.y + 100)
      );
    } while (!newPoint.isAboveLine(line));
  } else {
    do {
      newPoint = new Point(
        random(lineCenter.x - 100, lineCenter.x + 100),
        random(lineCenter.y - 100, lineCenter.y + 100)
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
}

function mouseClicked() {
  background("#5d7691");
  shapeCollections[shapeCollections.length] = shapes;
  shapes = [];
  drawStartingShape();
  push();
  pop();
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
    fill(map(shapes.length, 0, 60, 0, 255));
    stroke(map(shapes.length, 0, 60, 255, 0));

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
    // return this.points[1];
  }
}

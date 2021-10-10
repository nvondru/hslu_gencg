function setup() {
  //   angleMode(DEGREES);
}

t = 0;
function draw() {
  createCanvas((w = 500), w);
  n = sin;
  t += 0.03;
  for (c = 0; c < w; c += 31)
    for (r = 0; r < w; r += 31)
      if ((r + c) % 2 < 1) {
        beginShape(fill(0));
        for (i = 0; i < 4; i++)
          for (
            b =
              (i * PI) / 2 +
              max(min(n(t + dist(w, w, c, r)) * 1.5 + n(t / 2) / 2, 1), -1) *
                PI,
              a = b + 3.9;
            a > b + 2.3;
            a -= 0.1
          )
            vertex(c + cos(b) * 32 + cos(a) * 18, r + n(b) * 32 + n(a) * 18);
        endShape();
      }
}

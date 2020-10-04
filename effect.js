class Effect {

  constructor(x, y, c) {
    this.x = x;
    this.y = y;
    this.circles = [];
    this.circles[0] = new Circle(this.x, this.y, 11 * w / 144, w / 3, w / 18, w / 72, c);
    this.circles[1] = new Circle(this.x, this.y, 11 * w / 144, w / 3, w / 36, w / 120, c);
    this.circles[2] = new Circle(this.x, this.y, 11 * w / 144, w / 3, 5 * w / 36, w / 360, c);
    this.circles[3] = new Circle(this.x, this.y, 11 * w / 144, w / 3, w / 12, w / 240, c);
  }

  explode() {
    for (var i = 0; i < this.circles.length; i++) {
      this.circles[i].activate();
    }
  }

  display() {
    for (var i = 0; i < this.circles.length; i++) {
      this.circles[i].display();
    }
  }

  update() {
    for (var i = 0; i < this.circles.length; i++) {
      this.circles[i].strokeWidth -= w / 2400;
    }
  }
}
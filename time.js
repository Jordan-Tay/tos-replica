class Time {

  constructor() {
    this.x = w / 36;
    this.y = 34 * w / 36;
    this.w = 34 * w / 36;
    this.h = w / 18;
    this.t = 20;
    this.velW = 0;
    this.start = false;
    this.color = color("#FF6B9F");
  }

  display() {
    strokeWeight(2);
    stroke(0);
    fill("#382311");
    rect(0, this.y, w, this.h);
    fill("#211300");
    rect(this.x, this.y, this.w, this.h, this.h);
    fill(this.color);
    rect(this.x, this.y, this.w, this.h, this.h);
  }

  decrease() {
    this.velW = (this.w / this.t) / getFrameRate();
    this.color = color("#8AFF54");
  }

  reset() {
    this.start = false;
    this.velW = 0;
    this.w = 34 * w / 36;
    this.color = color("#FF6B9F");
  }

  update() {
    if (this.w - this.velW <= 0) {
      mouseReleased();
    }
    this.w -= this.velW;
  }
}
class Piece {

  constructor(x, y, t) {
    this.x = x;
    this.y = y;
    this.t = t;
    this.supposedX = x;
    this.supposedY = y;
    this.velX = 0;
    this.velY = 0;
    this.acc = 1.3;
    this.snapping = false;
    this.falling = false;
    this.opacity = 255;
    this.color;
  }

  display() {
    switch(this.t) {
      case 0:
        this.color = color("#FF0000");
        break;
      case 1:
        this.color = color("#00B300");
        break;
      case 2:
        this.color = color("#4DC3FF");
        break;
      case 3:
        this.color = color("#FCE703");
        break;
      case 4:
        this.color = color("#9900E6");
        break;
      default:
        this.color = color("#FF99DD");
    }
    this.color.setAlpha(this.opacity);
    strokeWeight(this.opacity > 0 ? 1 : 0);
    stroke(0);
    fill(this.color);
    ellipse(this.x, this.y, 11 * w / 72);
  }

  snapX(x) {
    this.supposedX = x;
    this.velX = (this.supposedX - this.x) / 10;
    this.snapping = true;
  }

  snapY(y) {
    this.supposedY = y;
    this.velY = (this.supposedY - this.y) / 5;
    this.snapping = true;
  }

  fall(y) {
    this.supposedY = y;
    this.velY = (this.supposedY - this.y) / 50;
    this.falling = true;
  }

  update() {
    if (this.supposedX != this.x) {
      this.x += this.velX;
    }
    if (this.supposedY != this.y) {
      this.y += this.velY;
    }
    if ((this.velX < 0 && this.x < this.supposedX) || (this.velX > 0 && this.x > this.supposedX)) {
      this.x = this.supposedX;
      this.velX = 0;
      this.snapping = false;
      this.falling = false;
    }
    if ((this.velY < 0 && this.y < this.supposedY) || (this.velY > 0 && this.y > this.supposedY)) {
      this.y = this.supposedY;
      this.velY = 0;
      this.snapping = false;
      this.falling = false;
    }
    if (falling) {
      this.velY += this.acc;
    }
  }
}
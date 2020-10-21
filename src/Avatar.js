class Avatar {
  constructor(id, xPos, yPos, color) {
    this.id = id;
    this.xPos = xPos;
    this.yPos = yPos;
    this.color = color;
    this.size = 20;
  }

  //   move(x, y) {
  //     this.xPos += x;
  //     this.yPos += y;

  //     // need to rewrite check boundary

  //     if (this.xPos > width - this.size) this.xPos = width;
  //     if (this.yPos > height) this.yPos = height;
  //     if (this.xPos == 0) this.xPos = 0;
  //     if (this.yPos == 0) this.yPos = 0;
  //   }

  displayDistance(distance) {
    fill(0);
    text(distance, this.xPos - this.size / 2, this.yPos - this.size);
  }

  display() {
    rectMode(CENTER);
    fill(this.color.r, this.color.g, this.color.b);
    rect(this.xPos, this.yPos, this.size, this.size);
  }
}

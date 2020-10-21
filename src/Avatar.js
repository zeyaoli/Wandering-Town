class Avatar {
  constructor(id, xPos, yPos, color) {
    this.id = id;
    this.xPos = xPos;
    this.yPos = yPos;
    this.color = color;
    this.size = 20;
  }

  displayDistance(p, distance) {
    p.fill(0);
    p.text(distance, this.xPos - this.size / 2, this.yPos - this.size);
  }

  display(p) {
    p.rectMode(p.CENTER);
    p.fill(this.color.r, this.color.g, this.color.b);
    p.rect(this.xPos, this.yPos, this.size, this.size);
  }
}

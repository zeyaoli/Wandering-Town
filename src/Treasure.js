class Treasure {
  constructor(x, y, content) {
    this.x = x;
    this.y = y;
    this.content = content;
  }

  //check distance between the treasure itself

  display() {
    fill(255);
    rect(this.x, this.y, 20, 20);
  }
}

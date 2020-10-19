class Treasure {
  constructor(x, y, content) {
    this.x = x;
    this.y = y;
    this.content = content;
  }

  //check distance between the treasure itself

  display() {
    fill(255);
    stroke(255);
    rect(this.x, this.y, 20, 20);
    let textRectHeight = 50;
    fill(30);
    rect(0, height - textRectHeight / 2, 1600, textRectHeight);
    fill(255);
    text(this.content, 20, height - textRectHeight / 2);
  }
}

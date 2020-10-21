class Treasure {
  constructor(x, y, content) {
    this.x = x;
    this.y = y;
    this.content = content;
  }

  //check distance between the treasure itself

  display(p) {
    p.fill(255);
    p.stroke(255);
    p.rect(this.x, this.y, 20, 20);
    // let textRectHeight = 50;
    // fill(30);
    // rect(0, height - textRectHeight / 2, 1600, textRectHeight);
    // fill(255);
    // text(this.content, 20, height - textRectHeight / 2);
    // console.log(this.content);
  }

  showText(p) {
    // console.log(this.content);
    let textRectHeight = 50;
    p.rectMode(p.CORNER);
    p.fill(30);
    p.rect(0, 750, 800, 50);
    p.fill(255);
    p.text(this.content, 20, 780);
  }
}

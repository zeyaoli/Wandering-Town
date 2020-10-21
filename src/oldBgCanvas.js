let contentStr =
  "Hello, 你好, ¡Hola!, Ahoj, こんにちは, 안녕하세요, Hej, Hallo, Olá, Hello, 你好, ¡Hola!, Ahoj, こんにちは, 안녕하세요, Hej, Hallo, Olá,";
let contentArr = contentStr.split(" ");

let words = [];

let grids = [];

let xOffset;

let yDefault = 65;

let spacing = 30;

function setup() {
  let size = 60;
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.id("bgCanvas");
  textSize(size);

  for (let col = 0; col < floor(windowHeight / size); col++) {
    grids.push(new WordLine(col * -120 + random(-50, 50), 78 * (col + 1)));
  }

  for (let i = 0; i < grids.length; i++) {
    grids[i].init();
  }
}

function draw() {
  background(255);

  for (let i = 0; i < grids.length; i++) {
    if (i % 2 == 0) {
      grids[i].speed = 1;
    }
    grids[i].moveLine();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class WordLine {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.words = [];
    this.speed = -1;
  }
  // initiate the words and push it to the wordline
  init() {
    for (let i = 0; i < contentArr.length; i++) {
      this.words.push(new Word(this.x, this.y, contentArr[i]));
    }

    // update xPos value
    for (let i = 0; i < this.words.length; i++) {
      if (i > 0) {
        xOffset = this.words[i - 1].sWidth + spacing;
        this.words[i].x = this.words[i - 1].x + xOffset;
      }
    }
  }
  //move and display words in a line
  moveLine() {
    for (let i = 0; i < this.words.length; i++) {
      //update x value and loop it back
      this.words[i].x += this.speed;
      if (this.speed == -1) {
        if (this.words[i].x + this.words[i].sWidth <= 0) {
          if (i > 0) {
            this.words[i].x =
              this.words[i - 1].x + this.words[i - 1].sWidth + spacing;
          } else {
            this.words[i].x =
              this.words[this.words.length - 1].x +
              this.words[this.words.length - 1].sWidth +
              spacing;
          }
        }
      } else if (this.speed == 1) {
        if (this.words[i].x >= width) {
          if (i < this.words.length - 1) {
            this.words[i].x =
              this.words[i + 1].x - spacing - this.words[i].sWidth;
          } else {
            this.words[this.words.length - 1].x =
              this.words[0].x -
              spacing -
              this.words[this.words.length - 1].sWidth;
          }
          // console.log(this.words[this.words.length - 1].x)
          // console.log(this.words[0].x);
        }
      }
      this.words[i].display();
    }
  }
}

class Word {
  constructor(x, y, content) {
    this.x = x;
    this.y = y;
    this.content = content;
    this.sWidth = textWidth(this.content);
  }

  display(y) {
    text(this.content, this.x, this.y);
  }
}

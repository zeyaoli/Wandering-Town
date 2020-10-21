let contentStr =
  "Hello, 你好, ¡Hola!, Ahoj, こんにちは, 안녕하세요, Hej, Hallo, Olá, Hello, 你好, ¡Hola!, Ahoj, こんにちは, 안녕하세요, Hej, Hallo, Olá,";
let contentArr = contentStr.split(" ");

let words = [];

let grids = [];

let xOffset;

let yDefault = 65;

let spacing = 30;

let bgCanvasSketch = function (p) {
  window.p = p;

  p.setup = () => {
    let size = 60;
    let cnv = p.createCanvas(p.windowWidth, p.windowHeight);
    cnv.id("bgCanvas");
    p.textSize(size);

    for (let col = 0; col < p.floor(p.windowHeight / size); col++) {
      grids.push(new WordLine(col * -120 + p.random(-50, 50), 78 * (col + 1)));
    }

    for (let i = 0; i < grids.length; i++) {
      grids[i].init(p);
    }
  };

  p.draw = () => {
    p.background(255);

    for (let i = 0; i < grids.length; i++) {
      //if odd num
      if (i % 2 == 0) {
        grids[i].speed = 1;
      }
      grids[i].moveLine(p);
    }
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};

//Create landing p5 canvas
let bgCanvas = new p5(bgCanvasSketch, 'landing');

class WordLine {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.words = [];
    this.speed = -1;
  }
  // initiate the words and push it to the wordline
  init(p) {
    for (let i = 0; i < contentArr.length; i++) {
      this.words.push(new Word(this.x, this.y, contentArr[i], p));
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
  moveLine(p) {
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
        if (this.words[i].x >= p.width) {
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
      // console.log(this.words[i]);
      this.words[i].display(p);
    }
  }
}

class Word {
  constructor(x, y, content, p) {
    this.x = x;
    this.y = y;
    this.content = content;
    this.sWidth = p.textWidth(this.content);
  }

  display(p) {
    // console.log(p.textSize(this.content));
    // this.sWidth = p.textWidth(this.content);
    p.text(this.content, this.x, this.y);
  }
}

const firstButton = document.getElementById("firstButton");
const submitButton = document.getElementById("submit");

const startBox = document.getElementById("start");
const questionBox = document.getElementById("question-container");
// const bgCanvas = document.getElementById("bgCanvas");

// console.log(bgCanvas);

firstButton.addEventListener("click", () => {
  startBox.style.display = "none";
  questionBox.style.display = "flex";
});

// ============================================================================

let players = [];
let me;
let mytreasure;
let myId;
let xPos = 0;
let yPos = 0;
let color = { r: 0, g: 0, b: 0 };

let treasures = [];
let distance;
let distances = [];

let canvasW;
let canvasH;
let txPos;
let tyPos;

let othersAround = false;

let contents = [
  "I am the black cat",
  "I am a Nokia flip phone",
  "I am a Twitter bot",
];
let content = "";

let socket = io.connect();

socket.on("connect", () => {
  console.log("connected");
});

// setup the canvas
let sketch = function (p) {
  window.p = p;
  p.setup = function () {
    let cnv = p.createCanvas(800, 800);
    cnv.id("game");
    xPos = p.width / 2;
    yPos = p.height / 2;
    color = {
      r: Math.floor(Math.random() * 255),
      g: Math.floor(Math.random() * 255),
      b: Math.floor(Math.random() * 255),
    };

    txPos = p.random(20, p.width - 20);
    tyPos = p.random(20, p.height - 20);

    me = new Avatar(0, xPos, yPos, color, p);

    // content = contents[floor(Math.random()*contents.length)];
    //set up my treasure
    // treasures.push(new Treasure(txPos, tyPos, content));

    socket.emit("join", { xPos, yPos, color });
    // socket.emit("drop", { txPos, tyPos, content});

    //get the default distance to the array;
    for (let i = 0; i < treasures.length; i++) {
      distance = p.floor(
        p.dist(me.xPos, me.yPos, treasures[i].x, treasures[i].y)
      );

      distances.push(distance);
    }
  };

  p.draw = function () {
    p.background(100);
    p.fill(200);
    p.rectMode(p.CORNER);
    p.rect(0, 0, p.width, p.height);
    //draw me
    me.display(p);
    //draw other players
    players.map((e) => e.display(p));

    //show all treasure
    // treasures.map((e) => e.display(p));

    //move
    if (p.keyIsDown(p.LEFT_ARROW)) {
      move(-2, 0);
    } else if (p.keyIsDown(p.RIGHT_ARROW)) {
      move(2, 0);
    } else if (p.keyIsDown(p.UP_ARROW)) {
      move(0, -2);
    } else if (p.keyIsDown(p.DOWN_ARROW)) {
      move(0, 2);
    }

    //update distances between users and treasures;
    for (let i = 0; i < treasures.length; i++) {
      distance = p.floor(
        p.dist(me.xPos, me.yPos, treasures[i].x, treasures[i].y)
      );
      othersAround = false;
      for (let j = 0; j < players.length; j++) {
        otherDistance = p.floor(
          p.dist(
            players[j].xPos,
            players[j].yPos,
            treasures[i].x,
            treasures[i].y
          )
        );
        if (otherDistance < 20) {
          othersAround = true;
        }
      }

      if (distance < 20 && othersAround == true) {
        treasures[i].display(p);
        treasures[i].showText(p);
      }

      distances[i] = distance;
    }

    //get the minimum distance
    distances.sort((a, b) => a - b);
    me.displayDistance(p, distances[0]);
  };

  function move(x, y) {
    xPos += x;
    yPos += y;

    if (xPos > p.width) xPos = p.width;
    if (yPos > p.height) yPos = p.height;
    if (xPos <= me.size / 2) xPos = me.size / 2;
    if (yPos <= me.size / 2) yPos = me.size / 2;

    // console.log("xPos: " + xPos + ",yPos: " + yPos);
    me.xPos = xPos;
    me.yPos = yPos;
    socket.emit("move", { xPos, yPos });
  }
};

let game = new p5(sketch);

// function setup() {
//   let cnv = createCanvas(800, 800);
//   cnv.id("game");
//   xPos = width / 2;
//   yPos = height / 2;
//   color = {
//     r: Math.floor(Math.random() * 255),
//     g: Math.floor(Math.random() * 255),
//     b: Math.floor(Math.random() * 255),
//   };

//   txPos = random(20, width - 20);
//   tyPos = random(20, height - 20);

//   me = new Avatar(0, xPos, yPos, color);

//   // content = contents[floor(Math.random()*contents.length)];
//   //set up my treasure
//   // treasures.push(new Treasure(txPos, tyPos, content));

//   socket.emit("join", { xPos, yPos, color });
//   // socket.emit("drop", { txPos, tyPos, content});

//   //get the default distance to the array;
//   for (let i = 0; i < treasures.length; i++) {
//     distance = floor(dist(me.xPos, me.yPos, treasures[i].x, treasures[i].y));

//     distances.push(distance);
//   }
// }

// draw the canvas
// function draw() {
//   background(200);
//   //draw me
//   me.display();
//   //draw other players
//   players.map((e) => e.display());

//   //show all treasure
//   //   treasures.map((e) => e.display());

//   //move
//   if (keyIsDown(LEFT_ARROW)) {
//     move(-2, 0);
//   } else if (keyIsDown(RIGHT_ARROW)) {
//     move(2, 0);
//   } else if (keyIsDown(UP_ARROW)) {
//     move(0, -2);
//   } else if (keyIsDown(DOWN_ARROW)) {
//     move(0, 2);
//   }

//   //update distances between users and treasures;
//   for (let i = 0; i < treasures.length; i++) {
//     distance = floor(dist(me.xPos, me.yPos, treasures[i].x, treasures[i].y));
//     othersAround = false;
//     for (let j = 0; j < players.length; j++) {
//       otherDistance = floor(
//         dist(players[j].xPos, players[j].yPos, treasures[i].x, treasures[i].y)
//       );
//       if (otherDistance < 20) {
//         othersAround = true;
//       }
//     }

//     if (distance < 20 && othersAround == true) {
//       treasures[i].display();
//       treasures[i].showText();
//     }

//     distances[i] = distance;
//   }

//   //get the minimum distance
//   distances.sort((a, b) => a - b);
//   me.displayDistance(distances[0]);
// }

//initial other players that already in this map
function initPlayers(people) {
  players = [];

  people
    .filter((e) => e.id != myId)
    .forEach((person) => {
      players.push(
        new Avatar(person.id, person.xPos, person.yPos, person.color)
      );
    });

  // console.log(players);
}

//initial treasures that already in this map
function initTreasures(items) {
  treasures = [];

  items
    .filter((e) => e.id != myId)
    .forEach((item) => {
      treasures.push(
        new Treasure(item.txPos, item.tyPos, item.content, item.p)
      );
    });

  // console.log(treasures);
}

// move position
// function move(x, y) {
//   xPos += x;
//   yPos += y;

//   if (xPos > width) xPos = width;
//   if (yPos > height) yPos = height;
//   if (xPos <= me.size / 2) xPos = me.size / 2;
//   if (yPos <= me.size / 2) yPos = me.size / 2;

//   // console.log("xPos: " + xPos + ",yPos: " + yPos);
//   me.xPos = xPos;
//   me.yPos = yPos;
//   socket.emit("move", { xPos, yPos });
// }

//submit function
window.onload = submitButton.addEventListener("click", submit);

function submit() {
  let text = document.getElementById("user-input");
  content = text.value;
  treasures.push(new Treasure(txPos, tyPos, content));
  socket.emit("drop", { txPos, tyPos, content });
  //   document.getElementById("bgCanvas").style.display = "none";
  questionBox.style.display = "none";
  document.getElementById("game").style.display = "block";
}

//================================= Socket.on =============================

//Update when the player logins
socket.on("login", (data) => {
  myId = data.myId;
  initPlayers(data.players);
  initTreasures(data.treasures);
});

//Update when the player joins
socket.on("join", (data) => {
  players.push(new Avatar(data.id, data.xPos, data.yPos, data.color));
});

//Update the treasure
socket.on("drop", (data) => {
  treasures.push(new Treasure(data.txPos, data.tyPos, data.content));
  console.log(treasures);
});

//Update when the player moves
socket.on("move", (data) => {
  const index = players.findIndex((e) => e.id == data.id);
  if (index > -1) {
    players[index].xPos = data.xPos;
    players[index].yPos = data.yPos;
  }
});

//Update when the player disconnect
socket.on("quit", (id) => {
  const index = players.findIndex((e) => e.id == id);

  if (index > -1) {
    players.splice(index, 1);
  }
});

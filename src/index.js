let players = [];
let me;
let myId;
let xPos = 0;
let yPos = 0;
let color = { r: 0, g: 0, b: 0 };

let treasures = [];
let distance;
let distances = [];

let contents = [
  "I am the black cat",
  "I am a Nokia flip phone",
  "I am a Twitter bot",
];

let socket = io.connect();

socket.on("connect", () => {
  console.log("connected");
});

// setup the canvas
function setup() {
  createCanvas(800, 800);

  xPos = Math.floor(Math.random() * 400);
  yPos = Math.floor(Math.random() * 400);
  color = {
    r: Math.floor(Math.random() * 255),
    g: Math.floor(Math.random() * 255),
    b: Math.floor(Math.random() * 255),
  };
  // console.log(color);
  me = new Avatar(0, xPos, yPos, color);

  //set up treasure
  for (let i = 0; i < contents.length; i++) {
    treasures.push(
      new Treasure(random(20, width - 20), random(20, height - 20), contents[i])
    );
  }

  //get the default distance to the array;
  for (let i = 0; i < treasures.length; i++) {
    distance = floor(dist(me.xPos, me.yPos, treasures[i].x, treasures[i].y));

    distances.push(distance);
  }

  socket.emit("join", { xPos, yPos, color });
}

// draw the canvas
function draw() {
  background(200);
  //draw me
  me.display();
  //draw other players
  players.map((e) => e.display());

  //move
  if (keyIsDown(LEFT_ARROW)) {
    move(-2, 0);
  } else if (keyIsDown(RIGHT_ARROW)) {
    move(2, 0);
  } else if (keyIsDown(UP_ARROW)) {
    move(0, -2);
  } else if (keyIsDown(DOWN_ARROW)) {
    move(0, 2);
  }

  //update distances between users and treasures;
  for (let i = 0; i < treasures.length; i++) {
    distance = floor(dist(me.xPos, me.yPos, treasures[i].x, treasures[i].y));
    if (distance < 20) {
      treasures[i].display();
    }

    distances[i] = distance;
  }

  //get the minimum distance
  distances.sort((a, b) => a - b);
  me.displayDistance(distances[0]);
}

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

  console.log(players);
}

// move position
function move(x, y) {
  xPos += x;
  yPos += y;

  if (xPos > width) xPos = width;
  if (yPos > height) yPos = height;
  if (xPos <= 0) xPos = 0;
  if (yPos <= 0) yPos = 0;

  // console.log("xPos: " + xPos + ",yPos: " + yPos);
  me.xPos = xPos;
  me.yPos = yPos;
  socket.emit("move", { xPos, yPos });
}

//================================= Socket.on =============================

//Update when the player logins
socket.on("login", (data) => {
  myId = data.myId;
  initPlayers(data.players);
});

//Update when the player joins
socket.on("join", (data) => {
  players.push(new Avatar(data.id, data.xPos, data.yPos, data.color));
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

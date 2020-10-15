let players = [];

let socket = io.connect();

socket.on('connect', ()=>{
    console.log('connected');
})


function setup(){
    createCanvas(800, 800);
    socket.on('update', players => updatePlayers(players));
    // here doesn't work
    socket.on('disconnected', removePlayer(playerId));
}

function draw(){
    background(200);
    for(let i=0; i<players.length; i++){
        players[i].display();
    }
}

function updatePlayers(serverPlayers){
    for(let i=0; i<serverPlayers.length; i++){
        let playerFromServer = serverPlayers[i];
        if(!playerExists(playerFromServer)){
            players.push(new Avatar(playerFromServer));
        }
    }
}

function playerExists(playerFromServer){
    for(let i=0; i<players.length; i++){
        if(players[i].id === playerFromServer){
            return true;
        } 
        return false;
    }
}

function removePlayer(playerId) {
    players = players.filter(player => player.id !== playerId);
}

class Avatar{
    constructor(player){
        this.id = player.id;
        this.rgb = player.rgb;
        this.x = player.x;
        this.y = player.y;
        // this.pos = createVector(width/2, height/2);
        this.size = 20;
    }

    move(){
        if(keyIsDown(LEFT_ARROW)){
            this.x -= 2;
        } else if (keyIsDown(RIGHT_ARROW)){
            this.x += 2;
        } else if(keyIsDown(UP_ARROW)){
            this.y -= 2;
        } else if(keyIsDown(DOWN_ARROW)){
            this.y += 2;
        }
        // socket.emit('move', pos);
    }

    display(){
        rectMode(CENTER);
        fill(this.rgb.r, this.rgb.g, this.rgb.b);
        rect(this.x, this.y, this.size, this.size);
    }
}
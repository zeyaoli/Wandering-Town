const port = process.env.PORT || 8000;
const express = require('express');
const app = express();


app.use(express.static('./'));

app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/index.html');
})

const server = require('http').createServer(app).listen(port, ()=>console.log(`Your app is listening on port ${port}`));

const io = require('socket.io').listen(server);

let players = [];
let treasures = [];

// setInterval(updateGame, 16);

io.sockets.on('connection', (socket)=>{
    socket.emit("login", {myId: socket.id, players, treasures});

    //client join
    socket.on("join", (data) => {
        const {xPos, yPos, color} = data;
        const player = {
            id: socket.id,
            xPos,
            yPos,
            color
        }
        players.push(player);
        console.log("We have a new client: " + player.id);

        // console.log(players);
        socket.broadcast.emit("join", player);
    });

    //Drop a treasue
    socket.on("drop", (data) => {
        const {txPos, tyPos, content} = data;
        const treasure = {
            txPos,
            tyPos,
            content
        }
        treasures.push(treasure);
        console.log("We got a new treasure!");

        console.log(treasures);
        socket.broadcast.emit("drop", treasure);
    });


    //client move
    socket.on("move", (data) => {
        const {xPos,yPos} = data;
        const index = players.findIndex((e) =>e.id == socket.id);
        if(index > -1){
            players[index].xPos = xPos;
            players[index].yPos = yPos;
        }

        socket.broadcast.emit("move", {id: socket.id, xPos: xPos, yPos: yPos});

    });
    

    //client disconnect
    socket.on("disconnect", function () {
        //console.log("Client has disconnected " + socket.id);
        const index = players.findIndex((e) =>e.id == socket.id);
        if(index > -1){
            console.log(socket.id + " disconnected.");
            players.splice(index, 1);
        }
        socket.broadcast.emit("quit", socket.id);
        
    });
});

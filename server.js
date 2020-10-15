const port = process.env.PORT || 8000;
const express = require('express');
const app = express();

const Player = require('./Player');

app.use(express.static('./'));

app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/index.html');
})

const server = require('http').createServer(app).listen(port, ()=>console.log(`Your app is listening on port ${port}`));

const io = require('socket.io').listen(server);

let players = [];

setInterval(updateGame, 16);

io.sockets.on('connection', (socket)=>{
    console.log(`We have a new client ${socket.id}`);
    players.push(new Player(socket.id));
    console.log(players);

    socket.on('disconnect', function () {
        console.log("Client has disconnected " + socket.id);
        socket.emit('disconnected', socket.id);
        players = players.filter(player => player.id !== socket.id);
    });
})
function updateGame() {
    io.sockets.emit("update", players);
}
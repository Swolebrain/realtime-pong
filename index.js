const express = require('express');
const PORT = 3002;
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const CONNECTION_TIMEOUT = 10000;
const players = {};

app.use( express.static("static")  );

io.on("connection", function(socket){
  console.log("NEW PLAYER CONNECTED: ");
  console.log(socket.id);
  var playerCount = 0;
  for (var socketId in players){
    if (new Date().getTime() - players[socketId].lastMove > CONNECTION_TIMEOUT){
      delete players[socketId];
    }
    else{
      playerCount++;
    }
  }
  if (playerCount < 2){
    players[socket.id] = {x:300, y:100, lastMove: new Date().getTime()};
    socket.on("player_moved", function(data){
        players[socket.id] = data;
        socket.broadcast.emit("player_moved", players);
    });
    io.sockets.emit("player_joined", {
      id: socket.id,
      role: "player",
      players: players
    });
    console.log("Joined as player");
  }
  else{
    io.sockets.emit("player_joined", {
      id: socket.id,
      role: "spectator",
      players:players
    });
    console.log("Joined as spectator");
  }
  socket.on("disconnect", function(){
    if (players[socket.id])
      delete players[socket.id];
  });
});

//setInterval(()=>console.log(players), 2000);

app.get("/", function(req,res){
  res.sendFile(__dirname + "/static/index.html");
});

http.listen(PORT, ()=>console.log("Server Listening on port "+PORT));

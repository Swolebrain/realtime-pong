const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const ioClient = io();


let localPlayer = null;
let remotePlayers = [];

function gameLoop(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (localPlayer){
    localPlayer.update();
    localPlayer.render(ctx);
  }
  remotePlayers.forEach(p=>{
    p.render(ctx)
  });
  window.requestAnimationFrame(gameLoop);
}
gameLoop();

ioClient.on("player_moved", function(players){
  remotePlayers.forEach((e,i)=>{
    if (!players[e.socketId]) {
      return delete remotePlayers[i];
    }
    e.x = players[e.socketId].x;
    e.y = players[e.socketId].y;
  });
});

ioClient.on("player_joined", function(msg){
  console.log("player_joined fired");
  if (msg.id === ioClient.id){ //i joined
    for (var playerId in msg.players){
      let pData = msg.players[playerId];

      if ( playerId === ioClient.id){
        localPlayer = new Player(pData.x, pData.y, false, ioClient.id);
        localPlayer.initControls(2.5);
      }
      else{
        remotePlayers.push(new Player(pData.x, pData.y, true, playerId));
      }
    }
  }
  else {//someone else joined
    if (msg.role == "spectator"){
      //nothing
    }
    else{
      remotePlayers = [];
      for (var playerId in msg.players){
        let p = msg.players[playerId];
        if (playerId != ioClient.id)
        remotePlayers.push(new Player(p.x, p.y, true, playerId));
      }
      console.log(remotePlayers);
    }
  }
});

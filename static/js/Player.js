function Player(x,y, isRemote, socketId){
  this.x = x;
  this.y = y;
  this.velX = 0;
  this.velY = 0;
  this.isRemote = isRemote;
  this.socketId = socketId;
  this.ticks = 0;
}
Player.prototype.update = function(){
  this.x += this.velX;
  this.y += this.velY;
  if (this.ticks++ % 15 === 0)
    ioClient.emit("player_moved", {id: this.socketId,
                                x: this.x, y: this.y,
                                lastMove: new Date().getTime()});
};
Player.prototype.render = function(ctx){
  if (this.isRemote){
    ctx.save();
    ctx.strokeStyle = "#0000FF";
    ctx.strokeRect(this.x, this.y, 50, 150);
    ctx.restore();
  }
  else{
    ctx.strokeRect(this.x, this.y, 50, 150);
  }
};
Player.prototype.initControls = function(speed){
  let self = this;
  window.onkeydown = function(e){
    if (e.keyCode === 37) self.velX = -speed;
    if (e.keyCode === 39) self.velX = speed;
    if (e.keyCode === 38) self.velY = -speed;
    if (e.keyCode === 40) self.velY = speed;
  }
  window.onkeyup = function(e){
    if (e.keyCode === 37 && self.velX === -speed) self.velX = 0;
    if (e.keyCode === 39 && self.velX === speed) self.velX = 0;
    if (e.keyCode === 38 && self.velY === -speed) self.velY = 0;
    if (e.keyCode === 40 && self.velY === speed) self.velY = 0;
  }
};

function Ball(x,y, side){
  this.x = x;
  this.y = y;
  this.side = side;
}
Ball.prototype.render = function(ctx){
  ctx.fillRect(this.x, this.y, this.side, this.side);
}

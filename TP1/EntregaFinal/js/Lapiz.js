class Lapiz extends Pincel {
  constructor(x, y, fill, radius, ctx) {
    super(x, y, fill, ctx);
    this.radius = radius;
  }

  draw(e) {
    super.draw(e);
    this.ctx.beginPath();
    ctx.moveTo(this.posX, this.posY);
    ctx.lineTo(e.layerX, e.layerY);
    ctx.stroke();
    this.ctx.closePath();
  }

  // onCanvas(x, y) {
  //   let _x = this.posX - x;
  //   let _y = this.posY - y;
  //   return Math.sqrt(_x * _x + _y * _y) < this.radius;
  // }
}

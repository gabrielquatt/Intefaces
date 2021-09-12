class Lapiz extends Pincel {
  constructor(x, y, fill, radius, ctx) {
    super(x, y, fill, ctx);
    this.radius = radius;
    console.log(this.fill);
  }

  draw() {
    super.draw();
    this.ctx.beginPath();
    this.ctx.arc(this.posX, this.posY, this.radius, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.closePath();
  }

  // onCanvas(x, y) {
  //   let _x = this.posX - x;
  //   let _y = this.posY - y;
  //   return Math.sqrt(_x * _x + _y * _y) < this.radius;
  // }
}

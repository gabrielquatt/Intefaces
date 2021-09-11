class Lapiz extends Figure {
  constructor(x, y, fill, ctx, radius) {
    super(x, y, fill, ctx);
    this.radius = radius;
  }

  draw() {
    super.draw();
    this.context.beginPath();
    this.context.arc(this.posX, this.posY, this.radius, 0, 2 * Math.PI);
    this.context.fill();
    this.context.closePath();
  }

  onCanvas(x, y) {
    let _x = this.posX - x;
    let _y = this.posY - y;
    return Math.sqrt(_x * _x + _y * _y) < this.radius;
  }
}

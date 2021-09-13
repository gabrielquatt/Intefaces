class Pincel {
  constructor(x, y, fill, ctx) {
    this.posX = x;
    this.posY = y;
    this.fill = fill;
    this.ctx = ctx;
  }

  draw(e) {
    this.ctx.fillStyle = this.fill;
  }

  setPosition(x, y) {
    this.posX = x;
    this.posY = y;
  }

  getPosition() {
    return {
      posX: this.x,
      posY: this.posY,
    };
  }

  setFill(fill) {
    this.fill = fill;
  }

  // onCanvas(){}
}

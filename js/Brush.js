class Brush {
  constructor(x, y, stroke, ctx, width) {
    this.posX = x;
    this.posY = y;
    this.ctx = ctx;
    this.ctx.lineWidth = width;
    this.ctx.strokeStyle = stroke;
    this.ctx.lineCap = "round";
  }

  draw(x, y) {
    this.ctx.beginPath();
    this.ctx.moveTo(this.posX, this.posY);
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    this.setPosition(x, y);
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

  setStroke(stroke) {}

  setLineWidth(width) {
    this.ctx.lineWidth = width;
  }



}

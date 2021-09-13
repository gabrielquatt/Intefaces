class Brush {
  constructor(x, y, stroke, ctx, width, type) {
    this.posX = x;
    this.posY = y;
    this.stroke = stroke;
    this.ctx = ctx;
    this.width = width;
    this.type = type;
  }

  draw(e) {
    this.ctx.strokeStyle = this.stroke;
    this.ctx.lineWidth = this.width; 
    this.ctx.beginPath();
    ctx.moveTo(this.posX, this.posY);
    ctx.lineTo(e.layerX, e.layerY);
    ctx.stroke();
    this.ctx.closePath();
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

  setFill(stroke) {
    this.stroke = stroke;
  }

  setLenght(width) {
    this.width = width;
  }

  typeOf(t) {
    return t === this.type;
  }

  // onCanvas(){}
}

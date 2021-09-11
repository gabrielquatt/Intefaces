class Borrador extends Figure {
  constructor(x, y, fill, ctx, width, height) {
    super(x, y, fill, ctx);
    this.width = width;
    this.height = height;
  }

  draw() {
    super.draw();
    this.context.fillRect(this.posX, this.posY, this.width, this.height);
  }

  onCanvas(x, y) {
    return !(
      x < this.posX ||
      x > this.posX + this.width ||
      y < this.posY ||
      y > this.posY + this.height
    );
  }
}

class Pencil extends Brush {
  constructor(x, y, stroke, ctx, width) {
    super(x, y, stroke, ctx, width);
    document.body.style.cursor = `url('img/pencil-cursor.cur'), auto`;
  }

  setStroke(stroke) {
    this.ctx.strokeStyle = stroke;
  }
}

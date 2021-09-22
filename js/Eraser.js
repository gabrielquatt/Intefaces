class Eraser extends Brush {
  constructor(x, y, ctx, width) {
    super(x, y, "white", ctx, width);
    document.body.style.cursor = `url('img/goma.cur'), auto`;
  }

  setStroke() {}
}

class Img {
  constructor(width, height, ctx, canvas) {
    this.img = new Image();
    this.canvas = canvas;
    this.ctx = ctx;

    /** Tamaño maximo de canvas */
    this.WIDTH = width;
    this.HEIGHT = height;

    /** Proporcion de la imagen */
    this.prop = 1;

    /** Tamaño temporal del canvas ajustado a la imagen */
    this.tmp_width = width;
    this.tmp_height = height;
  }

  /**
   * Usuario selecciona una imagen de su disco
   * @param { Event } e
   */
  loadImage(e) {
    if (e.target.files) {
      // Archivo seleccionado
      let file = e.target.files[0];

      let fileReader = new FileReader();

      // Define 'src' de imagen con la ruta del archivo seleccionado
      fileReader.onload = (e) => (this.img.src = e.target.result);
      fileReader.readAsDataURL(file);

      // Dibujar imagen
      this.img.onload = () => this.drawImage();
    }
  }

  /**
   * Muestra la imagen en el canvas
   */
  drawImage() {
    this.resetCanvas();
    if (this.img.src) {
      this.setSize();
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(this.img, 0, 0, this.tmp_width, this.tmp_height);
    }
  }

  /**
   * Definicion de proporciones de la imagen
   */
  setSize() {
    // evaluar proporcion
    this.prop =
      this.img.width > this.WIDTH || this.img.height > this.HEIGHT
        ? this.aspectRatio()
        : 1;

    // si la proporcion es 1, la imagen conserva su tamaño
    // si la porporcion es menor, (Ej: 0.75) el tamaño de la imagen
    // sera solo el 75% de la original
    this.tmp_width = this.img.width * this.prop;
    this.tmp_height = this.img.height * this.prop;

    // Nuevas dimensiones del canvas (para mejor descarga de imagen)
    this.canvas.width = this.tmp_width;
    this.canvas.height = this.tmp_height;
  }

  /**
   * Fuente: https://es.plusmaths.com/calculadora/porcentajes/diferencia
   *
   * Si la imagen es mayor al tamaño maximo del canvas
   * Esta funcion determina que porcentaje de la imagen entra en el canvas
   *
   * Ej: si retorna 0.75, solo el 75% de la imagen entra en el canvas
   *
   * @param { Image } img
   * @returns { Number } entre 0 y 1
   */
  aspectRatio() {
    let w = (this.WIDTH - this.img.width) / this.img.width;
    let h = (this.HEIGHT - this.img.height) / this.img.height;
    return 1 - (w < h ? w : h) * -1;
  }

  /**
   * Borra el contenido y restaura dimensiones originales del canvas
   */
  resetCanvas() {
    this.canvas.width = this.WIDTH;
    this.canvas.height = this.HEIGHT;
    this.ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT);
  }

  /**
   * Borra la imagen cargada
   */
  deleteImage() {
    this.resetCanvas();
    this.img = new Image();
  }

  /**
   * Descargar imagen
   */
  saveImage() {
    let link = document.createElement("a");
    link.download = "canvas.png";
    link.href = this.canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    link.click();
  }

  /**
   * @returns objeto que contiene los datos de la imagen o dibujo en canvas
   */
  getCopy() {
    this.ctx.drawImage(this.img, 0, 0, this.tmp_width, this.tmp_height);
    return this.ctx.getImageData(0, 0, this.tmp_width, this.tmp_height);
  }

  /**
   *  Imagen en blanco y negro con un matiz marrón.
   */
  sepia() {
    let c = this.getCopy();
    for (let x = 0; x < this.tmp_height; x++) {
      for (let y = 0; y < this.tmp_width; y++) {
        let arr = this.getPixel(c, x, y);
        let promPxR = 0.393 * arr[0] + 0.769 * arr[1] + 0.189 * arr[2];
        let promPxG = 0.349 * arr[0] + 0.686 * arr[1] + 0.168 * arr[2];
        let promPxB = 0.272 * arr[0] + 0.534 * arr[1] + 0.131 * arr[2];
        let promPxA = 255;
        this.setPixel(c, x, y, promPxR, promPxG, promPxB, promPxA);
      }
    }
    this.ctx.putImageData(c, 0, 0);
  }

  /**
   * Imagen representada por dos colores (blanco y negro)
   */
  binarization() {
    let c = this.getCopy();
    for (let x = 0; x < this.tmp_height; x++) {
      for (let y = 0; y < this.tmp_width; y++) {
        let arrRGBA = this.getPixel(c, x, y);
        let result = this.prom(arrRGBA) > 127 ? 255 : 0;
        let pixelR = result;
        let pixelG = result;
        let pixelB = result;
        let pixelA = 255;
        this.setPixel(c, x, y, pixelR, pixelG, pixelB, pixelA);
      }
    }
    this.ctx.putImageData(c, 0, 0);
  }

  /**
   * @returns promedio de colores de un pixel (dado en un arreglo)
   * @param { Array } arr pixel
   */
  prom(arr) {
    return Math.floor((arr[0] + arr[1] + arr[2]) / 3);
  }

  /**
   * Imagen donde las luces tienen tonos oscuros y las sombras tonos claros
   */
  negative() {
    let c = this.getCopy();
    for (let x = 0; x < this.tmp_height; x++) {
      for (let y = 0; y < this.tmp_width; y++) {
        let arrRGBA = this.getPixel(c, x, y);
        let promPixelR = 255 - arrRGBA[0];
        let promPixelG = 255 - arrRGBA[1];
        let promPixelB = 255 - arrRGBA[2];
        let promPixelA = 255;
        this.setPixel(c, x, y, promPixelR, promPixelG, promPixelB, promPixelA);
      }
    }
    this.ctx.putImageData(c, 0, 0);
  }

  /**
   * Devuelve arreglo de pixel con los colores Red, Grenn, Blue y Alpha
   */
  getPixel(imageData, x, y) {
    let index = this.getIndex(imageData, x, y);
    let r = imageData.data[index];
    let g = imageData.data[index + 1];
    let b = imageData.data[index + 2];
    let a = imageData.data[index + 3];
    return [r, g, b, a];
  }

  /**
   *
   * @param { Image } imageData
   * @param { x ,y } coordenadas
   * @returns posicion del primer index del pixel
   */
  getIndex(imageData, x, y) {
    return (x + y * imageData.width) * 4;
  }

  /**
   * Setea alores de un Pixel con los valores enviados a la funcion
   */
  setPixel(imageData, x, y, r, g, b, a) {
    let index = this.getIndex(imageData, x, y);
    imageData.data[index] = r;
    imageData.data[index + 1] = g;
    imageData.data[index + 2] = b;
    imageData.data[index + 3] = a;
  }

  /**
   * Añadir brillo a la imagen
   * @param { Number } b fuerza del brillo
   */
  brightness(b) {
    let c = this.getCopy();
    for (let x = 0; x < c.height; x++) {
      for (let y = 0; y < c.width; y++) {
        let arrRGBA = this.getPixel(c, x, y);
        let promPixelR = this.moreBrightness(arrRGBA[0], b);
        let promPixelG = this.moreBrightness(arrRGBA[1], b);
        let promPixelB = this.moreBrightness(arrRGBA[2], b);
        let promPixelA = 255;
        this.setPixel(c, x, y, promPixelR, promPixelG, promPixelB, promPixelA);
      }
    }
    this.ctx.putImageData(c, 0, 0);
  }

  /**
   * Funcion auxiliar que retornara el color de pixel editado aclarandolo mas de lo actual
   */
  moreBrightness(entrada, b) {
    let porc = 0;
    for (let i = 0; i <= b; i++) {
      porc = porc + 20;
    }
    let salida = entrada + porc;
    return salida > 255 ? 255 : salida;
  }

  /**
   * Fuentes:
   * https://www.codingame.com/playgrounds/2524/basic-image-manipulation/kerneling
   * https://idmnyu.github.io/p5.js-image/Blur/index.html
   *
   */
  blur() {
    let original = this.getCopy();
    let c = this.getCopy();
    for (let x = 2; x < c.width - 2; x++) {
      for (let y = 2; y < c.height - 2; y++) {
        let acc = this.boxBlur(original, x, y);
        this.setPixel(c, x, y, acc[0], acc[1], acc[2], acc[3]);
      }
    }
    this.ctx.putImageData(c, 0, 0);
  }

  /**
   * @param { Image } imagen
   * @param { x, y } coordenadas de un pixel
   * @returns { Array(4) } promedio de valores r,g,b,a de los pixels adyacentes al pixel dado.
   */
  boxBlur(image, x, y) {
    // se pueden aplicar otros filtros cambiando el kernel
    let kernel = [
      [1 / 9, 1 / 9, 1 / 9],
      [1 / 9, 1 / 9, 1 / 9],
      [1 / 9, 1 / 9, 1 / 9],
    ];
    let acc = [0, 0, 0, 0];
    let offset = 2;
    for (let i = 0; i <= offset; i++) {
      for (let j = 0; j <= offset; j++) {
        let xn = x + i - offset;
        let yn = y + j - offset;
        let pixel = this.getPixel(image, xn, yn);
        acc[0] += pixel[0] * kernel[i][j];
        acc[1] += pixel[1] * kernel[i][j];
        acc[2] += pixel[2] * kernel[i][j];
        acc[3] += pixel[3] * kernel[i][j];
      }
    }
    return acc;
  }
}

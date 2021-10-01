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

    /** Tamaño temporal de la imagen ajustado al canvas */
    this.tmp_width = width;
    this.tmp_height = height;

    /** posicion de la imagen para que se ubique en el centro */
    this.posx = 0;
    this.posy = 0;
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
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.drawImage(
        this.img,
        this.posx,
        this.posy,
        this.tmp_width,
        this.tmp_height
      );
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
    this.tmp_width = Math.ceil(this.img.width * this.prop);
    this.tmp_height = Math.ceil(this.img.height * this.prop);

    this.canvas.width = this.tmp_width;
    this.canvas.height = this.tmp_height;

    // this.posx = Math.ceil((this.WIDTH - this.tmp_width) / 2);
    // this.posy = Math.ceil((this.HEIGHT - this.tmp_height) / 2);
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
    if (!this.img.src) return;

    // canvas auxiliar (invisible para el usuario, no se añade al html)
    let c = document.createElement("canvas");

    // este canvas tiene el tamaño de la imagen
    c.width = this.img.width;
    c.height = this.img.height;

    c.getContext("2d").drawImage( 
      // dibuja el contenido actual del canvas en el canvas auxiliar
      this.canvas, 
      0,
      0,
      this.tmp_width,
      this.tmp_height,

      // redimension para adaptar a la imagen
      0,
      0,
      this.img.width,
      this.img.height
    );

    let link = document.createElement("a");
    link.download = "canvas.png";
    link.href = c
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    link.click();
  }

  /**
   * @param { * } param  se retorna el canvas sin antes restaurar la imagen original
   * @returns objeto que contiene los datos del contexto del canvas
   */
  getCopy(param) {
    if (!param) {
      this.ctx.drawImage(
        this.img,
        this.posx,
        this.posy,
        this.tmp_width,
        this.tmp_height
      );
    }
    return this.ctx.getImageData(
      this.posx,
      this.posy,
      this.tmp_width,
      this.tmp_height
    );
  }

  /**
   *  Imagen en blanco y negro con un matiz marrón.
   */
  sepia() {
    if (!this.img.src) return;
    let c = this.getCopy();
    for (let x = 0; x < c.width; x++) {
      for (let y = 0; y < c.height; y++) {
        let arr = this.getPixel(c, x, y);
        let promPxR = 0.393 * arr[0] + 0.769 * arr[1] + 0.189 * arr[2];
        let promPxG = 0.349 * arr[0] + 0.686 * arr[1] + 0.168 * arr[2];
        let promPxB = 0.272 * arr[0] + 0.534 * arr[1] + 0.131 * arr[2];
        let promPxA = 255;
        this.setPixel(c, x, y, promPxR, promPxG, promPxB, promPxA);
      }
    }
    this.ctx.putImageData(c, this.posx, this.posy);
  }

  /**
   * Imagen representada por dos colores (blanco y negro)
   */
  binarization() {
    if (!this.img.src) return;
    let c = this.getCopy();
    for (let x = 0; x < c.width; x++) {
      for (let y = 0; y < c.height; y++) {
        let arrRGBA = this.getPixel(c, x, y);
        let result = this.prom(arrRGBA) > 127 ? 255 : 0;
        let pixelR = result;
        let pixelG = result;
        let pixelB = result;
        let pixelA = 255;
        this.setPixel(c, x, y, pixelR, pixelG, pixelB, pixelA);
      }
    }
    this.ctx.putImageData(c, this.posx, this.posy);
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
    if (!this.img.src) return;
    let c = this.getCopy();
    for (let x = 0; x < c.width; x++) {
      for (let y = 0; y < c.height; y++) {
        let arrRGBA = this.getPixel(c, x, y);
        let promPixelR = 255 - arrRGBA[0];
        let promPixelG = 255 - arrRGBA[1];
        let promPixelB = 255 - arrRGBA[2];
        let promPixelA = 255;
        this.setPixel(c, x, y, promPixelR, promPixelG, promPixelB, promPixelA);
      }
    }
    this.ctx.putImageData(c, this.posx, this.posy);
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
    if (!this.img.src) return;
    let c = this.getCopy();
    for (let x = 0; x < c.width; x++) {
      for (let y = 0; y < c.height; y++) {
        let arrRGBA = this.getPixel(c, x, y);
        let promPixelR = this.moreBrightness(arrRGBA[0], b);
        let promPixelG = this.moreBrightness(arrRGBA[1], b);
        let promPixelB = this.moreBrightness(arrRGBA[2], b);
        let promPixelA = 255;
        this.setPixel(c, x, y, promPixelR, promPixelG, promPixelB, promPixelA);
      }
    }
    this.ctx.putImageData(c, this.posx, this.posy);
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
   *
   */
  saturacion() {
    if (!this.img.src) return;
    let c = this.getCopy();
    for (let x = 0; x < c.width; x++) {
      for (let y = 0; y < c.height; y++) {
        let pixelRGBA = this.getPixel(c, x, y);
        let hsv = this.rgbToHsv(pixelRGBA[0], pixelRGBA[1], pixelRGBA[2]);
        let rgb = this.HSVtoRGB(hsv[0], hsv[1] + 0.5, hsv[2]);
        let a = 255;
        this.setPixel(c, x, y, rgb[0], rgb[1], rgb[2], a);
      }
    }
    this.ctx.putImageData(c, this.posx, this.posy);
  }

  /**
   *
   * @param {*} h
   * @param {*} s
   * @param {*} v
   * @returns
   */
  HSVtoRGB(h, s, v) {
    let r, g, b, i, f, p, q, t;
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0:
        r = v;
        g = t;
        b = p;
        break;
      case 1:
        r = q;
        g = v;
        b = p;
        break;
      case 2:
        r = p;
        g = v;
        b = t;
        break;
      case 3:
        r = p;
        g = q;
        b = v;
        break;
      case 4:
        r = t;
        g = p;
        b = v;
        break;
      case 5:
        r = v;
        g = p;
        b = q;
        break;
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  /**
   *
   * @param {*} r
   * @param {*} g
   * @param {*} b
   * @returns
   */
  rgbToHsv(r, g, b) {
    let h;
    let s;
    let v;

    let maxColor = Math.max(r, g, b);
    let minColor = Math.min(r, g, b);
    let delta = maxColor - minColor;

    if (delta == 0) {
      h = 0;
    } else if (r == maxColor) {
      h = (6 + (g - b) / delta) % 6;
    } else if (g == maxColor) {
      h = 2 + (b - r) / delta;
    } else if (b == maxColor) {
      h = 4 + (r - g) / delta;
    } else {
      h = 0;
    }

    h = h / 6;

    if (maxColor != 0) {
      s = delta / maxColor;
    } else {
      s = 0;
    }

    v = maxColor / 255;

    return [h, s, v];
  }

  /**
   * Filtro desenfoque
   */
  blur() {
    if (!this.img.src) return;
    this.applySimpleFilter(this.getBoxBlurKernel(), 1);
  }

  /**
   * box blur kernel
   * @returns matriz para aplicar filtro
   */
  getBoxBlurKernel() {
    return [
      [1 / 9, 1 / 9, 1 / 9],
      [1 / 9, 1 / 9, 1 / 9],
      [1 / 9, 1 / 9, 1 / 9],
    ];
    // (con esta matriz se obtiene el mismo efecto)
    // return [[1 / 256, 4  / 256,  6 / 256,  4 / 256, 1 / 256],
    //         [4 / 256, 16 / 256, 24 / 256, 16 / 256, 4 / 256],
    //         [6 / 256, 24 / 256, 36 / 256, 24 / 256, 6 / 256],
    //         [4 / 256, 16 / 256, 24 / 256, 16 / 256, 4 / 256],
    //         [1 / 256, 4  / 256,  6 / 256,  4 / 256, 1 / 256]
    // ];
  }

  /**
   * Filtro de agudizamiento (traduccion de google)
   */
  sharpening() {
    if (!this.img.src) return;
    this.applySimpleFilter(this.getHighPassKernel());

    // se aplica dos veces el filtro para un efecto mas notorio
    // el segundo parametro determina que el filtro se aplicara sobre la imagen ya modificada anteriormente
    this.applySimpleFilter(this.getHighPassKernel(), 1);
  }

  /**
   * High-pass kernel
   *  @returns matriz para aplicar filtro
   */
  getHighPassKernel() {
    return [
      [0, -0.5, 0],
      [-0.5, 3, -0.5],
      [0, -0.5, 0],
    ];
  }

  /**
   * Filtro dibujo en tiza
   */
  whiteboard() {
    if (!this.img.src) return;
    this.applySimpleFilter(this.getWhiteboardKernel());
  }

  /**
   * Fuente: https://arxiv.org/pdf/1910.14067.pdf (pagina 11)
   *
   * @returns matriz para aplicar filtro
   */
  getWhiteboardKernel() {
    return [
      [0, 0, 1],
      [0, -2, 0],
      [1, 0, 0],
    ];
  }

  /**
   *  @param { Matriz[][] } kernel : matriz para aplicar filtros
   *  @param { param } : determina que no se restaura la imagen original antes de aplicar el filtro
   *                      de esta forma se acumulan modificaciones en la imagen
   */
  applySimpleFilter(kernel, param) {
    let original = this.getCopy(param);
    let c = this.getCopy();
    for (let x = 0; x < c.width; x++) {
      for (let y = 0; y < c.height; y++) {
        let acc = this.boxBlur(original, x, y, kernel);
        this.setPixel(c, x, y, acc[0], acc[1], acc[2], acc[3]);
      }
    }
    this.ctx.putImageData(c, this.posx, this.posy);
  }

  /**
   * Fuentes:
   * https://www.codingame.com/playgrounds/2524/basic-image-manipulation/kerneling
   *
   * @param { Image } imagen
   * @param { x, y } coordenadas de un pixel.
   * @returns { Array(4) } promedio r,g,b,a de pixels adyacentes al aplicar formula del kernel.
   */
  boxBlur(image, x, y, kernel) {
    let acc = [0, 0, 0, 255];
    // posicion mitad del kernel
    let offset = Math.floor(kernel.length / 2);
    for (let i = 0; i < kernel.length; i++) {
      for (let j = 0; j < kernel.length; j++) {
        let xn = x + i - offset;
        let yn = y + j - offset;
        // correción de bordes negros
        if (xn <= offset) xn = offset + 1;
        if (xn >= image.width - offset) xn = image.width - offset;
        if (yn <= offset) yn = offset + 1;
        if (yn >= image.height - offset) yn = image.height - offset;

        let pixel = this.getPixel(image, xn, yn);
        acc[0] += pixel[0] * kernel[i][j];
        acc[1] += pixel[1] * kernel[i][j];
        acc[2] += pixel[2] * kernel[i][j];
      }
    }
    return acc;
  }

  /**
   * Deteccion de bordes
   */
  edgeDetection() {
    if (!this.img.src) return;
    let obj = this.getSobelKernels();
    let kernelX = obj.kernelX;
    let kernelY = obj.kernelY;

    let original = this.getCopy();
    let c = this.getCopy();
    for (let x = 0; x < c.width; x++) {
      for (let y = 0; y < c.height; y++) {
        let color = 0;
        let cx = 0;
        let cy = 0;
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            let xn = x + i - 1;
            let yn = y + j - 1;
            let pixel = this.getPixel(original, xn, yn);
            for (let p = 0; p < 3; p++) {
              cx += (pixel[p] / 3) * kernelX[i][j];
              cy += (pixel[p] / 3) * kernelY[i][j];
            }
            color = parseInt(Math.sqrt(cx ** 2 + cx ** 2));
          }
        }
        this.setPixel(c, x, y, color, color, color, 255);
      }
    }
    this.ctx.putImageData(c, this.posx, this.posy);
  }

  /**
   *  Fuentes:
   *   https://observablehq.com/@mbostock/sobel-operator
   *   https://d3js.org/
   *   https://observablehq.com/@mbostock/sinebow
   *   https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Math/hypot
   *   https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Math/atan2
   *   https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Math/max
   *
   * Filtro arcoiris
   * @param { number } n muestra el arcoiris 1 o 2
   */
  rainbow(n) {
    if (!this.img.src) return;
    let obj = this.getSobelKernels();
    let kernelX = obj.kernelX;
    let kernelY = obj.kernelY;
    let original = this.getCopy();
    let c = this.getCopy();

    for (let x = 0; x < c.width; x++) {
      for (let y = 1; y < c.height - 1; y++) {
        let cx = 0,
          cy = 0;
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            let xn = x + i - 1;
            let yn = y + j - 1;
            let pixel = this.getPixel(original, xn, yn);
            for (let p = 0; p < 4; p++) {
              cx += pixel[p] * kernelX[i][j];
              cy += pixel[p] * kernelY[i][j];
            }
          }
        }
        let t = Math.atan2(cy, cx) / (2 * Math.PI);
        let { r, g, b } = d3.rgb(d3.interpolateSinebow(t));
        let alpha = 255;

        // solo varia el alpha entre los filtros arcoiris
        if (n == 1) {
          let color = Math.hypot(cx, cy);
          if (!isNaN(color)) {
            alpha = color;
          }
        }
        this.setPixel(c, x, y, r, g, b, alpha);
      }
    }
    this.ctx.putImageData(c, this.posx, this.posy);
  }

  /**
   * Realza los colores rojos y azules
   * bloquea los colores verdes
   */
  anaglyph() {
    if (!this.img.src) return;
    let obj = this.getSobelKernels();
    let kernelX = obj.kernelX;
    let kernelY = obj.kernelY;
    let original = this.getCopy();
    let c = this.getCopy();

    for (let x = 0; x < c.width; x++) {
      for (let y = 1; y < c.height - 1; y++) {
        let color = 0;
        let g = 0;
        let alpha = 255;
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            let xn = x + i - 1;
            let yn = y + j - 1;
            let pixel = this.getPixel(original, xn, yn);
            for (let p = 0; p < 3; p++) {
              color += pixel[p] * kernelX[i][j];
              color += pixel[p] * kernelY[i][j];
            }
          }
        }
        let r = Math.max(color, 0);
        let b = Math.max(-color, 0);
        this.setPixel(c, x, y, r, g, b, alpha);
      }
    }
    this.ctx.putImageData(c, this.posx, this.posy);
  }

  /**
   * @returns
   */
  getSobelKernels() {
    return {
      kernelX: [
        [-1, 0, 1],
        [-2, 0, 2],
        [-1, 0, 1],
      ],
      kernelY: [
        [-1, -2, -1],
        [0, 0, 0],
        [1, 2, 1],
      ],
    };
  }
}

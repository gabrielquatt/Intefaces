/** @type { HTMLcanvasElement} */
let canvas = document.getElementById("canvas");

let ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;

let inputFile = document.getElementById("file");

document.getElementById("btn").addEventListener("click", () => {
  inputFile.click();
});

inputFile.addEventListener("change", (e) => loadImage(e));

function loadImage(e) {
  if (e.target.files) {
    let file = e.target.files[0];

    // puede ser global
    let img = new Image();

    let fileReader = new FileReader();
    fileReader.onload = (e) => (img.src = e.target.result);
    fileReader.readAsDataURL(file);
    img.onload = () => drawImage(img);
  }
}

function drawImage(img) {
  clearCanvas();
  let prop = 1;
  if (img.width > width || img.height > height) {
    prop = resizeImage(img);
  }
  let newWidth = img.width * prop;
  let newHeight = img.height * prop;
  let posX = (width - newWidth) / 2;
  let posY = (height - newHeight) / 2;
  console.log(newHeight);
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(img, posX, posY, newWidth, newHeight);
}

function resizeImage(img) {
  let percentW = 1;
  let percentH = 1;
  if (img.width > width) {
    percentW = (width - img.width) / img.width;
  }
  if (img.height > height) {
    percentH = (height - img.height) / img.height;
  }
  let r = percentW < percentH ? percentW : percentH;
  return 1 - r * -1;
}

function clearCanvas() {
  ctx.clearRect(0, 0, width, height);
}

//----------------------------------------------------------------------------------------------//
// imageData(): se usa para crear el objeto.
// getImageData(): método de imageData para copiar los pixels de una región del canvas
// putImageData(): méodo de imageData para dibujar en el canvas una imagen a partir de sus pixels
//----------------------------------------------------------------------------------------------//

/**
 * Sepia:
 * La fotografía en sepia no es más que una imagen en blanco y negro con un matiz marrón que
 * crea una sensación de calidez.
 */
document.getElementById('btn_sepia').addEventListener("click", () => {
  let imageEditada = sepia();
  ctx.putImageData(imageEditada, 0, 0);
});

//----------------------------------------------------------------------------------------------//
/**
 * Binarizacion:
 * Una imágen que solo sea representada por dos tonos de color, por general: blanco y negro.
 */
 document.getElementById('btn_binarizacion').addEventListener("click", () => {
  let imageEditada = binarizacion();
  ctx.putImageData(imageEditada, 0, 0);
});

//----------------------------------------------------------------------------------------------//
/**
 * Negativo
 * Un negativo es una imagen fotográfica en la que las luces aparecen en tonos oscuros y 
 * las sombras en tonos claros
 */
 document.getElementById('btn_negativo').addEventListener("click", () => {
  let imageEditada = negativo();
  ctx.putImageData(imageEditada, 0, 0);
});
//----------------------------------------------------------------------------------------------//
/**
 * Setea copia de Canvas con colores Blanco o Negro segun el promedio de cada pixel
 * @returns 
 */
 function binarizacion() {
  // usamos getImageData para copiar el canvas
  let copiaCanvas = ctx.getImageData(0, 0, width, height);
  for (let x = 0; x < height; x++) {
      for (let y = 0; y < width; y++) {
          let arrRGBA = getPixel(copiaCanvas, x, y);
          let result = white_or_dark(Math.floor((arrRGBA[0] + arrRGBA[1] + arrRGBA[2]) / 3));
          let pixelR = result;
          let pixelG = result;
          let pixelB = result;
          let pixelA = 255;
          setPixel(copiaCanvas, x, y, pixelR, pixelG, pixelB, pixelA);
      }
  }
  return copiaCanvas;
}

//----------------------------------------------------------------------------------------------//
/**
 * Setea copia de Canvas con tonalidades Sepias
 * @returns 
 */
function sepia() {
  // usamos getImageData para copiar el canvas
  let copiaCanvas = ctx.getImageData(0, 0, width, height);
  for (let x = 0; x < height; x++) {
    for (let y = 0; y < width; y++) {
      let arrRGBA = getPixel(copiaCanvas, x, y);
      //formula para comvertir pixeles a "Sepia"
      //(0.393 * R )+( 0.769 * G) + (0.189 * B)
      //(0.349 * R) + (0.686 * G) + (0.168 * B)
      //(0.272 * R) + (0.534 * G) + (0.131 * B)
      let promPixelR = (0.393 * arrRGBA[0]) + (0.769 * arrRGBA[1]) + (0.189 * arrRGBA[2]);
      let promPixelG = (0.349 * arrRGBA[0]) + (0.686 * arrRGBA[1]) + (0.168 * arrRGBA[2]);
      let promPixelB = (0.272 * arrRGBA[0]) + (0.534 * arrRGBA[1]) + (0.131 * arrRGBA[2]);
      let promPixelA = 255;
      setPixel(copiaCanvas, x, y, promPixelR, promPixelG, promPixelB, promPixelA);
    }
  }
  return copiaCanvas;
}

//----------------------------------------------------------------------------------------------//
/**
 * Setea copia de Canvas a modo negativo
 * @returns 
 */
function negativo() {
   // usamos getImageData para copiar el canvas
  let copiaCanvas = ctx.getImageData(0, 0, width, height); 
  for (let x = 0; x < height; x++) {
      for (let y = 0; y < width; y++) {
          let arrRGBA = getPixel(copiaCanvas, x, y);
          let promPixelR = 255 - arrRGBA[0];
          let promPixelG = 255 - arrRGBA[1];
          let promPixelB = 255 - arrRGBA[2];
          let promPixelA = 255;
          setPixel(copiaCanvas, x, y, promPixelR, promPixelG, promPixelB, promPixelA);
      }
  }
  return copiaCanvas;
}
//----------------------------------------------------------------------------------------------//
/**
 * Devuelve arreglo de pixel con los colores Red, Grenn, Blue y Alpha
 */
function getPixel(imageData, x, y) {
  let index = (x + y * imageData.height) * 4;
  let r = imageData.data[index + 0];
  let g = imageData.data[index + 1];
  let b = imageData.data[index + 2];
  let a = imageData.data[index + 3];
  return [r, g, b, a];
}

/**
 * Setea alores de un Pixel con los valores enviados a la funcion
 */
function setPixel(imageData, x, y, r, g, b, a) {
  let index = (x + y * imageData.height) * 4;
  imageData.data[index + 0] = r;
  imageData.data[index + 1] = g;
  imageData.data[index + 2] = b;
  imageData.data[index + 3] = a;
}

/**
 * Devuelve el valor 0 o 255 segun cuan serca este el promedio del pixel de ese valor
 * @param {*} pixel //promedio del pixel
 * @returns 
 */
function white_or_dark(pixel) {
  if ((pixel > 127) && (pixel <= 255)) {
      return 255;
  } else if ((pixel >= 0) && (pixel <= 127)) {
      return 0;
  }
}


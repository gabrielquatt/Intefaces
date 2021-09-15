"use strict";
/** @type { HTMLcanvasElement} */
const canvas = document.getElementById("canvas");

/** Contexto */
const ctx = canvas.getContext("2d");

/** Instancia de Img (carga y descarga de imagenes, filtros) */
let image = new Img(canvas.width, canvas.height, ctx, canvas);

/** El pincel puede ser lapiz o borrador */
let brush = null;

/** Estado del mouse */
let mouseDown = false;

/**
 ****************************************************************************
 *                 Acciones al seleccionar lapiz o borrador
 *****************************************************************************
 */
/** Seleccion del lapiz */
document.getElementById("brush").addEventListener("click", (e) => {
  setBrush("brush");
});

/** Seleccion del borrador */
document.getElementById("draft").addEventListener("click", () => {
  setBrush("draft");
});

/**
 * Crea nueva instancia del pincel
 */
function setBrush(type) {
  if (type == "draft") {
    if (brush && brush instanceof Eraser) {
      brush = null;
    } else {
      brush = new Eraser(0, 0, ctx, input_stroke.value);
    }
  }
  if (type == "brush") {
    if (brush && brush instanceof Pencil) {
      brush = null;
    } else {
      brush = new Pencil(0, 0, color.value, ctx, input_stroke.value);
    }
  }
  if (!brush) document.body.style.cursor = `auto`;
}

/**
 **********************************************************************
 *                    Acciones al cambiar color y grosor
 **********************************************************************
 */

/**
 * Cambiar color
 */
let color = document.getElementById("color");
color.addEventListener("change", () => {
  if (brush) brush.setStroke(color.value);
});

/**
 * Cambiar tamaño del trazo
 */
let input_stroke = document.getElementById("stroke");
input_stroke.addEventListener("change", () => {
  if (brush) brush.setLineWidth(input_stroke.value);
});

/**
 * Desplegar/ocultar input para seleccionar tamaño del trazo
 */
document.getElementById("btn_stroke").addEventListener("click", () => {
  document.getElementById("dropDown").classList.toggle("hide");
});

/**
 * ***********************************************************************
 *                          Eventos del canvas
 * ***********************************************************************
 */
canvas.addEventListener("mousedown", (e) => {
  mouseDown = true;
  if (brush) brush.setPosition(e.layerX, e.layerY);
});

canvas.addEventListener("mouseup", () => {
  mouseDown = false;
});

canvas.addEventListener("mousemove", (e) => {
  if (brush) {
    if (mouseDown) {
      brush.draw(e.layerX, e.layerY);
    }
  }
});

/**
 * **************************************************************************
 *                    Seleccionar/guardar imagen y aplicar filtros
 * **************************************************************************
 */

/**
 * Input (oculto) para seleccionar imagen del disco
 */
let input_file = document.getElementById("file");

/**
 * Boton visible que acciona el input oculto
 */
document
  .getElementById("btn_file")
  .addEventListener("click", () => input_file.click());

/**
 * Evento que dispara la carga de la imagen del disco
 */
input_file.addEventListener("change", (e) => image.loadImage(e));

/**
 * Evento que dispara la descarga de la imagen
 */
document
  .getElementById("btn_save")
  .addEventListener("click", () => image.saveImage());

/**
 * Restaurar imagen original
 */
document
  .getElementById("btn_reset")
  .addEventListener("click", () => image.drawImage());

/**
 * Borrar imagen
 */
document
  .getElementById("delete")
  .addEventListener("click", () => image.deleteImage());

/**
 * Filtro negativo
 */
document
  .getElementById("btn_negative")
  .addEventListener("click", () => image.negative());

/**
 * Filtro binarizacion
 */
document
  .getElementById("btn_binary")
  .addEventListener("click", () => image.binarization());

/**
 * Filtro sepia
 */
document
  .getElementById("btn_sepia")
  .addEventListener("click", () => image.sepia());

/**
 * Filtro brillo
 */
let input_brightness = document.getElementById("brightness");
document
  .getElementById("btn_brightness")
  .addEventListener("click", () => image.brightness(input_brightness.value));

"use strict";

/** @type { HTMLcanvasElement} */
let canvas = document.getElementById("canvas");

/** Contexto */
let ctx = canvas.getContext("2d");

/** Instancia de Img (carga y descarga de imagenes, filtros) */
let image = new Img(canvas.width, canvas.height, ctx, canvas);

/** El pincel puede ser lapiz o borrador */
let brush = null;

/** Estado del mouse */
let mouseDown = false;

/** Color del lapiz por defecto en negro*/
let color = `rgba(${0},${0},${0},${255})`;

/** Input para cambiar tamaño del trazo */
let input_stroke = document.getElementById("stroke");

/** Cambiar tamaño del pincel */
input_stroke.addEventListener("change", () => {
  if (brush) brush.setLineWidth(input_stroke.value);
});

/** Seleccion del lapiz */
document.getElementById("brush").addEventListener("click", () => {
  setBrush("brush");
});

/** Seleccion del borrador */
document.getElementById("draft").addEventListener("click", () => {
  setBrush("draft");
});

/** Acciones al seleccionar lapiz o borrador */
function setBrush(type) {
  if (brush == null) {
    newBrush(type);
  } else {
    if (brush.typeOf(type)) {
      brush = null;
    } else {
      newBrush(type);
    }
  }
}

/** Crea nueva instancia del pincel */
function newBrush(type) {
  brush = new Brush(0, 0, color, ctx, input_stroke.value, type);
  if (type == "draft") {
    brush.setStroke("white");
  }
}

/**
 * ***********************************
 * Eventos del canvas
 * ***********************************
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
 * ***********************************
 * Eventos de los botones
 * ***********************************
 */

/**
 * Div donde se encuentra el input type range
 */
let drop_down = document.getElementById("dropDown");

/**
 * Desplegar/ocultar input para seleccionar tamaño del trazo
 */
document.getElementById("btn_stroke").addEventListener("click", () => {
  drop_down.classList.toggle("hide");
});

/**
 * Input (oculto) para seleccionar imagen del disco
 */
let input_file = document.getElementById("file");

/**
 * Boton visible que acciona el input oculto
 */
document
  .getElementById("btn")
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
  .getElementById("reset")
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

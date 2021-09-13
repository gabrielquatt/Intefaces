"use strict";

/** @type { HTMLcanvasElement} */
let canvas = document.getElementById("canvas");

/** Contexto */
let ctx = canvas.getContext("2d");

/** Instancia de Img (carga y descarga de imagenes, filtros) */
let image = new Img(canvas.width, canvas.height, ctx, canvas);

/** El pincel puede ser lapiz o borrador */
let brush = null;

/** Tamaño del pincel medido en pixeles */
let tam = 5;

/** Estado del mouse */
let mouseDown = false;

/** Color del lapiz por defecto en negro*/
let color = `rgba(${0},${0},${0},${255})`;

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
    newPincel(type);
  } else {
    if (brush.typeOf(type)) {
      brush = null;
    } else {
      newPincel(type);
    }
  }
}

/** Crea nueva instancia del pincel */
function newPincel(type) {
  brush = new Brush(0, 0, color, ctx, tam, type);
  if (type == "draft") {
    brush.setFill("white");
  }
}

/**
 * ***********************************
 * Eventos del canvas
 * ***********************************
 */
canvas.addEventListener("mousedown", (e) => {
  mouseDown = true;
  if (brush) {
    brush.setPosition(e.layerX, e.layerY);
  }
});

canvas.addEventListener("mouseup", () => {
  mouseDown = false;
});

canvas.addEventListener("mousemove", (e) => {
  if (brush) {
    if (mouseDown) {
      brush.draw(e);
      brush.setPosition(e.layerX, e.layerY);
    }
  }
});

/**
 * ***********************************
 * Eventos de los botones
 * ***********************************
 */

/**
 * Input (oculto) para seleccionar imagen del disco
 */
let input = document.getElementById("file");

/**
 * Boton visible que acciona el input oculto
 */
document.getElementById("btn").addEventListener("click", () => input.click());

/**
 * Evento que dispara la carga de la imagen del disco
 */
input.addEventListener("change", (e) => image.loadImage(e));

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

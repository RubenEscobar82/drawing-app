export interface DisplayCanvasConfig {
  canvasWidth: number;
  canvasHeight: number;
  scale: number;
  imgWidth: number;
  imgHeight: number;
  offsetX: number;
  offsetY: number;
}

export interface CursorPosition {
  x: number;
  y: number;
}

export enum ZoomDirection {
  IN = "IN",
  OUT = "OUT",
}

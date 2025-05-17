import {
  RefObject,
  MouseEvent,
  WheelEvent,
  TouchEvent,
  TouchList,
} from "react";

type Rendering2DContext<T> = T extends OffscreenCanvas
  ? OffscreenCanvasRenderingContext2D
  : T extends HTMLCanvasElement
  ? CanvasRenderingContext2D
  : never;

const clearCanvas = (
  canvasRef: RefObject<HTMLCanvasElement | OffscreenCanvas | null>
) => {
  getCanvasCtxFromRef({ ref: canvasRef }, (ctx) => {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  });
};

const getCanvasCtxFromRef = <T extends HTMLCanvasElement | OffscreenCanvas>(
  refNSettings: {
    ref: RefObject<T | null>;
    settings?: CanvasRenderingContext2DSettings;
  },
  onSuccess: (ctx: Rendering2DContext<T>) => void
) => {
  const ctx = refNSettings.ref.current?.getContext("2d", {
    willReadFrequently: true,
    ...refNSettings.settings,
  }) as Rendering2DContext<T>;
  if (ctx) {
    onSuccess(ctx);
  }
};

const getCanvasEvtPosition = (
  event:
    | WheelEvent<HTMLCanvasElement>
    | MouseEvent<HTMLElement>
    | TouchEvent<HTMLCanvasElement>
) => {
  const rect = event.currentTarget.getBoundingClientRect();
  const cursorPosition = { x: 0, y: 0 };

  if ("touches" in event) {
    if (event.touches.length === 2) {
      let leftMost = event.touches[0];
      let upMost = event.touches[0];
      let rightMost = event.touches[0];
      let downMost = event.touches[0];
      for (let i = 1; i < event.touches.length; i++) {
        if (event.touches[i].clientX < leftMost.clientX) {
          leftMost = event.touches[i];
        }
        if (event.touches[i].clientX > rightMost.clientX) {
          rightMost = event.touches[i];
        }
        if (event.touches[i].clientY < upMost.clientY) {
          upMost = event.touches[i];
        }
        if (event.touches[i].clientY > downMost.clientY) {
          downMost = event.touches[i];
        }
      }
      cursorPosition.x = Math.floor(
        leftMost.clientX +
          (rightMost.clientX - leftMost.clientX) / 2 -
          rect.left
      );
      cursorPosition.y = Math.floor(
        upMost.clientY + (downMost.clientY - upMost.clientY) / 2 - rect.top
      );
    } else {
      const touch = event.touches[0];
      cursorPosition.x = Math.floor(touch.clientX - rect.left);
      cursorPosition.y = Math.floor(touch.clientY - rect.top);
    }
  } else {
    cursorPosition.x = event.clientX - rect.x;
    cursorPosition.y = event.clientY - rect.y;
  }

  return cursorPosition;
};

const getPinchDistance = (touches: TouchList) => {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
};

export {
  getCanvasCtxFromRef,
  clearCanvas,
  getCanvasEvtPosition,
  getPinchDistance,
};

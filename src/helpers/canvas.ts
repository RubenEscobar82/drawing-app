import { RefObject, MouseEvent, WheelEvent } from "react";

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
  event: WheelEvent<HTMLCanvasElement> | MouseEvent<HTMLElement>
) => {
  const canvasPosition = event.currentTarget.getBoundingClientRect();

  const cursorPosition = {
    x: event.clientX - canvasPosition.x,
    y: event.clientY - canvasPosition.y,
  };

  return cursorPosition;
};

export { getCanvasCtxFromRef, clearCanvas, getCanvasEvtPosition };

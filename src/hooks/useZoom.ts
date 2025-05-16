import { useCanvasContext } from "./";
import { ZoomDirection, CursorPosition } from "@src/types";
import { clampValue } from "@src/helpers";

const useZoom = () => {
  const { setDisplayCanvasConfig } = useCanvasContext();
  const magnifyingFactor = 1.1;
  const reductionFactor = 0.8;

  const handleZoom = (arg: {
    direction: ZoomDirection;
    cursorPosition: CursorPosition;
  }) => {
    setDisplayCanvasConfig((prev) => {
      const scale =
        prev.scale *
        (arg.direction === ZoomDirection.IN
          ? magnifyingFactor
          : reductionFactor);

      const scaledImgWidth = prev.imgWidth * scale;
      const scaledImgHeight = prev.imgHeight * scale;

      let offsetX = 0;
      let offsetY = 0;

      if (scaledImgWidth <= prev.canvasWidth) {
        offsetX = Math.floor((prev.canvasWidth - scaledImgWidth) / 2);
      } else {
        offsetX = Math.floor(
          clampValue({
            min: prev.canvasWidth - scaledImgWidth,
            value:
              prev.canvasWidth / 2 -
              ((arg.cursorPosition.x - prev.offsetX) / prev.scale) * scale,
            max: 0,
          })
        );
      }
      if (scaledImgHeight <= prev.canvasHeight) {
        offsetY = Math.floor((prev.canvasHeight - scaledImgHeight) / 2);
      } else {
        offsetY = Math.floor(
          clampValue({
            min: prev.canvasHeight - scaledImgHeight,
            value:
              prev.canvasHeight / 2 -
              ((arg.cursorPosition.y - prev.offsetY) / prev.scale) * scale,
            max: 0,
          })
        );
      }

      return {
        ...prev,
        scale,
        offsetX,
        offsetY,
      };
    });
  };

  return {
    handleZoom,
  };
};

export default useZoom;

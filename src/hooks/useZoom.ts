import { useCanvasContext } from "./";
import { CursorPosition } from "@src/types";
import { clampValue } from "@src/helpers";

const useZoom = () => {
  const { setDisplayCanvasConfig } = useCanvasContext();

  const handleZoom = (arg: {
    scale: number;
    cursorPosition: CursorPosition;
  }) => {
    if (arg.scale >= 0.1 && arg.scale < 8) {
      setDisplayCanvasConfig((prev) => {
        const scaledImgWidth = prev.imgWidth * arg.scale;
        const scaledImgHeight = prev.imgHeight * arg.scale;

        let offsetX = 0;
        let offsetY = 0;

        if (scaledImgWidth <= prev.canvasWidth) {
          offsetX = Math.floor((prev.canvasWidth - scaledImgWidth) / 2);
        } else {
          offsetX = Math.floor(
            clampValue({
              min: prev.canvasWidth - scaledImgWidth,
              value:
                arg.cursorPosition.x -
                ((arg.cursorPosition.x - prev.offsetX) / prev.scale) *
                  arg.scale,
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
                arg.cursorPosition.y -
                ((arg.cursorPosition.y - prev.offsetY) / prev.scale) *
                  arg.scale,
              max: 0,
            })
          );
        }

        return {
          ...prev,
          offsetX,
          offsetY,
          scale: arg.scale,
        };
      });
    }
  };

  return {
    handleZoom,
  };
};

export default useZoom;

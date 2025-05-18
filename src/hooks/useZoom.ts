import { useEffect, useRef } from "react";
import { useCanvasContext } from "./";
import { CursorPosition } from "@src/types";
import { clampValue } from "@src/helpers";

const useZoom = () => {
  const { displayCanvasConfig, setDisplayCanvasConfig } = useCanvasContext();

  const minScale = useRef(0.3);

  useEffect(() => {
    const imgSize = Math.sqrt(
      Math.pow(displayCanvasConfig.imgWidth, 2) +
        Math.pow(displayCanvasConfig.imgHeight, 2)
    );
    const canvasSize = Math.sqrt(
      Math.pow(displayCanvasConfig.canvasWidth, 2) +
        Math.pow(displayCanvasConfig.canvasHeight, 2)
    );
    minScale.current =
      imgSize > canvasSize * 0.3 ? (canvasSize * 0.3) / imgSize : 1;
  }, [displayCanvasConfig]);

  const handleZoom = (arg: {
    scale: number;
    cursorPosition: CursorPosition;
  }) => {
    const newScale = clampValue({
      min: minScale.current,
      value: arg.scale,
      max: 8,
    });
    setDisplayCanvasConfig((prev) => {
      const scaledImgWidth = prev.imgWidth * newScale;
      const scaledImgHeight = prev.imgHeight * newScale;

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
              ((arg.cursorPosition.x - prev.offsetX) / prev.scale) * newScale,
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
              ((arg.cursorPosition.y - prev.offsetY) / prev.scale) * newScale,
            max: 0,
          })
        );
      }

      return {
        ...prev,
        offsetX,
        offsetY,
        scale: newScale,
      };
    });
  };

  return {
    handleZoom,
  };
};

export default useZoom;

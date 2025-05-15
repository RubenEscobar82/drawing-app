import { FC, ReactNode, useRef, useState } from "react";
import { DisplayCanvasConfig } from "@src/types";
import { CanvasContext } from "@src/contexts";
import { getCanvasCtxFromRef, clearCanvas } from "@src/helpers";

interface CanvasContextProviderProps {
  children: ReactNode;
}

const CanvasProvider: FC<CanvasContextProviderProps> = ({ children }) => {
  const defaultCanvasWidth = 350;
  const defaultCanvasHeight = 300;

  const [displayCanvasConfig, setDisplayCanvasConfig] =
    useState<DisplayCanvasConfig>({
      canvasWidth: defaultCanvasWidth,
      canvasHeight: defaultCanvasHeight,
      imgWidth: defaultCanvasWidth,
      imgHeight: defaultCanvasHeight,
      scale: 1,
      offsetX: 0,
      offsetY: 0,
    });

  const offscreenCanvasRef = useRef(
    new OffscreenCanvas(defaultCanvasWidth, defaultCanvasHeight)
  );

  const displayCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const drawOnCanvasDisplay = (image: CanvasImageSource) => {
    if (displayCanvasConfig) {
      getCanvasCtxFromRef({ ref: displayCanvasRef }, (ctx) => {
        ctx.canvas.width = displayCanvasConfig.canvasWidth;
        ctx.canvas.height = displayCanvasConfig.canvasHeight;

        ctx.imageSmoothingEnabled = false;

        clearCanvas(displayCanvasRef);

        ctx.translate(displayCanvasConfig.offsetX, displayCanvasConfig.offsetY);
        ctx.scale(displayCanvasConfig.scale, displayCanvasConfig.scale);
        ctx.drawImage(image, 0, 0);
      });
    }
  };

  return (
    <CanvasContext.Provider
      value={{
        defaultCanvasWidth,
        defaultCanvasHeight,
        offscreenCanvasRef,
        displayCanvasRef,
        displayCanvasConfig,
        setDisplayCanvasConfig,
        drawOnCanvasDisplay,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export default CanvasProvider;

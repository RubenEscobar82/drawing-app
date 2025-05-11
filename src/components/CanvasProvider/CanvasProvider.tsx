import { FC, ReactNode, useRef, useState } from "react";
import { DisplayCanvasConfig } from "@src/types";
import { CanvasContext } from "@src/contexts";

interface CanvasContextProviderProps {
  children: ReactNode;
}

const CanvasProvider: FC<CanvasContextProviderProps> = ({ children }) => {
  const defaultWidth = 350;
  const defaultHeight = 300;

  const [displayCanvasConfig, setDisplayCanvasConfig] =
    useState<DisplayCanvasConfig>({
      canvasWidth: defaultWidth,
      canvasHeight: defaultHeight,
      scale: 1,
      imgWidth: defaultWidth,
      imgHeight: defaultHeight,
      offsetX: 0,
      offsetY: 0,
    });

  const offscreenCanvasRef = useRef(
    new OffscreenCanvas(defaultWidth, defaultHeight)
  );
  const displayCanvasRef = useRef<HTMLCanvasElement | null>(null);

  return (
    <CanvasContext.Provider
      value={{
        defaultWidth,
        defaultHeight,
        offscreenCanvasRef,
        displayCanvasRef,
        displayCanvasConfig,
        setDisplayCanvasConfig,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export default CanvasProvider;

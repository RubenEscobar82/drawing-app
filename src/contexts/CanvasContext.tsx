import { createContext, RefObject, Dispatch, SetStateAction } from "react";
import { DisplayCanvasConfig } from "@src/types";

interface CanvasContextType {
  defaultCanvasWidth: number;
  defaultCanvasHeight: number;
  offscreenCanvasRef: RefObject<OffscreenCanvas>;
  displayCanvasRef: RefObject<HTMLCanvasElement | null>;
  displayCanvasConfig: DisplayCanvasConfig;
  setDisplayCanvasConfig: Dispatch<SetStateAction<DisplayCanvasConfig>>;
  drawOnCanvasDisplay: (image: CanvasImageSource) => void;
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export default CanvasContext;

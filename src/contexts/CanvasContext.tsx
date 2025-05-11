import { createContext, RefObject, Dispatch, SetStateAction } from "react";
import { DisplayCanvasConfig } from "@src/types";

interface CanvasContextType {
  defaultWidth: number;
  defaultHeight: number;
  offscreenCanvasRef: RefObject<OffscreenCanvas>;
  displayCanvasRef: RefObject<HTMLCanvasElement | null>;
  displayCanvasConfig: DisplayCanvasConfig;
  setDisplayCanvasConfig: Dispatch<SetStateAction<DisplayCanvasConfig>>;
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export default CanvasContext;

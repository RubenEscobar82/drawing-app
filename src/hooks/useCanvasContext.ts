import { useContext } from "react";
import { CanvasContext } from "@src/contexts";

const useCanvasContext = () => {
  const context = useContext(CanvasContext);

  if (!context) {
    throw new Error(
      "useCanvasContext must be used within a CanvasContextProvider"
    );
  }

  return context;
};

export default useCanvasContext;

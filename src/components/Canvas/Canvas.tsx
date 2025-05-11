import { FC } from "react";
import { useCanvasContext } from "@src/hooks";
import styles from "./Canvas.module.scss";

const Canvas: FC = () => {
  const { displayCanvasConfig, displayCanvasRef } = useCanvasContext();

  return (
    <div className={styles.canvasContainer}>
      <canvas
        width={displayCanvasConfig.canvasWidth}
        height={displayCanvasConfig.canvasHeight}
        ref={displayCanvasRef}
      />
    </div>
  );
};

export default Canvas;

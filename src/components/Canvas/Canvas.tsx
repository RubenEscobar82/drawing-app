import { FC } from "react";
import styles from "./Canvas.module.scss";

const Canvas: FC = () => {
  return (
    <div className={styles.canvasContainer}>
      <canvas />
    </div>
  );
};

export default Canvas;

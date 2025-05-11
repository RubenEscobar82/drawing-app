import { FC } from "react";
import { Canvas } from "@src/components";
import styles from "./Workspace.module.scss";

const Workspace: FC = () => {
  return (
    <>
      <div id={styles.workspace}>
        <div className={styles.toolBar}></div>
        <div className={styles.canvasWrapper}>
          <Canvas />
        </div>
        <div className={styles.bottomBar}></div>
      </div>
    </>
  );
};

export default Workspace;

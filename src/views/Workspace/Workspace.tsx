import { FC } from "react";
//import "./Workspace.module.scss";
import styles from "./Workspace.module.scss";

const Workspace: FC = () => {
  return (
    <div id={styles.workspace}>
      <div className={styles.toolBar}>
        <button className={styles.tool}>✏️</button>
        <button className={styles.tool}>🖌️</button>
        <button className={styles.tool}>📐</button>
        <button className={styles.tool}>🧽</button>
      </div>
    </div>
  );
};

export default Workspace;

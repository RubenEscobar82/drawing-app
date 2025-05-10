import { FC } from "react";
import styles from "./Workspace.module.scss";

const Workspace: FC = () => {
  return (
    <>
      <div id={styles.workspace}>
        <div className={styles.toolBar}></div>
      </div>
    </>
  );
};

export default Workspace;

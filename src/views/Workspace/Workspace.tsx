import { FC, useState } from "react";
import { Modal } from "@src/components";
import styles from "./Workspace.module.scss";

const Workspace: FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deserunt
        debitis facere harum alias possimus cumque aperiam dolorem tempora
        placeat corporis? Dolore consequatur ab non distinctio laudantium
        deleniti sunt nesciunt numquam?
      </Modal>
      <div id={styles.workspace}>
        <div className={styles.toolBar}>
          <button className={styles.tool}>✏️</button>
          <button className={styles.tool}>🖌️</button>
          <button className={styles.tool}>📐</button>
          <button className={styles.tool}>🧽</button>
        </div>
      </div>
    </>
  );
};

export default Workspace;

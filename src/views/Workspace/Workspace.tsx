import { FC, ChangeEvent, useState } from "react";
import { Canvas } from "@src/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import styles from "./Workspace.module.scss";

const Workspace: FC = () => {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [showSplash, setShowSplash] = useState(true);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImgSrc(URL.createObjectURL(file));
      setShowSplash(false);
    }
  };

  return (
    <>
      {showSplash && (
        <div id={styles.splash}>
          <div className={styles.splashContent}>
            <h1>Drawing App</h1>
            <p>Upload an image or start from scratch.</p>

            <label className={styles.fileUpload}>
              <input type="file" accept="image/*" onChange={handleFileChange} />
              <FontAwesomeIcon icon={faUpload} /> Upload
            </label>

            <button
              className={styles.blankButton}
              onClick={() => {
                setShowSplash(false);
              }}
            >
              From scratch
            </button>
          </div>
        </div>
      )}
      <div id={styles.workspace}>
        <div className={styles.toolBar}></div>
        <div className={styles.canvasWrapper}>
          <Canvas imgSrc={imgSrc} />
        </div>
        <div className={styles.bottomBar}></div>
      </div>
    </>
  );
};

export default Workspace;

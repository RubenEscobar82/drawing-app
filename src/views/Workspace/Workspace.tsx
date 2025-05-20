import { FC, ChangeEvent, useState } from "react";
import { Canvas } from "@src/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faHome,
  faMagnifyingGlassPlus,
  faMagnifyingGlassMinus,
} from "@fortawesome/free-solid-svg-icons";
import { useCanvasContext, useZoom } from "@src/hooks";
import { float2Percentage } from "@src/helpers";
import { Step } from "@src/types";
import styles from "./Workspace.module.scss";

const Workspace: FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.SELECTING_IMAGE);
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  const { displayCanvasConfig } = useCanvasContext();
  const { handleZoom } = useZoom();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImgSrc(URL.createObjectURL(file));
      setCurrentStep(Step.DRAWING);
    }
  };

  const toggleHome = () => setCurrentStep(Step.SELECTING_IMAGE);

  const renderToggleHome = () => (
    <div className={styles.toggleHome} onClick={toggleHome}>
      <FontAwesomeIcon icon={faHome} />
    </div>
  );

  return (
    <>
      {currentStep === Step.SELECTING_IMAGE && (
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
                setImgSrc(null);
                setCurrentStep(Step.DRAWING);
              }}
            >
              From scratch
            </button>
          </div>
        </div>
      )}
      {currentStep === Step.DRAWING && (
        <div id={styles.workspace}>
          <div className={styles.toolBar}>{renderToggleHome()}</div>
          <div className={styles.canvasWrapper}>
            <Canvas imgSrc={imgSrc} />
          </div>
          <div className={styles.bottomBar}>
            {renderToggleHome()}
            <div id={styles.zoom}>
              <div
                className={styles.zoomButton}
                onClick={() =>
                  handleZoom({ scale: displayCanvasConfig.scale * 0.8 })
                }
              >
                <FontAwesomeIcon icon={faMagnifyingGlassMinus} />
              </div>
              <div id={styles.zoomLevel}>
                {float2Percentage(displayCanvasConfig.scale)}
              </div>
              <div
                className={styles.zoomButton}
                onClick={() =>
                  handleZoom({ scale: displayCanvasConfig.scale * 1.1 })
                }
              >
                <FontAwesomeIcon icon={faMagnifyingGlassPlus} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Workspace;

import { FC, ChangeEvent, useState } from "react";
import { Canvas } from "@src/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faHome,
  faMagnifyingGlassPlus,
  faMagnifyingGlassMinus,
  faPaintBrush,
} from "@fortawesome/free-solid-svg-icons";
import { useCanvasContext, useZoom } from "@src/hooks";
import { float2Percentage } from "@src/helpers";
import { Step } from "@src/types";
import "./Workspace.scss";

const Workspace: FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.SELECTING_IMAGE);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [showToolDrawer, setShowToolDrawer] = useState(false);

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

  const toggleShowToolDrawer = () => {
    setShowToolDrawer(!showToolDrawer);
  };

  const renderToggleHome = () => (
    <div className="toggleHome" onClick={toggleHome}>
      <FontAwesomeIcon icon={faHome} />
    </div>
  );

  return (
    <>
      {currentStep === Step.SELECTING_IMAGE && (
        <div id="splash">
          <div className="splashContent">
            <h1>Drawing App</h1>
            <p>Upload an image or start from scratch.</p>

            <label className="fileUpload">
              <input type="file" accept="image/*" onChange={handleFileChange} />
              <FontAwesomeIcon icon={faUpload} /> Upload
            </label>

            <button
              className="blankButton"
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
        <div id="workspace">
          <div id="sideBar">
            <div id="menu">
              {renderToggleHome()}
              <ul id="toolMenu">
                <li className="tool active" onClick={toggleShowToolDrawer}>
                  <FontAwesomeIcon icon={faPaintBrush} />
                </li>
              </ul>
            </div>
            {showToolDrawer && <div id="collapse"></div>}
          </div>
          <div id="main">
            <Canvas imgSrc={imgSrc} />
          </div>
          <div id="bottomBar">
            {renderToggleHome()}
            <div id="zoom">
              <div
                className="zoomButton"
                onClick={() =>
                  handleZoom({ scale: displayCanvasConfig.scale * 0.8 })
                }
              >
                <FontAwesomeIcon icon={faMagnifyingGlassMinus} />
              </div>
              <div id="zoomLevel">
                {float2Percentage(displayCanvasConfig.scale)}
              </div>
              <div
                className="zoomButton"
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

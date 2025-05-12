import { FC, useEffect, useRef } from "react";
import { useCanvasContext } from "@src/hooks";
import { getCanvasCtxFromRef } from "@src/helpers";
import styles from "./Canvas.module.scss";

interface canvasProps {
  imgSrc?: string | null;
}

const Canvas: FC<canvasProps> = ({ imgSrc }) => {
  const {
    displayCanvasConfig,
    setDisplayCanvasConfig,
    displayCanvasRef,
    drawOnCanvasDisplay,
    offscreenCanvasRef,
  } = useCanvasContext();

  const canvasContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    getCanvasCtxFromRef({ ref: offscreenCanvasRef }, (ctx) => {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      const canvasWidth =
        canvasContainerRef.current?.clientWidth || ctx.canvas.width;
      const canvasHeight =
        canvasContainerRef.current?.clientHeight || ctx.canvas.height;

      setDisplayCanvasConfig((prev) => ({
        ...prev,
        canvasWidth,
        canvasHeight,
        offsetX: (canvasWidth - ctx.canvas.width) / 2,
        offsetY: (canvasHeight - ctx.canvas.height) / 2,
      }));
    });
  }, []);

  useEffect(() => {
    getCanvasCtxFromRef({ ref: offscreenCanvasRef }, (ctx) => {
      drawOnCanvasDisplay(ctx.canvas);
    });
  }, [displayCanvasConfig]);

  useEffect(() => {
    if (imgSrc) {
      const img = new Image();
      img.onload = () => {
        offscreenCanvasRef.current = new OffscreenCanvas(img.width, img.height);

        getCanvasCtxFromRef({ ref: offscreenCanvasRef }, (ctx) => {
          ctx.drawImage(img, 0, 0, img.width, img.height);

          setDisplayCanvasConfig((prev) => {
            const scaleX =
              img.width > prev.canvasWidth ? prev.canvasWidth / img.width : 1;
            const scaleY =
              img.height > prev.canvasHeight
                ? prev.canvasHeight / img.height
                : 1;
            const scale = Math.min(scaleX, scaleY);

            const offsetX = (prev.canvasWidth - img.width * scale) / 2;
            const offsetY = (prev.canvasHeight - img.height * scale) / 2;

            return {
              ...prev,
              imgWidth: img.width,
              imgHeight: img.height,
              scale,
              offsetX,
              offsetY,
            };
          });
        });
      };
      img.src = imgSrc;
    }
  }, [imgSrc]);

  return (
    <div className={styles.canvasContainer} ref={canvasContainerRef}>
      <canvas
        width={displayCanvasConfig.canvasWidth}
        height={displayCanvasConfig.canvasHeight}
        ref={displayCanvasRef}
      />
    </div>
  );
};

export default Canvas;

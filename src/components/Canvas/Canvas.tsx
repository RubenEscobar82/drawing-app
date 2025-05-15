/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useRef } from "react";
import { useCanvasContext } from "@src/hooks";
import { getCanvasCtxFromRef } from "@src/helpers";
import styles from "./Canvas.module.scss";

interface canvasProps {
  imgSrc?: string | null;
}

const Canvas: FC<canvasProps> = ({ imgSrc }) => {
  const {
    defaultCanvasWidth,
    defaultCanvasHeight,
    displayCanvasConfig,
    setDisplayCanvasConfig,
    displayCanvasRef,
    drawOnCanvasDisplay,
    offscreenCanvasRef,
  } = useCanvasContext();

  const displayCanvasWrapperRef = useRef<HTMLDivElement | null>(null);

  const handleResize = () => {
    if (displayCanvasWrapperRef.current) {
      const { clientWidth: canvasWidth, clientHeight: canvasHeight } =
        displayCanvasWrapperRef.current;

      setDisplayCanvasConfig((prev) => {
        let scaleX = 1;
        let scaleY = 1;
        let offsetX = prev.offsetX;
        let offsetY = prev.offsetY;

        if (prev.imgWidth > canvasWidth) {
          scaleX = canvasWidth / prev.imgWidth;
        }
        if (prev.imgHeight > canvasHeight) {
          scaleY = canvasHeight / prev.imgHeight;
        }

        const scale = Math.min(scaleX, scaleY);

        if (prev.imgWidth * scale <= canvasWidth) {
          offsetX = (canvasWidth - prev.imgWidth * scale) / 2;
        } else {
          offsetX = (prev.offsetX / prev.scale) * scale;
        }

        if (prev.imgHeight * scale <= canvasHeight) {
          offsetY = (canvasHeight - prev.imgHeight * scale) / 2;
        } else {
          offsetY = (prev.offsetY / prev.scale) * scale;
        }

        return {
          ...prev,
          canvasWidth,
          canvasHeight,
          scale,
          offsetX,
          offsetY,
        };
      });
    }
  };

  useEffect(() => {
    if (displayCanvasWrapperRef.current) {
      const { clientWidth: canvasWidth, clientHeight: canvasHeight } =
        displayCanvasWrapperRef.current;

      if (imgSrc) {
        const img = new Image();

        img.onload = () => {
          offscreenCanvasRef.current = new OffscreenCanvas(
            img.width,
            img.height
          );

          getCanvasCtxFromRef({ ref: offscreenCanvasRef }, (ctx) => {
            ctx.drawImage(img, 0, 0, img.width, img.height);

            setDisplayCanvasConfig((prev) => {
              const scaleX =
                img.width > canvasWidth ? canvasWidth / img.width : 1;
              const scaleY =
                img.height > canvasHeight ? canvasHeight / img.height : 1;
              const scale = Math.min(scaleX, scaleY);

              return {
                ...prev,
                canvasWidth,
                canvasHeight,
                imgWidth: img.width,
                imgHeight: img.height,
                scale,
                offsetX: (canvasWidth - img.width * scale) / 2,
                offsetY: (canvasHeight - img.height * scale) / 2,
              };
            });
          });
        };

        img.src = imgSrc;
      } else {
        offscreenCanvasRef.current = new OffscreenCanvas(
          defaultCanvasWidth,
          defaultCanvasHeight
        );

        getCanvasCtxFromRef({ ref: offscreenCanvasRef }, (ctx) => {
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

          setDisplayCanvasConfig((prev) => {
            return {
              ...prev,
              canvasWidth,
              canvasHeight,
              imgWidth: ctx.canvas.width,
              imgHeight: ctx.canvas.height,
              scale: 1,
              offsetX: (canvasWidth - ctx.canvas.width) / 2,
              offsetY: (canvasHeight - ctx.canvas.height) / 2,
            };
          });
        });
      }
    }
  }, [imgSrc, displayCanvasWrapperRef.current]);

  useEffect(() => {
    getCanvasCtxFromRef({ ref: offscreenCanvasRef }, (ctx) => {
      drawOnCanvasDisplay(ctx.canvas);
    });
  }, [displayCanvasConfig]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={styles.canvasContainer} ref={displayCanvasWrapperRef}>
      <canvas ref={displayCanvasRef} />
    </div>
  );
};

export default Canvas;

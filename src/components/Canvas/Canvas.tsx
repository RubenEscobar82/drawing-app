/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useRef, MouseEvent, WheelEvent } from "react";
import { useCanvasContext, useZoom } from "@src/hooks";
import { getCanvasCtxFromRef, getCanvasEvtPosition } from "@src/helpers";
import { ZoomDirection } from "@src/types";
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

  const { handleZoom } = useZoom();

  const displayCanvasWrapperRef = useRef<HTMLDivElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLCanvasElement>) => {
    handleZoom({
      direction: ZoomDirection.IN,
      cursorPosition: getCanvasEvtPosition(event),
    });
  };

  const handleWheel = (event: WheelEvent<HTMLCanvasElement>) => {
    handleZoom({
      direction: event.deltaY < 0 ? ZoomDirection.IN : ZoomDirection.OUT,
      cursorPosition: getCanvasEvtPosition(event),
    });
  };

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

              const offsetX = (canvasWidth - img.width * scale) / 2;
              const offsetY = (canvasHeight - img.height * scale) / 2;

              return {
                ...prev,
                canvasWidth,
                canvasHeight,
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
      } else {
        offscreenCanvasRef.current = new OffscreenCanvas(
          defaultCanvasWidth,
          defaultCanvasHeight
        );

        getCanvasCtxFromRef({ ref: offscreenCanvasRef }, (ctx) => {
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

          setDisplayCanvasConfig((prev) => {
            const offsetX = (canvasWidth - ctx.canvas.width) / 2;
            const offsetY = (canvasHeight - ctx.canvas.height) / 2;

            return {
              ...prev,
              canvasWidth,
              canvasHeight,
              imgWidth: ctx.canvas.width,
              imgHeight: ctx.canvas.height,
              scale: 1,
              offsetX,
              offsetY,
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
      <canvas
        ref={displayCanvasRef}
        onClick={handleClick}
        onWheel={handleWheel}
      />
    </div>
  );
};

export default Canvas;

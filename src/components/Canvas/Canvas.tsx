/* eslint-disable react-hooks/exhaustive-deps */
import {
  FC,
  useEffect,
  useRef,
  MouseEvent,
  TouchEvent,
  WheelEvent,
} from "react";
import { ScrollBar } from "@src/components";
import { useCanvasContext, useZoom } from "@src/hooks";
import {
  getCanvasCtxFromRef,
  getCanvasEvtPosition,
  getPinchDistance,
  clampValue,
  float2Percentage,
} from "@src/helpers";
import { CursorPosition } from "@src/types";
import "./Canvas.scss";

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

  const magnifyingFactor = 1.1;
  const reductionFactor = 0.8;

  const { handleZoom } = useZoom();

  const displayCanvasWrapperRef = useRef<HTMLDivElement | null>(null);

  const isPanning = useRef<boolean>(false);
  const lastPinchDistance = useRef<number | null>(null);
  const lastTouchPosition = useRef<CursorPosition>({ x: 0, y: 0 });
  const firstPinchPosition = useRef<CursorPosition>({ x: 0, y: 0 });

  const handleTouchStar = (event: TouchEvent<HTMLCanvasElement>) => {
    if ("touches" in event) {
      if (event.touches.length === 2) {
        const distance = getPinchDistance(event.touches);
        lastPinchDistance.current = distance;
        firstPinchPosition.current = getCanvasEvtPosition(event);
      } else if (event.touches.length === 1) {
        isPanning.current = true;
        lastTouchPosition.current = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY,
        };
      }
    }
  };

  const handleTouchMove = (
    event: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>
  ) => {
    if ("touches" in event) {
      if (event.touches.length == 2) {
        const newDistance = getPinchDistance(event.touches);
        if (lastPinchDistance.current !== null) {
          const sensitivity = 0.005;
          const diff = newDistance - lastPinchDistance.current;
          handleZoom({
            scale: displayCanvasConfig.scale + diff * sensitivity,
            cursorPosition: firstPinchPosition.current,
          });
        }
        lastPinchDistance.current = newDistance;
      } else if (event.touches.length === 1) {
        if (isPanning.current) {
          const currentTouchPosition = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY,
          };

          const dx = currentTouchPosition.x - lastTouchPosition.current.x;
          const dy = currentTouchPosition.y - lastTouchPosition.current.y;

          lastTouchPosition.current = currentTouchPosition;

          setDisplayCanvasConfig((prev) => {
            const scaledImgWidth = prev.imgWidth * prev.scale;
            const scaledImgHeight = prev.imgHeight * prev.scale;

            return {
              ...prev,
              offsetX:
                scaledImgWidth > prev.canvasWidth
                  ? clampValue({
                      min: prev.canvasWidth - scaledImgWidth,
                      value: prev.offsetX + dx,
                      max: 0,
                    })
                  : prev.offsetX,
              offsetY:
                scaledImgHeight > prev.canvasHeight
                  ? clampValue({
                      min: prev.canvasHeight - scaledImgHeight,
                      value: prev.offsetY + dy,
                      max: 0,
                    })
                  : prev.offsetY,
            };
          });
        }
      }
    }
  };

  const handleTouchEnd = () => {
    isPanning.current = false;
  };

  const handleWheel = (event: WheelEvent<HTMLCanvasElement>) => {
    handleZoom({
      scale:
        displayCanvasConfig.scale *
        (event.deltaY < 0 ? magnifyingFactor : reductionFactor),
      cursorPosition: getCanvasEvtPosition(event),
    });
  };

  const handleScrollPositionUpdate = (
    horizontal: boolean,
    scrollPosition: number
  ) => {
    if (horizontal) {
      setDisplayCanvasConfig((prev) => {
        const offsetX = -1 * scrollPosition;
        return { ...prev, offsetX };
      });
    } else {
      setDisplayCanvasConfig((prev) => {
        const offsetY = -1 * scrollPosition;
        return { ...prev, offsetY };
      });
    }
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
    const observer = new ResizeObserver((entries) => {
      entries.forEach(handleResize);
    });

    if (displayCanvasWrapperRef.current) {
      observer.observe(displayCanvasWrapperRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="canvasWrapper" ref={displayCanvasWrapperRef}>
      <canvas
        id="displayCanvas"
        ref={displayCanvasRef}
        onWheel={handleWheel}
        onTouchStart={handleTouchStar}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
      <div id="imageInfoContainer">
        <div id="imageInfo">
          {displayCanvasConfig.imgWidth} x {displayCanvasConfig.imgHeight} px @{" "}
          {float2Percentage(displayCanvasConfig.scale)}
        </div>
        <div id="horizontalScrollHolder">
          <ScrollBar
            horizontal={true}
            contentLength={
              displayCanvasConfig.imgWidth * displayCanvasConfig.scale
            }
            displayedContentLength={displayCanvasConfig.canvasWidth}
            scrollPosition={-1 * displayCanvasConfig.offsetX}
            onScroll={handleScrollPositionUpdate}
          />
        </div>
        <div id="spacer" />
      </div>
      <div id="verticalScrollHolder">
        <ScrollBar
          contentLength={
            displayCanvasConfig.imgHeight * displayCanvasConfig.scale
          }
          displayedContentLength={displayCanvasConfig.canvasHeight}
          scrollPosition={-1 * displayCanvasConfig.offsetY}
          onScroll={handleScrollPositionUpdate}
        ></ScrollBar>
      </div>
    </div>
  );
};

export default Canvas;

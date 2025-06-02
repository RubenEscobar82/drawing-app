import { FC, MouseEvent, TouchEvent, useRef, useEffect, useState } from "react";
import { clampValue } from "@src/helpers";
import "./ScrollBar.scss";

interface ScrollBarProps {
  horizontal?: boolean;
  scrollPosition?: number;
  contentLength: number;
  displayedContentLength: number;
  onScroll: (horizontal: boolean, newPosition: number) => void;
  onIsDragging?: (isDragging: boolean) => void;
  className?: string;
}

const ScrollBar: FC<ScrollBarProps> = ({
  horizontal = false,
  scrollPosition = 0,
  contentLength,
  displayedContentLength,
  onScroll,
  onIsDragging,
  className,
}) => {
  const [scrollbarLength, setScrollBarLength] = useState(0);
  const [thumbLength, setThumbLength] = useState(0);
  const scrollBarRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const convertScroll = (outerScroll: number) => {
    const innerScroll = (outerScroll / contentLength) * scrollbarLength;

    return clampValue({
      min: 0,
      value: innerScroll,
      max: scrollbarLength - thumbLength,
    });
  };

  const handleTouchStar = (event: TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);

    const startY = event.touches[0].clientY;
    const startX = event.touches[0].clientX;
    const startScroll = convertScroll(scrollPosition);

    const getDelta = (evt: globalThis.TouchEvent) =>
      horizontal
        ? evt.touches[0].clientX - startX
        : evt.touches[0].clientY - startY;

    const onTouchMove = (evt: globalThis.TouchEvent) => {
      const delta = getDelta(evt);
      const newScroll = clampValue({
        min: 0,
        value: startScroll + delta,
        max: scrollbarLength - thumbLength,
      });
      onScroll(horizontal, (newScroll / scrollbarLength) * contentLength);
    };

    const onTouchEnd = () => {
      setIsDragging(false);

      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };

    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);

    event.stopPropagation();
  };

  const handleMouseDown = (event: MouseEvent) => {
    setIsDragging(true);

    event.preventDefault();
    const startY = event.clientY;
    const startX = event.clientX;
    const startScroll = convertScroll(scrollPosition);

    const getDelta = (evt: globalThis.MouseEvent) =>
      horizontal ? evt.clientX - startX : evt.clientY - startY;

    const onMouseMove = (evt: globalThis.MouseEvent) => {
      const delta = getDelta(evt);
      const newScroll = clampValue({
        min: 0,
        value: startScroll + delta,
        max: scrollbarLength - thumbLength,
      });
      onScroll(horizontal, (newScroll / scrollbarLength) * contentLength);
    };

    const onMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    event.stopPropagation();
  };

  const getThumbDimensionsStyles = () => {
    let result = {};
    if (horizontal) {
      result = {
        width: `${thumbLength}px`,
        top: "0px",
        left: `${clampValue({
          min: 0,
          value: convertScroll(scrollPosition),
          max: scrollbarLength - thumbLength,
        })}px`,
      };
    } else {
      result = {
        height: `${thumbLength}px`,
        top: `${clampValue({
          min: 0,
          value: convertScroll(scrollPosition),
          max: scrollbarLength - thumbLength,
        })}px`,
        left: "0px",
      };
    }
    return result;
  };

  const handleClickOnScrollBar = (event: MouseEvent) => {
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    const getClickLocation = () =>
      horizontal ? event.clientX - rect.x : event.clientY - rect.y;
    const newScroll = clampValue({
      min: 0,
      value: getClickLocation() - thumbLength / 2,
      max: scrollbarLength - thumbLength,
    });
    onScroll(horizontal, (newScroll / scrollbarLength) * contentLength);
  };

  const handleClickOnThumb = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  useEffect(() => {
    if (scrollBarRef.current) {
      setScrollBarLength(
        scrollBarRef.current[horizontal ? "clientWidth" : "clientHeight"]
      );
    }
  }, [scrollBarRef.current]);

  useEffect(() => {
    setThumbLength(
      Math.floor((displayedContentLength / contentLength) * scrollbarLength)
    );
  }, [displayedContentLength, contentLength, scrollbarLength]);

  useEffect(() => {
    if (onIsDragging) {
      onIsDragging(isDragging);
    }
  }, [isDragging]);

  return displayedContentLength < contentLength ? (
    <div
      ref={scrollBarRef}
      className={`${
        horizontal ? "horizontalScrollBar" : "verticalScrollBar"
      } ${className}`}
      onClick={handleClickOnScrollBar}
    >
      <div
        ref={thumbRef}
        className={`thumb ${isDragging ? "dragging" : ""}`}
        style={getThumbDimensionsStyles()}
        onClick={handleClickOnThumb}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStar}
      ></div>
    </div>
  ) : null;
};

export default ScrollBar;

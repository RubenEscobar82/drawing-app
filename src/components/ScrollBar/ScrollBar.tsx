import { FC, MouseEvent, TouchEvent, useRef } from "react";
import { clampValue } from "@src/helpers";
import styles from "./ScrollBar.module.scss";

interface ScrollBarProps {
  horizontal?: boolean;
  scrollPosition?: number;
  contentLength: number;
  displayedContentLength: number;
  onScroll: (horizontal: boolean, newPosition: number) => void;
}

const ScrollBar: FC<ScrollBarProps> = ({
  horizontal = false,
  scrollPosition = 0,
  contentLength,
  displayedContentLength,
  onScroll,
}) => {
  const scrollBarRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  const getScrollBarLength = () => {
    let length = 0;
    if (scrollBarRef.current) {
      if (horizontal) {
        length = scrollBarRef.current.clientWidth;
      } else {
        length = scrollBarRef.current.clientHeight;
      }
    }
    return length;
  };

  const getThumbLength = () => {
    return (displayedContentLength / contentLength) * getScrollBarLength();
  };

  const convertScroll = (outerScroll: number) => {
    const innerScroll = (outerScroll / contentLength) * getScrollBarLength();

    return clampValue({
      min: 0,
      value: innerScroll,
      max: getScrollBarLength() - getThumbLength(),
    });
  };

  const handleTouchStar = (event: TouchEvent<HTMLDivElement>) => {
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
        max: getScrollBarLength() - getThumbLength(),
      });
      onScroll(horizontal, (newScroll / getScrollBarLength()) * contentLength);
    };

    const onTouchEnd = () => {
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };

    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);

    event.stopPropagation();
  };

  const handleMouseDown = (event: MouseEvent) => {
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
        max: getScrollBarLength() - getThumbLength(),
      });
      onScroll(horizontal, (newScroll / getScrollBarLength()) * contentLength);
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    event.stopPropagation();
  };

  const getThumbDimensionsStyles = () => {
    if (horizontal) {
      return {
        width: `${getThumbLength()}px`,
        top: "0px",
        left: `${clampValue({
          min: 0,
          value: convertScroll(scrollPosition),
          max: getScrollBarLength() - getThumbLength(),
        })}px`,
      };
    } else {
      return {
        height: `${getThumbLength()}px`,
        top: `${clampValue({
          min: 0,
          value: convertScroll(scrollPosition),
          max: getScrollBarLength() - getThumbLength(),
        })}px`,
        left: "0px",
      };
    }
  };

  const handleClickOnScrollBar = (event: MouseEvent) => {
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    const getClickLocation = () =>
      horizontal ? event.clientX - rect.x : event.clientY - rect.y;
    const newScroll = clampValue({
      min: 0,
      value: getClickLocation() - getThumbLength() / 2,
      max: getScrollBarLength() - getThumbLength(),
    });
    onScroll(horizontal, (newScroll / getScrollBarLength()) * contentLength);
  };

  const handleClickOnThumb = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <>
      {displayedContentLength < contentLength && (
        <div
          ref={scrollBarRef}
          className={
            horizontal ? styles.scrollBarHorizontal : styles.scrollBarVertical
          }
          onClick={handleClickOnScrollBar}
        >
          <div
            ref={thumbRef}
            className={styles.thumb}
            style={getThumbDimensionsStyles()}
            onClick={handleClickOnThumb}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStar}
          ></div>
        </div>
      )}
    </>
  );
};

export default ScrollBar;

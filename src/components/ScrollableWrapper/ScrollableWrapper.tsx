import { FC, ReactNode, useEffect, useRef, useState, WheelEvent } from "react";
import { ScrollBar } from "@src/components";
import { useSingleTouchActions } from "@src/hooks";
import { clampValue } from "@src/helpers";
import "./ScrollableWrapper.scss";

interface ScrollableWrapperProps {
  children?: ReactNode | ReactNode[];
}

const ScrollableWrapper: FC<ScrollableWrapperProps> = ({ children }) => {
  const [isHorizontalDragging, setIsHorizontalDragging] = useState(false);
  const [isVerticalDragging, setIsVerticalDragging] = useState(false);
  const [isMouseIn, setIsMouseIn] = useState(false);
  const [horizontalContentLength, setHorizontalContentLength] = useState(0);
  const [horizontalDisplayLength, setHorizontalDisplayLength] = useState(0);
  const [verticalContentLength, setVerticalContentLength] = useState(0);
  const [verticalDisplayLength, setVerticalDisplayLength] = useState(0);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);

  const normalizeNewLeftValue = (value: number) => {
    let min = 0;

    if (wrapperRef.current && contentRef.current) {
      min =
        0 - (contentRef.current.clientWidth - wrapperRef.current.clientWidth);
    }

    return clampValue({ min, value, max: 0 });
  };
  const normalizeNewTopValue = (value: number) => {
    let min = 0;

    if (wrapperRef.current && contentRef.current) {
      min =
        0 - (contentRef.current.clientHeight - wrapperRef.current.clientHeight);
    }

    return clampValue({ min, value, max: 0 });
  };

  const { handleTouchStart, handleTouchMove, handleTouchEnd } =
    useSingleTouchActions({
      onMovement: ({ dx, dy }) => {
        setLeft((prev) => normalizeNewLeftValue(prev + dx));
        setTop((prev) => normalizeNewTopValue(prev + dy));
      },
    });

  const handleWheel = (event: WheelEvent) => {
    setTop((prev) => normalizeNewTopValue(prev + -1 * event.deltaY));
  };

  const handleMouseEnter = () => {
    setIsMouseIn(true);
  };

  const handleMouseLeave = () => {
    setIsMouseIn(false);
  };

  const handleScroll = (horizontal: boolean, position: number) => {
    if (horizontal) {
      setLeft(-1 * position);
    } else {
      setTop(-1 * position);
    }
  };

  useEffect(() => {
    setHorizontalContentLength(contentRef.current?.clientWidth || 0);
    setVerticalContentLength(contentRef.current?.clientHeight || 0);
  }, [contentRef.current]);

  useEffect(() => {
    setHorizontalDisplayLength(wrapperRef.current?.clientWidth || 0);
    setVerticalDisplayLength(wrapperRef.current?.clientHeight || 0);
  }, [wrapperRef.current]);

  return (
    <div
      className="scrollableWrapper"
      ref={wrapperRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      <div
        className="content"
        ref={contentRef}
        style={{ top: `${top}px`, left: `${left}px` }}
      >
        {children}
      </div>
      {(isVerticalDragging || isMouseIn) &&
        verticalContentLength > verticalDisplayLength && (
          <div
            className={`verticalScrollHolder ${
              isVerticalDragging ? "dragging" : ""
            }`}
          >
            <ScrollBar
              className="xs"
              contentLength={contentRef.current?.clientHeight || 0}
              displayedContentLength={wrapperRef.current?.clientHeight || 0}
              onScroll={handleScroll}
              onIsDragging={(isDragging) => setIsVerticalDragging(isDragging)}
              scrollPosition={-1 * top}
            />
          </div>
        )}
      {(isHorizontalDragging || isMouseIn) &&
        horizontalContentLength > horizontalDisplayLength && (
          <div
            className={`horizontalScrollHolder ${
              isHorizontalDragging ? "dragging" : ""
            }`}
          >
            <ScrollBar
              horizontal={true}
              className="xs"
              contentLength={contentRef.current?.clientWidth || 0}
              displayedContentLength={wrapperRef.current?.clientWidth || 0}
              onScroll={handleScroll}
              onIsDragging={(isDragging) => setIsHorizontalDragging(isDragging)}
              scrollPosition={-1 * left}
            />
          </div>
        )}
    </div>
  );
};

export default ScrollableWrapper;

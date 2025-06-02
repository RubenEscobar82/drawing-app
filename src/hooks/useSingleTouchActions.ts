import { TouchEvent, useRef } from "react";
import { CursorPosition } from "@src/types";

const useSingleTouchActions = (arg: {
  onMovement: (distances: { dx: number; dy: number }) => void;
}) => {
  const isPanning = useRef<boolean>(false);
  const lastTouchPosition = useRef<CursorPosition>({ x: 0, y: 0 });

  const handleTouchStart = (event: TouchEvent) => {
    if (event.touches.length === 1) {
      isPanning.current = true;
      lastTouchPosition.current = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };
    }
  };

  const handleTouchMove = (event: TouchEvent) => {
    if (event.touches.length === 1 && isPanning.current) {
      const currentTouchPosition = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };

      const dx = currentTouchPosition.x - lastTouchPosition.current.x;
      const dy = currentTouchPosition.y - lastTouchPosition.current.y;

      lastTouchPosition.current = currentTouchPosition;

      arg.onMovement({ dx, dy });
    }
  };

  const handleTouchEnd = () => (isPanning.current = false);

  return { handleTouchStart, handleTouchMove, handleTouchEnd };
};

export default useSingleTouchActions;

import {
  useMotionValueEvent,
  useScroll as useScrollMotion,
} from 'framer-motion';
import { useState } from 'react';

type Result = {
  isScrollTop: boolean;
};

const SCROLL_Y_THRESHOLD = 40;

export function useScroll(): Result {
  const { scrollY } = useScrollMotion();
  const [isScrollTop, setIsScrollTop] = useState(true);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrollTop(latest <= SCROLL_Y_THRESHOLD);
  });

  return { isScrollTop };
}

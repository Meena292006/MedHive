import { motion as t } from "./tokens";

export const hero = {
  initial: {
    opacity: 0,
    y: 120,
    scale: 0.9,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  transition: {
    duration: 1,
    ease: "easeOut",
  },
};

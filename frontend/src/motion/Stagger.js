import { motion as t } from "./tokens";

export const stagger = {
  container: {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.4,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 60 },
    show: { opacity: 1, y: 0 },
  },
};

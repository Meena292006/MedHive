import { motion } from "framer-motion";
import { motion as t } from "./tokens";

export function Scene({ children }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: t.scale.enter,
        y: t.distance.lg,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        scale: t.scale.exit,
        y: -t.distance.md,
      }}
      transition={{
        duration: t.duration.cinematic,
        ease: t.ease.smooth,
      }}
      style={{ minHeight: "100vh" }}
    >
      {children}
    </motion.div>
  );
}

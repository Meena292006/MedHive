import { motion } from "framer-motion";

export function AmbientOrb({ color, size, duration }) {
  return (
    <motion.div
      animate={{
        x: [-300, 300, -300],
        y: [-200, 200, -200],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        filter: "blur(120px)",
        opacity: 0.35,
      }}
    />
  );
}

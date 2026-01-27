import { Box } from "@mui/material";
import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {/* Gradient mesh */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(600px at 20% 20%, rgba(0,212,255,0.18), transparent 40%),
            radial-gradient(500px at 80% 30%, rgba(59,130,246,0.15), transparent 45%),
            radial-gradient(700px at 50% 80%, rgba(6,182,212,0.12), transparent 50%)
          `,
        }}
      />

      {/* Floating blob 1 */}
      <motion.div
        animate={{ y: [0, -40, 0], x: [0, 30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          width: 420,
          height: 420,
          top: "10%",
          left: "5%",
          borderRadius: "50%",
          background: "rgba(0,212,255,0.12)",
          filter: "blur(120px)",
        }}
      />

      {/* Floating blob 2 */}
      <motion.div
        animate={{ y: [0, 50, 0], x: [0, -40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          bottom: "10%",
          right: "10%",
          borderRadius: "50%",
          background: "rgba(59,130,246,0.14)",
          filter: "blur(140px)",
        }}
      />
    </Box>
  );
}

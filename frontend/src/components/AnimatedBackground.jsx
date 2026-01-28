import { Box, useTheme } from "@mui/material";
import { motion } from "framer-motion";

export default function AnimatedBackground() {
  const theme = useTheme();
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
            radial-gradient(600px at 20% 20%, ${theme.palette.secondary.light}, transparent 40%),
            radial-gradient(500px at 80% 30%, ${theme.palette.primary.light}, transparent 45%),
            radial-gradient(700px at 50% 80%, ${theme.palette.secondary.light}80, transparent 50%)
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
          background: theme.palette.secondary.light,
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
          background: theme.palette.primary.light,
          filter: "blur(140px)",
        }}
      />
    </Box>
  );
}

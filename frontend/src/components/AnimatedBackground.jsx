import { Box } from "@mui/material";
import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {/* Animated gradient orbs */}
      <motion.div
        style={{
          position: "absolute",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #4318FF 0%, #6AD2FF 100%)",
          filter: "blur(100px)",
          opacity: 0.3,
          top: "-200px",
          left: "-200px",
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        style={{
          position: "absolute",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #6AD2FF 0%, #05CD99 100%)",
          filter: "blur(100px)",
          opacity: 0.25,
          bottom: "-150px",
          right: "-150px",
        }}
        animate={{
          x: [0, -80, 0],
          y: [0, -40, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        style={{
          position: "absolute",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #EE5D50 0%, #FFB547 100%)",
          filter: "blur(80px)",
          opacity: 0.2,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating particles */}
      {(() => {
        const particles = [];
        for (let i = 0; i < 20; i++) {
          const size = (i % 5) * 0.8 + 2;
          const color = i % 2 === 0 ? "67, 24, 255" : "106, 210, 255";
          const opacity = 0.3 + (i % 3) * 0.2;
          const left = (i * 5) % 100;
          const top = (i * 7) % 100;
          const duration = 2 + (i % 3);
          const delay = (i % 4) * 0.5;
          const xOffset = (i % 3 - 1) * 10;
          
          particles.push(
            <motion.div
              key={i}
              style={{
                position: "absolute",
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: "50%",
                background: `rgba(${color}, ${opacity})`,
                left: `${left}%`,
                top: `${top}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, xOffset, 0],
                opacity: [opacity, opacity + 0.4, opacity],
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                delay: delay,
                ease: "easeInOut",
              }}
            />
          );
        }
        return particles;
      })()}
    </Box>
  );
}

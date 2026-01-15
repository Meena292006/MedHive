import { Card } from "@mui/material";
import { motion } from "framer-motion";

export default function AnimatedCard({ children, delay = 0, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card {...props}>{children}</Card>
    </motion.div>
  );
}

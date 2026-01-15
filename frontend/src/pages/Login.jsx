import { Button, Box, Typography, Card, CardContent, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MedicalServicesIcon from "@mui/icons-material/MedicalServicesRounded";
import PersonIcon from "@mui/icons-material/PersonRounded";
import LocalHospitalIcon from "@mui/icons-material/LocalHospitalRounded";
import AnimatedBackground from "../components/AnimatedBackground";

export default function Login() {
  const navigate = useNavigate();
  const theme = useTheme();

  const login = (role) => {
    localStorage.setItem("role", role);
    navigate(role === "doctor" ? "/doctor" : "/patient");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, #0f172a 50%, ${theme.palette.primary.dark} 100%)`,
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* <AnimatedBackground /> */}

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ position: "relative", zIndex: 10 }}
      >
        <Card
          sx={{
            width: { xs: "90%", sm: 450 },
            borderRadius: 6,
            backdropFilter: "blur(30px)",
            background: "rgba(255, 255, 255, 0.08)",
            boxShadow: "0 25px 50px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.15)",
            position: "relative",
            zIndex: 1,
          }}
        >
          <CardContent sx={{ textAlign: "center", p: 5 }}>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 200 }}
            >
              <Box sx={{
                width: 100, height: 100, margin: "0 auto",
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                borderRadius: "24px",
                display: "flex", alignItems: "center", justifyContent: "center", mb: 3,
                boxShadow: `0 20px 40px ${theme.palette.primary.main}40`,
                position: "relative",
              }}>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                >
                  <LocalHospitalIcon sx={{ fontSize: 50, color: "white" }} />
                </motion.div>
              </Box>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Typography
                variant="h3"
                fontWeight="900"
                sx={{ 
                  color: "white", 
                  letterSpacing: 2, 
                  mb: 1,
                  background: `linear-gradient(135deg, #ffffff, ${theme.palette.secondary.light})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                MedHive
              </Typography>

              <Typography
                variant="body1"
                sx={{ color: "rgba(255,255,255,0.8)", mb: 5, fontWeight: 500 }}
              >
                Next-Gen Clinical Decision Support
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<PersonIcon />}
                sx={{
                  mb: 2,
                  py: 1.8,
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #ffffff, #f8fafc)",
                  color: theme.palette.primary.dark,
                  borderRadius: 3,
                  boxShadow: "0 10px 30px rgba(255,255,255,0.3)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #f8fafc, #ffffff)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 15px 40px rgba(255,255,255,0.4)",
                  },
                  transition: "all 0.3s",
                }}
                onClick={() => login("patient")}
              >
                Patient Portal
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={<MedicalServicesIcon />}
                sx={{
                  py: 1.8,
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  borderColor: "rgba(255,255,255,0.4)",
                  borderWidth: 2,
                  color: "white",
                  borderRadius: 3,
                  background: "rgba(255,255,255,0.05)",
                  "&:hover": {
                    borderColor: "white",
                    background: "rgba(255,255,255,0.15)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 10px 30px rgba(255,255,255,0.2)",
                  },
                  transition: "all 0.3s",
                }}
                onClick={() => login("doctor")}
              >
                Doctor Portal
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <Typography
                variant="caption"
                sx={{ display: "block", mt: 4, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}
              >
                Secure hospital access • MedHive © 2026
              </Typography>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
}

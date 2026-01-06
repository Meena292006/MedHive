import { Button, Box, Typography, Card, CardContent, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MedicalServicesIcon from "@mui/icons-material/MedicalServicesRounded";
import PersonIcon from "@mui/icons-material/PersonRounded";
import LocalHospitalIcon from "@mui/icons-material/LocalHospitalRounded";

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
        background: `linear-gradient(135deg, ${theme.palette.primary.dark}, #0f172a)`,
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Decorative background blobs */}
      <Box sx={{ position: "absolute", top: -100, left: -100, width: 400, height: 400, borderRadius: "50%", background: theme.palette.primary.main, filter: "blur(100px)", opacity: 0.3 }} />
      <Box sx={{ position: "absolute", bottom: -100, right: -100, width: 300, height: 300, borderRadius: "50%", background: theme.palette.secondary.main, filter: "blur(80px)", opacity: 0.2 }} />

      <Card
        sx={{
          width: 400,
          borderRadius: 4,
          backdropFilter: "blur(20px)",
          background: "rgba(255, 255, 255, 0.05)",
          boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <CardContent sx={{ textAlign: "center", p: 5 }}>
          <Box sx={{
            width: 80, height: 80, margin: "0 auto",
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            borderRadius: "20px",
            display: "flex", alignItems: "center", justifyContent: "center", mb: 3,
            boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
          }}>
            <LocalHospitalIcon sx={{ fontSize: 40, color: "white" }} />
          </Box>

          <Typography
            variant="h4"
            fontWeight="800"
            sx={{ color: "white", letterSpacing: 1, mb: 0.5 }}
          >
            MedHive
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: "rgba(255,255,255,0.7)", mb: 5 }}
          >
            Next-Gen Clinical Decision Support
          </Typography>

          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={<PersonIcon />}
            sx={{
              mb: 2,
              py: 1.5,
              fontSize: "1rem",
              background: "white",
              color: theme.palette.primary.dark,
              "&:hover": {
                background: "#f8fafc",
              },
            }}
            onClick={() => login("patient")}
          >
            Patient Portal
          </Button>

          <Button
            fullWidth
            variant="outlined"
            size="large"
            startIcon={<MedicalServicesIcon />}
            sx={{
              py: 1.5,
              fontSize: "1rem",
              borderColor: "rgba(255,255,255,0.3)",
              color: "white",
              "&:hover": {
                borderColor: "white",
                background: "rgba(255,255,255,0.1)"
              },
            }}
            onClick={() => login("doctor")}
          >
            Doctor Portal
          </Button>

          <Typography
            variant="caption"
            sx={{ display: "block", mt: 4, color: "rgba(255,255,255,0.4)" }}
          >
            Secure hospital access • MedHive © 2026
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

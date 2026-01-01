import { Button, Box, Typography, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import PersonIcon from "@mui/icons-material/Person";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

export default function Login() {
  const navigate = useNavigate();

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
        background: "linear-gradient(135deg, #020617, #0f172a, #7f1d1d)",
      }}
    >
      <Card
        sx={{
          width: 380,
          borderRadius: 4,
          backdropFilter: "blur(10px)",
          background: "rgba(15, 23, 42, 0.85)",
          boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <CardContent sx={{ textAlign: "center", p: 4 }}>
          {/* ICON */}
          <LocalHospitalIcon
            sx={{ fontSize: 56, color: "#38bdf8", mb: 1 }}
          />

          {/* TITLE */}
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: "#f8fafc", letterSpacing: 1 }}
          >
            MedHive
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: "#cbd5f5", mb: 4 }}
          >
            AI-Powered Clinical Decision Support
          </Typography>

          {/* PATIENT LOGIN */}
          <Button
            fullWidth
            variant="contained"
            startIcon={<PersonIcon />}
            sx={{
              mb: 2,
              py: 1.3,
              fontWeight: "bold",
              background: "linear-gradient(135deg, #0ea5e9, #2563eb)",
              "&:hover": {
                background: "linear-gradient(135deg, #0284c7, #1d4ed8)",
              },
            }}
            onClick={() => login("patient")}
          >
            Patient Portal
          </Button>

          {/* DOCTOR LOGIN */}
          <Button
            fullWidth
            variant="contained"
            startIcon={<MedicalServicesIcon />}
            sx={{
              py: 1.3,
              fontWeight: "bold",
              background: "linear-gradient(135deg, #dc2626, #7f1d1d)",
              "&:hover": {
                background: "linear-gradient(135deg, #b91c1c, #7f1d1d)",
              },
            }}
            onClick={() => login("doctor")}
          >
            Doctor Portal
          </Button>

          {/* FOOTER */}
          <Typography
            variant="caption"
            sx={{ display: "block", mt: 4, color: "#94a3b8" }}
          >
            Secure hospital access • MedHive © 2026
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

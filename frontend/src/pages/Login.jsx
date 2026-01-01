import { Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const login = (role) => {
    localStorage.setItem("role", role);
    navigate(role === "doctor" ? "/doctor" : "/patient");
  };

  return (
    <Box sx={{ mt: 15, textAlign: "center" }}>
      <h1>MedHive Hospital</h1>
      <p>AI-Powered Clinical Decision Support</p>

      <Button
        variant="contained"
        sx={{ m: 2 }}
        onClick={() => login("patient")}
      >
        Patient Login
      </Button>

      <Button
        variant="outlined"
        sx={{ m: 2 }}
        onClick={() => login("doctor")}
      >
        Doctor Login
      </Button>
    </Box>
  );
}

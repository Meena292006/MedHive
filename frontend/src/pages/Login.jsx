import { Button, Box, Typography, Card, CardContent, useTheme, Dialog, DialogTitle, DialogContent, Stack, Alert, Divider, Collapse } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import MedicalServicesIcon from "@mui/icons-material/MedicalServicesRounded";
import PersonIcon from "@mui/icons-material/PersonRounded";
import LocalHospitalIcon from "@mui/icons-material/LocalHospitalRounded";
import GoogleIcon from "@mui/icons-material/Google";
import EmailIcon from "@mui/icons-material/EmailRounded";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import EmailPasswordAuth from "../components/EmailPasswordAuth";

export default function Login() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user, role, error, loginWithGoogle, loginWithEmail, signUpWithEmail, selectRole } = useAuth();
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [showEmailAuth, setShowEmailAuth] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      if (role) {
        navigate(role === "doctor" ? "/doctor" : "/patient");
      } else {
        setShowRoleSelection(true);
      }
    }
  }, [user, role, navigate]);

  const handleLogin = async () => {
    try {
      setAuthError("");
      setIsLoading(true);
      await loginWithGoogle();
    } catch (error) {
      console.error("Login failed", error);
      setAuthError(error.message || "Google sign-in failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async (email, password) => {
    try {
      setAuthError("");
      await loginWithEmail(email, password);
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const handleEmailSignUp = async (email, password, name, role) => {
    try {
      setAuthError("");
      await signUpWithEmail(email, password, name, role);
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const handleRoleSelection = async (selectedRole) => {
    try {
      setAuthError("");
      await selectRole(selectedRole);
      setShowRoleSelection(false);
    } catch (error) {
      setAuthError(error.message || "Role selection failed");
    }
  };

  // Sync error from context
  useEffect(() => {
    if (error) {
      setAuthError(error);
    }
  }, [error]);

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
                sx={{ color: "rgba(255,255,255,0.9)", mb: 5, fontWeight: 500, fontSize: "1rem" }}
              >
                Next-Gen Clinical Decision Support
              </Typography>
            </motion.div>

            {authError && (
              <Alert
                severity="error"
                sx={{
                  mb: 2,
                  backgroundColor: "rgba(220, 38, 38, 0.15)",
                  color: "#fca5a5",
                  border: "1px solid rgba(220, 38, 38, 0.3)",
                  "& .MuiAlert-icon": {
                    color: "#fca5a5"
                  }
                }}
                onClose={() => setAuthError("")}
              >
                {authError}
              </Alert>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Collapse in={!showEmailAuth}>
                <Stack spacing={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={!isLoading && <GoogleIcon />}
                    disabled={isLoading}
                    sx={{
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
                      "&:disabled": {
                        background: "linear-gradient(135deg, #e2e8f0, #cbd5e1)",
                        color: theme.palette.primary.light,
                      },
                      transition: "all 0.3s",
                    }}
                    onClick={handleLogin}
                  >
                    {isLoading ? "Signing in..." : "Sign in with Google"}
                  </Button>

                  <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.2)" }}>
                    <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.875rem", fontWeight: 600 }}>
                      OR
                    </Typography>
                  </Divider>

                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    startIcon={<EmailIcon />}
                    sx={{
                      py: 1.8,
                      fontSize: "1.05rem",
                      fontWeight: 700,
                      color: "#ffffff",
                      backgroundColor: "rgba(59, 130, 246, 0.15)",
                      borderColor: "rgba(59, 130, 246, 0.5)",
                      borderWidth: 2,
                      borderRadius: 3,
                      "&:hover": {
                        borderColor: "rgba(59, 130, 246, 0.8)",
                        backgroundColor: "rgba(59, 130, 246, 0.25)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)",
                      },
                      transition: "all 0.3s",
                    }}
                    onClick={() => setShowEmailAuth(true)}
                  >
                    Sign in with Email
                  </Button>
                </Stack>
              </Collapse>

              <Collapse in={showEmailAuth}>
                <EmailPasswordAuth
                  onEmailSignIn={handleEmailSignIn}
                  onEmailSignUp={handleEmailSignUp}
                />
                <Button
                  fullWidth
                  variant="text"
                  onClick={() => setShowEmailAuth(false)}
                  sx={{
                    mt: 2,
                    color: "rgba(255,255,255,0.7)",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.05)",
                    },
                  }}
                >
                  ← Back to other options
                </Button>
              </Collapse>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <Typography
                variant="caption"
                sx={{ display: "block", mt: 4, color: "rgba(255,255,255,0.6)", fontWeight: 500, fontSize: "0.85rem" }}
              >
                Secure hospital access • MedHive © 2026
              </Typography>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Role Selection Dialog */}
      <Dialog
        open={showRoleSelection}
        disableEscapeKeyDown
        PaperProps={{
          sx: {
            borderRadius: 5,
            padding: 3,
            background: "rgba(15, 23, 42, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "white"
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 800, fontSize: '1.5rem' }}>
          Select Your Role
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ textAlign: 'center', mb: 4, color: 'rgba(255,255,255,0.7)' }}>
            To personalize your experience, please choose your role in MedHive.
          </Typography>
          <Stack spacing={2}>
            <Button
              variant="contained"
              startIcon={<MedicalServicesIcon />}
              onClick={() => handleRoleSelection('doctor')}
              sx={{ py: 2, fontSize: '1rem', fontWeight: 700, borderRadius: 3 }}
            >
              I am a Doctor
            </Button>
            <Button
              variant="outlined"
              startIcon={<PersonIcon />}
              onClick={() => handleRoleSelection('patient')}
              sx={{ py: 2, fontSize: '1rem', fontWeight: 700, borderRadius: 3, color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
            >
              I am a Patient
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

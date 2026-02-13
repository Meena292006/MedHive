import { Button, Box, Typography, Card, CardContent, useTheme, Dialog, DialogTitle, DialogContent, Stack, Alert, Divider, Collapse } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import MedicalServicesIcon from "@mui/icons-material/MedicalServicesRounded";
import PersonIcon from "@mui/icons-material/PersonRounded";
import LocalHospitalIcon from "@mui/icons-material/LocalHospitalRounded";
import GoogleIcon from "@mui/icons-material/Google";
import EmailIcon from "@mui/icons-material/EmailRounded";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
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
        background: theme.gradients.main,
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Professional Doctor Silhouette - Left */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{
          position: "absolute",
          left: "6%",
          bottom: "10%",
          zIndex: 1,
          pointerEvents: "none",
          display: window.innerWidth < 1200 ? "none" : "block"
        }}
      >
        <motion.div
          animate={{
            y: [0, -4, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg width="200" height="400" viewBox="0 0 200 400" style={{ opacity: 0.35, filter: 'drop-shadow(0 15px 40px rgba(0,0,0,0.25))' }}>
            {/* Doctor Figure */}
            {/* Head */}
            <circle cx="100" cy="50" r="28" fill={`url(#doctorHead)`} />

            {/* Neck */}
            <rect x="92" y="75" width="16" height="15" rx="3" fill={theme.palette.primary.dark} opacity="0.9" />

            {/* Lab Coat Body */}
            <path
              d="M 65 90 Q 65 88 67 88 L 133 88 Q 135 88 135 90 L 140 200 Q 140 205 135 205 L 65 205 Q 60 205 60 200 Z"
              fill={`url(#doctorCoat)`}
              stroke={theme.palette.primary.dark}
              strokeWidth="1"
            />

            {/* Collar */}
            <path
              d="M 80 88 L 85 78 L 92 88 M 120 88 L 115 78 L 108 88"
              fill="none"
              stroke={theme.palette.background.paper}
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Left Arm with Phone */}
            <motion.g
              animate={{ rotate: [0, -2, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ transformOrigin: '65px 100px' }}
            >
              <ellipse cx="50" cy="140" rx="10" ry="45" fill={theme.palette.background.paper} opacity="0.95" />

              {/* Phone in hand */}
              <rect x="42" y="175" width="18" height="32" rx="3" fill={theme.palette.primary.main} stroke={theme.palette.primary.dark} strokeWidth="1.5" />
              <rect x="44" y="177" width="14" height="24" rx="1" fill={theme.palette.background.paper} opacity="0.3" />
              <motion.circle
                cx="51"
                cy="204"
                r="2"
                fill={theme.palette.background.paper}
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.g>

            {/* Right Arm */}
            <ellipse cx="150" cy="140" rx="10" ry="45" fill={theme.palette.background.paper} opacity="0.95" />

            {/* Stethoscope */}
            <path
              d="M 95 95 Q 90 100 90 110 L 90 125"
              fill="none"
              stroke={theme.palette.secondary.main}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="90" cy="130" r="5" fill={theme.palette.secondary.dark} stroke={theme.palette.secondary.main} strokeWidth="2" />

            {/* Medical Badge */}
            <circle cx="100" cy="130" r="10" fill={theme.palette.error.main} opacity="0.9" />
            <text x="100" y="135" fontSize="14" fill="white" textAnchor="middle" fontWeight="bold">+</text>

            {/* Pants */}
            <rect x="70" y="205" width="28" height="120" rx="5" fill={theme.palette.primary.dark} opacity="0.9" />
            <rect x="102" y="205" width="28" height="120" rx="5" fill={theme.palette.primary.dark} opacity="0.9" />

            {/* Shoes */}
            <ellipse cx="84" cy="335" rx="16" ry="8" fill={theme.palette.grey[900]} />
            <ellipse cx="116" cy="335" rx="16" ry="8" fill={theme.palette.grey[900]} />

            {/* Gradients */}
            <defs>
              <linearGradient id="doctorHead" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={theme.palette.primary.light} />
                <stop offset="100%" stopColor={theme.palette.primary.main} />
              </linearGradient>
              <linearGradient id="doctorCoat" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={theme.palette.background.paper} stopOpacity="0.98" />
                <stop offset="100%" stopColor={theme.palette.grey[100]} stopOpacity="0.95" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      </motion.div>

      {/* Professional Patient Silhouette - Right */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{
          position: "absolute",
          right: "6%",
          bottom: "10%",
          zIndex: 1,
          pointerEvents: "none",
          display: window.innerWidth < 1200 ? "none" : "block"
        }}
      >
        <motion.div
          animate={{
            y: [0, -3, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        >
          <svg width="200" height="400" viewBox="0 0 200 400" style={{ opacity: 0.35, filter: 'drop-shadow(0 15px 40px rgba(0,0,0,0.25))' }}>
            {/* Patient Figure */}
            {/* Head */}
            <circle cx="100" cy="50" r="26" fill={`url(#patientHead)`} />

            {/* Hair */}
            <path
              d="M 74 35 Q 74 20 100 20 Q 126 20 126 35"
              fill={theme.palette.grey[800]}
              opacity="0.9"
            />

            {/* Neck */}
            <rect x="92" y="73" width="16" height="12" rx="3" fill={theme.palette.secondary.dark} opacity="0.8" />

            {/* Casual Shirt */}
            <path
              d="M 68 85 Q 68 83 70 83 L 130 83 Q 132 83 132 85 L 135 195 Q 135 200 130 200 L 70 200 Q 65 200 65 195 Z"
              fill={`url(#patientShirt)`}
              stroke={theme.palette.secondary.dark}
              strokeWidth="1"
            />

            {/* Collar */}
            <polygon
              points="85,83 92,75 100,83"
              fill={theme.palette.secondary.dark}
              opacity="0.9"
            />
            <polygon
              points="115,83 108,75 100,83"
              fill={theme.palette.secondary.dark}
              opacity="0.9"
            />

            {/* Left Arm */}
            <ellipse cx="55" cy="135" rx="9" ry="42" fill={theme.palette.secondary.main} opacity="0.9" />

            {/* Right Arm with Phone */}
            <motion.g
              animate={{ rotate: [0, 2, 0] }}
              transition={{ duration: 3.5, repeat: Infinity }}
              style={{ transformOrigin: '145px 100px' }}
            >
              <ellipse cx="145" cy="135" rx="9" ry="42" fill={theme.palette.secondary.main} opacity="0.9" />

              {/* Phone in hand */}
              <rect x="140" y="168" width="18" height="32" rx="3" fill={theme.palette.secondary.dark} stroke={theme.palette.grey[900]} strokeWidth="1.5" />
              <rect x="142" y="170" width="14" height="24" rx="1" fill={theme.palette.background.paper} opacity="0.4" />
              <motion.rect
                x="145"
                y="173"
                width="8"
                height="8"
                rx="1"
                fill={theme.palette.primary.main}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
              <circle cx="149" cy="197" r="2" fill={theme.palette.background.paper} opacity="0.5" />
            </motion.g>

            {/* Heart Monitor Icon */}
            <motion.g
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              style={{ transformOrigin: '100px 125px' }}
            >
              <circle cx="100" cy="125" r="9" fill={theme.palette.error.main} opacity="0.85" />
              <path
                d="M 96 125 L 98 122 L 100 128 L 102 120 L 104 125"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.g>

            {/* Jeans */}
            <rect x="73" y="200" width="26" height="125" rx="5" fill={theme.palette.secondary.dark} opacity="0.95" />
            <rect x="101" y="200" width="26" height="125" rx="5" fill={theme.palette.secondary.dark} opacity="0.95" />

            {/* Seam lines */}
            <line x1="86" y1="200" x2="86" y2="325" stroke={theme.palette.grey[900]} strokeWidth="1" opacity="0.3" />
            <line x1="114" y1="200" x2="114" y2="325" stroke={theme.palette.grey[900]} strokeWidth="1" opacity="0.3" />

            {/* Shoes */}
            <ellipse cx="86" cy="335" rx="15" ry="7" fill={theme.palette.grey[800]} />
            <ellipse cx="114" cy="335" rx="15" ry="7" fill={theme.palette.grey[800]} />

            {/* Gradients */}
            <defs>
              <linearGradient id="patientHead" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={theme.palette.secondary.light} />
                <stop offset="100%" stopColor={theme.palette.secondary.main} />
              </linearGradient>
              <linearGradient id="patientShirt" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={theme.palette.secondary.light} stopOpacity="0.9" />
                <stop offset="100%" stopColor={theme.palette.secondary.main} stopOpacity="0.85" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      </motion.div>

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
            background: theme.palette.background.paper,
            boxShadow: `0 25px 50px ${theme.palette.common.black}40, 0 0 0 1px ${theme.palette.divider}`,
            border: `1px solid ${theme.palette.divider}`,
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
                background: theme.gradients.linear,
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
                  background: `linear-gradient(135deg, ${theme.palette.text.primary}, ${theme.palette.secondary.light})`,
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
                Next-Gen Hospital Care
              </Typography>
            </motion.div>

            {authError && (
              <Alert
                severity="error"
                sx={{
                  mb: 2,
                  backgroundColor: theme.palette.error.light,
                  color: theme.palette.text.primary,
                  border: `1px solid ${theme.palette.error.main}30`,
                  "& .MuiAlert-icon": {
                    color: theme.palette.error.main
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
                      background: theme.palette.text.primary,
                      color: theme.palette.primary.dark,
                      borderRadius: 3,
                      boxShadow: `0 10px 30px ${theme.palette.text.primary}30`,
                      "&:hover": {
                        background: theme.palette.text.primary,
                        transform: "translateY(-2px)",
                        boxShadow: `0 15px 40px ${theme.palette.text.primary}40`,
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
                      color: theme.palette.text.primary,
                      backgroundColor: theme.palette.primary.light,
                      borderColor: theme.palette.primary.main,
                      borderWidth: 2,
                      borderRadius: 3,
                      "&:hover": {
                        borderColor: theme.palette.secondary.main,
                        backgroundColor: theme.palette.secondary.light,
                        transform: "translateY(-2px)",
                        boxShadow: `0 10px 25px ${theme.palette.primary.main}30`,
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

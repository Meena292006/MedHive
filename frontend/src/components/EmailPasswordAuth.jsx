import React, { useState } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    Alert,
    InputAdornment,
    IconButton,
    Divider,
    Stack,
    ToggleButton,
    ToggleButtonGroup
} from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material";
import { motion } from "framer-motion";

export default function EmailPasswordAuth({ onEmailSignIn, onEmailSignUp }) {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [role, setRole] = useState("patient");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        if (!email || !password) {
            setError("Email and password are required");
            return false;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setError("Please enter a valid email address");
            return false;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return false;
        }

        if (isSignUp) {
            if (!name) {
                setError("Name is required for sign up");
                return false;
            }
            if (password !== confirmPassword) {
                setError("Passwords do not match");
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!validateForm()) return;

        setLoading(true);
        try {
            if (isSignUp) {
                await onEmailSignUp(email, password, name, role);
            } else {
                await onEmailSignIn(email, password);
            }
        } catch (err) {
            setError(err.message || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsSignUp(!isSignUp);
        setError("");
        setPassword("");
        setConfirmPassword("");
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Typography
                variant="h6"
                sx={{ color: "#ffffff", mb: 3, fontWeight: 700, textAlign: "center", fontSize: "1.25rem" }}
            >
                {isSignUp ? "Create Account" : "Sign In with Email"}
            </Typography>

            {error && (
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
                >
                    {error}
                </Alert>
            )}

            <Stack spacing={2.5}>
                {isSignUp && (
                    <>
                        <Box sx={{ mb: 1 }}>
                            <Typography sx={{ color: "rgba(255,255,255,0.7)", mb: 1, fontWeight: 600, fontSize: "0.85rem", textAlign: "left" }}>
                                SELECT ROLE
                            </Typography>
                            <ToggleButtonGroup
                                fullWidth
                                value={role}
                                exclusive
                                onChange={(e, newRole) => newRole && setRole(newRole)}
                                sx={{
                                    backgroundColor: "rgba(255,255,255,0.05)",
                                    "& .MuiToggleButton-root": {
                                        color: "rgba(255,255,255,0.6)",
                                        borderColor: "rgba(255,255,255,0.2)",
                                        py: 1.5,
                                        fontWeight: 700,
                                        "&.Mui-selected": {
                                            color: "#ffffff",
                                            backgroundColor: "rgba(59, 130, 246, 0.4)",
                                            borderColor: "#3b82f6",
                                            "&:hover": {
                                                backgroundColor: "rgba(59, 130, 246, 0.5)",
                                            }
                                        },
                                        "&:hover": {
                                            backgroundColor: "rgba(255,255,255,0.1)",
                                        }
                                    }
                                }}
                            >
                                <ToggleButton value="doctor">DOCTOR</ToggleButton>
                                <ToggleButton value="patient">PATIENT</ToggleButton>
                            </ToggleButtonGroup>
                        </Box>
                        <TextField
                            fullWidth
                            label="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            variant="outlined"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    color: "#000000",
                                    backgroundColor: "rgba(255,255,255,0.95)",
                                    "& fieldset": { borderColor: "rgba(59, 130, 246, 0.5)", borderWidth: 2 },
                                    "&:hover fieldset": { borderColor: "rgba(59, 130, 246, 0.8)" },
                                    "&.Mui-focused fieldset": { borderColor: "#3b82f6", borderWidth: 2 },
                                },
                                "& .MuiInputLabel-root": {
                                    color: "rgba(0, 0, 0, 0.7)",
                                    fontWeight: 500,
                                },
                                "& .MuiInputLabel-root.Mui-focused": {
                                    color: "#3b82f6",
                                    fontWeight: 600,
                                },
                            }}
                        />
                    </>
                )}

                <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    variant="outlined"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Email sx={{ color: "rgba(59, 130, 246, 0.7)" }} />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            color: "#000000",
                            backgroundColor: "rgba(255,255,255,0.95)",
                            "& fieldset": { borderColor: "rgba(59, 130, 246, 0.5)", borderWidth: 2 },
                            "&:hover fieldset": { borderColor: "rgba(59, 130, 246, 0.8)" },
                            "&.Mui-focused fieldset": { borderColor: "#3b82f6", borderWidth: 2 },
                        },
                        "& .MuiInputLabel-root": {
                            color: "rgba(0, 0, 0, 0.7)",
                            fontWeight: 500,
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                            color: "#3b82f6",
                            fontWeight: 600,
                        },
                    }}
                />

                <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    variant="outlined"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Lock sx={{ color: "rgba(59, 130, 246, 0.7)" }} />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                    sx={{ color: "rgba(59, 130, 246, 0.7)" }}
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            color: "#000000",
                            backgroundColor: "rgba(255,255,255,0.95)",
                            "& fieldset": { borderColor: "rgba(59, 130, 246, 0.5)", borderWidth: 2 },
                            "&:hover fieldset": { borderColor: "rgba(59, 130, 246, 0.8)" },
                            "&.Mui-focused fieldset": { borderColor: "#3b82f6", borderWidth: 2 },
                        },
                        "& .MuiInputLabel-root": {
                            color: "rgba(0, 0, 0, 0.7)",
                            fontWeight: 500,
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                            color: "#3b82f6",
                            fontWeight: 600,
                        },
                    }}
                />

                {isSignUp && (
                    <TextField
                        fullWidth
                        label="Confirm Password"
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock sx={{ color: "rgba(59, 130, 246, 0.7)" }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                color: "#000000",
                                backgroundColor: "rgba(255,255,255,0.95)",
                                "& fieldset": { borderColor: "rgba(59, 130, 246, 0.5)", borderWidth: 2 },
                                "&:hover fieldset": { borderColor: "rgba(59, 130, 246, 0.8)" },
                                "&.Mui-focused fieldset": { borderColor: "#3b82f6", borderWidth: 2 },
                            },
                            "& .MuiInputLabel-root": {
                                color: "rgba(0, 0, 0, 0.7)",
                                fontWeight: 500,
                            },
                            "& .MuiInputLabel-root.Mui-focused": {
                                color: "#3b82f6",
                                fontWeight: 600,
                            },
                        }}
                    />
                )}

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    sx={{
                        py: 1.8,
                        fontSize: "1.05rem",
                        fontWeight: 700,
                        borderRadius: 3,
                        textTransform: "none",
                        background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                        boxShadow: "0 8px 24px rgba(59, 130, 246, 0.4)",
                        "&:hover": {
                            background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                            boxShadow: "0 12px 32px rgba(59, 130, 246, 0.5)",
                            transform: "translateY(-2px)",
                        },
                        transition: "all 0.3s",
                    }}
                >
                    {loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
                </Button>

                <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.2)" }} />

                <Button
                    fullWidth
                    variant="text"
                    onClick={toggleMode}
                    sx={{
                        color: "#ffffff",
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        textTransform: "none",
                        py: 1.2,
                        "&:hover": {
                            backgroundColor: "rgba(255,255,255,0.1)",
                        },
                    }}
                >
                    {isSignUp
                        ? "Already have an account? Sign In"
                        : "Don't have an account? Sign Up"}
                </Button>
            </Stack>
        </Box>
    );
}

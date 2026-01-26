import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: "#00D4FF", // Bright Cyan Blue
            light: "#67E8F9",
            dark: "#0891B2",
            contrastText: "#0F172A",
        },
        secondary: {
            main: "#3B82F6", // Medium Blue
            light: "#60A5FA",
            dark: "#2563EB",
            contrastText: "#F8FAFC",
        },
        background: {
            default: "#0F172A", // Deep Navy Midnight Blue
            paper: "rgba(15, 23, 42, 0.95)", // Dark Blue Glassmorphism
        },
        text: {
            primary: "#E2E8F0", // Soft Light Blue (not white)
            secondary: "#94A3B8", // Muted Sky Blue
        },
        success: {
            main: "#06B6D4", // Cyan Blue
            light: "#22D3EE",
            dark: "#0891B2",
        },
        fontFamily: "'Inter', 'Roboto', sans-serif",
        h1: {
            fontWeight: 700,
            fontSize: '2.5rem',
            letterSpacing: '-0.02em',
            color: "#F1F5F9",
        },
        h2: {
            fontWeight: 600,
            fontSize: '2rem',
            letterSpacing: '-0.01em',
            color: "#F1F5F9",
        },
        h3: {
            fontWeight: 600,
            fontSize: '1.75rem',
            letterSpacing: '-0.01em',
            color: "#F1F5F9",
        },
        h4: {
            fontWeight: 600,
            fontSize: '1.5rem',
            letterSpacing: '-0.005em',
            color: "#F1F5F9",
        },
        h5: {
            fontWeight: 600,
            fontSize: '1.25rem',
            color: "#F1F5F9",
        },
        h6: {
            fontWeight: 600,
            fontSize: '1.125rem',
            color: "#F1F5F9",
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.6,
            color: "#94A3B8",
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.5,
            color: "#94A3B8",
        },
        button: {
            textTransform: "none",
            fontWeight: 600,
            fontSize: '0.875rem',
        },
    },
    shape: {
        borderRadius: 16,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                    backgroundAttachment: 'fixed',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: "12px",
                    padding: "12px 24px",
                    fontWeight: 600,
                    textTransform: "none",
                    boxShadow: "0 4px 14px 0 rgba(0, 212, 255, 0.2)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                        boxShadow: "0 6px 20px rgba(0, 212, 255, 0.4)",
                        transform: "translateY(-2px)",
                        background: "linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)",
                    },
                    "&:active": {
                        transform: "translateY(0px)",
                    },
                },
                contained: {
                    background: "linear-gradient(135deg, #00D4FF 0%, #6366F1 100%)",
                    "&:hover": {
                        background: "linear-gradient(135deg, #33E0FF 0%, #818CF8 100%)",
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: "20px",
                    backdropFilter: "blur(20px)",
                    background: "rgba(30, 41, 59, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                        boxShadow: "0 12px 40px rgba(0, 212, 255, 0.2)",
                        transform: "translateY(-4px)",
                        border: "1px solid rgba(0, 212, 255, 0.3)",
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: "none",
                    backdropFilter: "blur(20px)",
                    background: "rgba(30, 41, 59, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        background: "rgba(30, 41, 59, 0.6)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "& fieldset": {
                            border: "none",
                        },
                        "&:hover": {
                            background: "rgba(30, 41, 59, 0.8)",
                            border: "1px solid rgba(0, 212, 255, 0.3)",
                            boxShadow: "0 4px 12px rgba(0, 212, 255, 0.1)",
                        },
                        "&.Mui-focused": {
                            background: "rgba(30, 41, 59, 0.9)",
                            border: "1px solid #00D4FF",
                            boxShadow: "0 0 0 3px rgba(0, 212, 255, 0.2)",
                        },
                        "& input": {
                            color: "#F1F5F9",
                        },
                    },
                    "& .MuiInputLabel-root": {
                        color: "#94A3B8",
                        "&.Mui-focused": {
                            color: "#00D4FF",
                        },
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    backdropFilter: "blur(10px)",
                    background: "rgba(99, 102, 241, 0.2)",
                    border: "1px solid rgba(99, 102, 241, 0.3)",
                    color: "#818CF8",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                        background: "rgba(99, 102, 241, 0.3)",
                        transform: "scale(1.05)",
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backdropFilter: "blur(20px)",
                    background: "rgba(15, 23, 42, 0.9)",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    background: "rgba(15, 23, 42, 0.95)",
                    backdropFilter: "blur(20px)",
                    borderRight: "1px solid rgba(255, 255, 255, 0.1)",
                },
            },
        },
    },
});

export default theme;

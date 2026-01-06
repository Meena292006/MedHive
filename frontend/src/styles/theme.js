import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    typography: {
        fontFamily: "'Inter', sans-serif",
        h4: {
            fontWeight: 700,
            letterSpacing: "-0.5px",
            color: "#1B2559",
        },
        h5: {
            fontWeight: 700,
            color: "#1B2559",
        },
        h6: {
            fontWeight: 600,
            color: "#1B2559",
        },
        body1: {
            color: "#4A5568",
        },
        button: {
            textTransform: "none", // Modern feel (no all-caps)
            fontWeight: 600,
        },
    },
    palette: {
        primary: {
            main: "#4318FF", // Modern Deep Blue/Purple
            light: "#6e62fc",
            dark: "#2a0d9e",
            contrastText: "#ffffff",
        },
        secondary: {
            main: "#6AD2FF", // Cyan/Sky
            light: "#9de2ff",
            dark: "#00a0d6",
            contrastText: "#1B2559",
        },
        background: {
            default: "#F4F7FE",
            paper: "#FFFFFF",
        },
        text: {
            primary: "#1B2559",
            secondary: "#A3AED0",
        },
        success: {
            main: "#05CD99",
        },
        warning: {
            main: "#FFB547",
        },
        error: {
            main: "#EE5D50",
        },
        info: {
            main: "#11CDEF",
        },
    },
    shape: {
        borderRadius: 16, // Softer corners
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: "12px", // Consistent rounded buttons
                    padding: "10px 24px",
                    boxShadow: "none",
                    "&:hover": {
                        boxShadow: "0px 8px 20px rgba(67, 24, 255, 0.2)", // Subtle glow on hover
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: "20px",
                    boxShadow: "0px 20px 40px rgba(112, 144, 176, 0.12)", // Soft premium shadow
                    border: "none",
                },
            },
        },
        MuiPaper: {
            defaultProps: {
                elevation: 0,
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        backgroundColor: "#F4F7FE",
                        "& fieldset": {
                            borderColor: "transparent",
                        },
                        "&:hover fieldset": {
                            borderColor: "#4318FF",
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "#4318FF",
                        },
                    },
                },
            },
        },
    },
});

export default theme;

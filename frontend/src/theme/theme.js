import { createTheme } from "@mui/material/styles";
import { colors, radii, blur, gradients } from "./tokens";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: colors.primary,
      light: colors.primaryLight,
      dark: colors.primaryDark,
    },
    secondary: {
      main: colors.secondary,
      light: colors.secondaryLight,
    },
    success: {
      main: colors.success,
      light: colors.successLight,
    },
    warning: {
      main: colors.warning,
      light: colors.warningLight,
    },
    error: {
      main: colors.danger,
      light: colors.dangerLight,
    },
    info: {
      main: colors.secondary,
      light: colors.secondaryLight,
    },
    grey: {
      50: "#F8FAFC",
      100: "#F1F5F9",
      200: "#E2E8F0",
      300: "#CBD5E1",
      400: "#94A3B8",
      500: "#64748B",
      600: "#475569",
      700: "#334155",
      800: "#1E293B",
      900: "#0F172A",
    },
    background: {
      default: colors.bgMain,
      paper: colors.bgGlass,
    },
    text: {
      primary: "#FFFFFF",
      secondary: "rgba(255, 255, 255, 0.9)",
    },
  },

  // Custom property for shared gradients
  gradients: gradients,

  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif",

    h1: { fontWeight: 800, fontSize: "2.4rem", letterSpacing: "-0.02em" },
    h2: { fontWeight: 700, fontSize: "2rem" },
    h3: { fontWeight: 700, fontSize: "1.7rem" },
    h4: { fontWeight: 600, fontSize: "1.4rem" },
    h5: { fontWeight: 600, fontSize: "1.2rem" },
    h6: { fontWeight: 600, fontSize: "1.05rem" },

    body1: { fontSize: "0.95rem", lineHeight: 1.7 },
    body2: { fontSize: "0.85rem", lineHeight: 1.6 },

    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },

  shape: {
    borderRadius: radii.md,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: gradients.main,
          backgroundAttachment: "fixed",
          color: colors.textPrimary,
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          background: colors.bgCard,
          backdropFilter: blur.glass,
          borderRadius: radii.lg,
          border: `1px solid ${colors.border}`,
          boxShadow: `0 8px 32px ${colors.shadow}`,
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: radii.sm,
          padding: "10px 22px",
          transition: "all 0.25s ease",
        },
        contained: {
          background: gradients.linear,
          boxShadow: `0 6px 20px rgba(59, 130, 246, 0.3)`,
          "&:hover": {
            boxShadow: `0 10px 30px rgba(59, 130, 246, 0.5)`,
            transform: "translateY(-2px)",
          },
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(10px)",
            borderRadius: radii.sm,
            border: `1px solid ${colors.border}`,
            "& fieldset": { border: "none" },
          },
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          background: colors.bgGlass,
          backdropFilter: blur.glass,
          borderBottom: `1px solid ${colors.border}`,
          boxShadow: "none",
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: colors.bgGlass,
          backdropFilter: blur.glass,
          borderRight: `1px solid ${colors.border}`,
        },
      },
    },
  },
});

export default theme;

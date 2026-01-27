import { createTheme } from "@mui/material/styles";
import { colors, radii, blur } from "./tokens";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: colors.primary },
    secondary: { main: colors.secondary },
    success: { main: colors.success },
    warning: { main: colors.warning },
    error: { main: colors.danger },
    background: {
      default: colors.bgMain,
      paper: colors.bgGlass,
    },
    text: {
      primary: colors.textPrimary,
      secondary: colors.textSecondary,
    },
  },

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
          background:
            "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
          backgroundAttachment: "fixed",
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          background: colors.bgCard,
          backdropFilter: blur.glass,
          borderRadius: radii.lg,
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
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
          background:
            "linear-gradient(135deg, #00D4FF 0%, #3B82F6 100%)",
          boxShadow: "0 6px 18px rgba(0,212,255,0.25)",
          "&:hover": {
            boxShadow: "0 10px 30px rgba(0,212,255,0.45)",
            transform: "translateY(-2px)",
          },
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            background: "rgba(30,41,59,0.6)",
            backdropFilter: "blur(10px)",
            borderRadius: radii.sm,
            border: "1px solid rgba(255,255,255,0.08)",
            "& fieldset": { border: "none" },
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: radii.sm,
          fontWeight: 600,
          backdropFilter: "blur(8px)",
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          background: colors.bgGlass,
          backdropFilter: blur.glass,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: colors.bgGlass,
          backdropFilter: blur.glass,
          borderRight: "1px solid rgba(255,255,255,0.08)",
        },
      },
    },
  },
});

export default theme;

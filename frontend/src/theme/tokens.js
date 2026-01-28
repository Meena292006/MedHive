export const colors = {
  primary: "#5AC5C8",       // Teal (Accent)
  primaryLight: "rgba(90, 197, 200, 0.15)",
  primaryDark: "#008E90",

  secondary: "#5AC5C8",     // Consistent Teal
  secondaryLight: "rgba(90, 197, 200, 0.2)",

  success: "#10B981",
  successLight: "rgba(16, 185, 129, 0.1)",

  warning: "#F59E0B",
  warningLight: "rgba(245, 158, 11, 0.1)",

  danger: "#EF4444",
  dangerLight: "rgba(239, 68, 68, 0.1)",

  bgMain: "#04353D",        // Dark Teal (Background)
  bgDark: "#021D21",
  bgGlass: "rgba(4, 53, 61, 0.7)",
  bgCard: "rgba(4, 53, 61, 0.85)",

  border: "rgba(90, 197, 200, 0.15)",
  borderLight: "rgba(90, 197, 200, 0.08)",

  textPrimary: "#FFFFFF",   // Pure White
  textSecondary: "rgba(255, 255, 255, 0.85)",
  accent: "#5AC5C8",

  shadow: "rgba(0, 0, 0, 0.5)",
  overlay: "rgba(0, 0, 0, 0.6)",
};

export const gradients = {
  main: `linear-gradient(135deg, ${colors.bgMain} 0%, #064E57 100%)`,
  linear: `linear-gradient(135deg, ${colors.primary} 0%, #008E90 100%)`,
  glass: `linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))`,
  danger: `linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)`,
};


export const radii = {
  sm: 0,
  md: 0,
  lg: 0,
};

export const blur = {
  glass: "blur(20px)",
};

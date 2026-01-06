import {
    Drawer, List, ListItem, ListItemButton,
    ListItemIcon, ListItemText, Typography, Box, Button, useTheme
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/DashboardRounded"; // Using Rounded icons for modern look
import PsychologyIcon from "@mui/icons-material/PsychologyRounded";
import PeopleIcon from "@mui/icons-material/PeopleRounded";
import NotificationsIcon from "@mui/icons-material/NotificationsRounded";
import PersonIcon from "@mui/icons-material/PersonRounded";
import LogoutIcon from "@mui/icons-material/LogoutRounded";
import { useNavigate, useLocation } from "react-router-dom";

const DRAWER_WIDTH = 280; // Slightly wider for better breathing room

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();

    const menuItems = [
        { text: "Dashboard", icon: <DashboardIcon />, path: "/doctor" },
        { text: "AI Query", icon: <PsychologyIcon />, path: "/ai-query" },
        { text: "Patient List", icon: <PeopleIcon />, path: "/patients" },
        { text: "Alerts", icon: <NotificationsIcon />, path: "/alerts" },
        { text: "Patient Portal", icon: <PersonIcon />, path: "/patient" },
    ];

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: DRAWER_WIDTH,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: DRAWER_WIDTH,
                    boxSizing: "border-box",
                    backgroundColor: theme.palette.background.paper, // White/Paper
                    color: theme.palette.text.secondary,
                    borderRight: "none",
                    boxShadow: "4px 0px 30px rgba(0,0,0,0.02)", // Very subtle separation
                },
            }}
        >
            <Box sx={{ p: 4, display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "12px",
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: "20px"
                    }}
                >
                    M
                </Box>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: theme.palette.text.primary, lineHeight: 1.2 }}>
                        MedHive
                    </Typography>
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}>
                        Healthcare AI
                    </Typography>
                </Box>
            </Box>

            <List sx={{ px: 3 }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <ListItem key={item.text} disablePadding sx={{ mb: 1.5 }}>
                            <ListItemButton
                                onClick={() => navigate(item.path)}
                                sx={{
                                    borderRadius: "14px",
                                    padding: "12px 16px",
                                    backgroundColor: isActive ? theme.palette.primary.main : "transparent",
                                    boxShadow: isActive ? "0px 10px 20px -5px rgba(67, 24, 255, 0.4)" : "none", // Glow effect for active
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        backgroundColor: isActive ? theme.palette.primary.main : theme.palette.background.default,
                                        transform: "translateX(5px)",
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: isActive ? "#fff" : theme.palette.text.secondary,
                                        minWidth: 40
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        fontSize: "0.95rem",
                                        fontWeight: isActive ? 700 : 500,
                                        color: isActive ? "#fff" : theme.palette.text.secondary
                                    }}
                                />
                                {isActive && (
                                    <Box
                                        sx={{
                                            width: 4,
                                            height: 4,
                                            borderRadius: "50%",
                                            bgcolor: "#fff",
                                            ml: 1
                                        }}
                                    />
                                )}
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ p: 3 }}>
                <Box
                    sx={{
                        p: 2.5,
                        borderRadius: "20px",
                        background: `linear-gradient(135deg, #4318FF 0%, #868CFF 100%)`,
                        color: "white",
                        mb: 2,
                        position: "relative",
                        overflow: "hidden"
                    }}
                >
                    <Typography variant="subtitle2" fontWeight="bold">Need Help?</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8, fontSize: "0.8rem", mb: 1 }}>Check our docs</Typography>
                    <Box
                        sx={{
                            position: "absolute",
                            top: -20,
                            right: -20,
                            width: 80,
                            height: 80,
                            borderRadius: "50%",
                            bgcolor: "rgba(255,255,255,0.2)"
                        }}
                    />
                </Box>
                <Button
                    fullWidth
                    startIcon={<LogoutIcon />}
                    onClick={handleLogout}
                    sx={{
                        color: theme.palette.error.main,
                        justifyContent: "flex-start",
                        "&:hover": { bgcolor: "rgba(238, 93, 80, 0.1)" }
                    }}
                >
                    Logout
                </Button>
            </Box>
        </Drawer>
    );
}

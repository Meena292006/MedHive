import {
    Drawer, List, ListItem, ListItemButton,
    ListItemIcon, ListItemText, Typography, Box, Button
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PsychologyIcon from "@mui/icons-material/Psychology";
import PeopleIcon from "@mui/icons-material/People";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate, useLocation } from "react-router-dom";

const DRAWER_WIDTH = 260;

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { text: "Dashboard", icon: <DashboardIcon />, path: "/doctor" },
        { text: "AI Query", icon: <PsychologyIcon />, path: "/ai-query" },
        { text: "Patients", icon: <PeopleIcon />, path: "/patients" },
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
                    backgroundColor: "#0f172a", // Dark Slate
                    color: "#f8fafc",
                },
            }}
        >
            <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", color: "#38bdf8" }}>
                    MedHive
                </Typography>
                <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                    Healthcare Analytics
                </Typography>
            </Box>

            <List sx={{ px: 2 }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                onClick={() => navigate(item.path)}
                                sx={{
                                    borderRadius: 2,
                                    backgroundColor: isActive ? "#38bdf8" : "transparent",
                                    "&:hover": {
                                        backgroundColor: isActive ? "#0ea5e9" : "#1e293b",
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ color: isActive ? "#fff" : "#94a3b8", minWidth: 40 }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        fontSize: "0.95rem",
                                        fontWeight: isActive ? 600 : 400,
                                        color: isActive ? "#fff" : "#cbd5e1"
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ p: 2 }}>
                <Button
                    fullWidth
                    startIcon={<LogoutIcon />}
                    onClick={handleLogout}
                    sx={{
                        color: "#94a3b8",
                        justifyContent: "flex-start",
                        "&:hover": { color: "#ef4444", backgroundColor: "rgba(239, 68, 68, 0.1)" }
                    }}
                >
                    Logout
                </Button>
            </Box>
        </Drawer>
    );
}

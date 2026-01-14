import {
  Drawer, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Button, Box
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PsychologyIcon from "@mui/icons-material/Psychology";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

const DRAWER_WIDTH = 260;

export default function PatientSidebar() {
  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          backgroundColor: "#020617",
          color: "#f8fafc",
        },
      }}
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/patient")}>
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary="My Dashboard" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/patient/diagnosis")}>
            <ListItemIcon><PsychologyIcon /></ListItemIcon>
            <ListItemText primary="AI Diagnosis" />
          </ListItemButton>
        </ListItem>
      </List>

      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          startIcon={<LogoutIcon />}
          onClick={logout}
          sx={{ color: "#ef4444" }}
        >
          Logout
        </Button>
      </Box>
    </Drawer>
  );
}

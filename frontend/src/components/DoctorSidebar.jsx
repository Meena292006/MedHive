import {
  Drawer, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Button, Box
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

const DRAWER_WIDTH = 260;

export default function DoctorSidebar() {
  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          backgroundColor: "#0f172a",
          color: "#f8fafc",
        },
      }}
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/doctor")}>
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Doctor Dashboard" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/doctor/patients")}>
            <ListItemIcon><PeopleIcon /></ListItemIcon>
            <ListItemText primary="Patients" />
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

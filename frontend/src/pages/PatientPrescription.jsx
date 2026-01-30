import { useEffect, useState } from "react";
import { api } from "../api/api";
import DashboardLayout from "../components/DashboardLayout";
import { Box, Typography, Paper } from "@mui/material";

export default function PatientPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    api.get("/prescriptions/my")
      .then(res => setPrescriptions(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <DashboardLayout>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>
        My Prescriptions
      </Typography>

      <Box sx={{ maxWidth: 700 }}>
        {prescriptions.map(p => (
          <Paper
            key={p.id}
            sx={{ p: 2, mb: 2, borderRadius: 3, bgcolor: "#74e3ed" }}
          >
            <Typography>{p.message}</Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(p.created_at).toLocaleString()}
            </Typography>
          </Paper>
        ))}

        {prescriptions.length === 0 && (
          <Typography color="text.secondary">
            No prescriptions yet
          </Typography>
        )}
      </Box>
    </DashboardLayout>
  );
}

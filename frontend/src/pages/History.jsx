import { useState, useEffect } from "react";
import { api } from "../api/api";
import DashboardLayout from "../components/DashboardLayout";
import {
  Card, CardContent, Typography, Box, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Chip,
  Skeleton, useTheme
} from "@mui/material";
import HistoryIcon from "@mui/icons-material/HistoryRounded";

export default function History() {
  const theme = useTheme();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/cases/my-reports")
      .then(res => {
        if (Array.isArray(res.data)) setHistory(res.data);
      })
      .catch(() => {
        setHistory([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4, mt: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <HistoryIcon sx={{ fontSize: 40, color: theme.palette.secondary.main }} />
        <Typography variant="h4" fontWeight={800} sx={{
          background: `linear-gradient(135deg, ${theme.palette.text.primary}, ${theme.palette.secondary.main})`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Prediction History
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Patient</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Symptoms</TableCell>
                  <TableCell>Top Result</TableCell>
                  <TableCell>Risk</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {loading &&
                  [...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}

                {!loading && history.map((row, i) => {
                  let parsedPredictions = [];
                  let s = [];
                  try {
                    parsedPredictions = typeof row.predictions === 'string'
                      ? JSON.parse(row.predictions)
                      : row.predictions || [];
                    s = typeof row.symptoms === 'string' ? JSON.parse(row.symptoms) : row.symptoms || [];
                  } catch (e) {
                    console.error("Failed to parse data", e);
                  }

                  const resultLabel = (Array.isArray(parsedPredictions) && parsedPredictions[0])
                    ? (parsedPredictions[0].label || parsedPredictions[0].disease || "Completed")
                    : "Review Analysis";

                  return (
                    <TableRow key={i}>
                      <TableCell sx={{ fontSize: '0.8rem' }}>{new Date(row.created_at).toLocaleString()}</TableCell>
                      <TableCell fontWeight={700}>{row.patient_name || "Anonymous"}</TableCell>
                      <TableCell>{row.phone || "N/A"}</TableCell>
                      <TableCell>
                        <Chip label={row.type || "SYMPTOMS"} size="small" variant="outlined" sx={{ fontWeight: 700, fontSize: '0.65rem' }} />
                      </TableCell>
                      <TableCell sx={{ maxWidth: 200, fontSize: '0.75rem', color: 'text.secondary' }}>
                        {s.join(", ") || "None"}
                      </TableCell>
                      <TableCell fontWeight={800} color="primary.main">{resultLabel}</TableCell>
                      <TableCell>
                        <Chip
                          label={row.priority}
                          color={row.priority === "HIGH" ? "error" : "success"}
                          size="small"
                          sx={{ fontWeight: "bold", borderRadius: 1 }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}

                {!loading && history.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography color="text.secondary" sx={{ py: 4 }}>
                        No prediction history available yet
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}

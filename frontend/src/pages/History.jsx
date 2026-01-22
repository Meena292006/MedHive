import { useState, useEffect } from "react";
import { api } from "../api/api";
import DashboardLayout from "../components/DashboardLayout";
import {
  Card, CardContent, Typography, Box, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Chip,
  Skeleton
} from "@mui/material";
import HistoryIcon from "@mui/icons-material/HistoryRounded";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/cases")
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
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <HistoryIcon sx={{ fontSize: 40, color: "text.secondary" }} />
        <Typography variant="h4" fontWeight={800}>
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
                  <TableCell>Prediction Type</TableCell>
                  <TableCell>Result</TableCell>
                  <TableCell>Confidence</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {loading &&
                  [...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 5 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}

                {!loading && history.map((row, i) => {
                  let parsedPredictions = [];
                  try {
                    parsedPredictions = typeof row.predictions === 'string'
                      ? JSON.parse(row.predictions)
                      : row.predictions || [];
                  } catch (e) {
                    console.error("Failed to parse predictions", e);
                  }

                  const resultLabel = (Array.isArray(parsedPredictions) && parsedPredictions[0])
                    ? (parsedPredictions[0].label || parsedPredictions[0].disease || "Completed")
                    : "Review Analysis";

                  return (
                    <TableRow key={i}>
                      <TableCell>{new Date(row.created_at).toLocaleString()}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={700}>
                          {row.type || "SYMPTOMS"} Analysis
                        </Typography>
                      </TableCell>
                      <TableCell>{resultLabel}</TableCell>
                      <TableCell>{row.risk_score}%</TableCell>
                      <TableCell>
                        <Chip
                          label={row.priority}
                          color={row.priority === "HIGH" ? "error" : "success"}
                          size="small"
                          sx={{ fontWeight: "bold" }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}

                {!loading && history.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
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

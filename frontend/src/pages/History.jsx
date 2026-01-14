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
    api.get("/history")
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

                {!loading && history.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.result}</TableCell>
                    <TableCell>{row.probability}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        color={row.status === "High" ? "error" : "success"}
                        size="small"
                        sx={{ fontWeight: "bold" }}
                      />
                    </TableCell>
                  </TableRow>
                ))}

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

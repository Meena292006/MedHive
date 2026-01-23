import { useState, useEffect } from "react";
import { api } from "../api/api";
import DashboardLayout from "../components/DashboardLayout";
import {
  Typography, Box, Grid, TextField, InputAdornment,
  ToggleButtonGroup, ToggleButton, Container, useTheme,
  CircularProgress, Alert
} from "@mui/material";
import SearchIcon from "@mui/icons-material/SearchRounded";
import PatientCard from "../components/doctor/PatientCard";
import PatientReportModal from "../components/doctor/PatientReportModal";

export default function DoctorDashboard() {
  const [allCases, setAllCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedCase, setSelectedCase] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await api.get("/doctor/all-patients");
      setAllCases(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching patients:", err);
      setError("Failed to load patient records. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = (patientCase) => {
    setSelectedCase(patientCase);
    setIsModalOpen(true);
  };

  const filteredCases = allCases.filter(c => {
    const matchesSearch = c.patient_name.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toString().includes(search);
    const matchesFilter = filter === 'all' || c.priority.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={800} color="primary" gutterBottom>
            Clinical Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and review patient diagnostic reports
          </Typography>
        </Box>

        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search patients name or ID..."
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 350 }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
              sx: { borderRadius: 3, bgcolor: 'background.paper' }
            }}
          />
          <ToggleButtonGroup
            value={filter}
            exclusive
            onChange={(e, v) => v && setFilter(v)}
            size="small"
            color="primary"
          >
            <ToggleButton value="all" sx={{ px: 3 }}>All Cases</ToggleButton>
            <ToggleButton value="high" sx={{ px: 3 }}>High Risk</ToggleButton>
            <ToggleButton value="normal" sx={{ px: 3 }}>Normal</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: 3 }}>{error}</Alert>
        ) : (
          <>
            <Grid container spacing={3}>
              {filteredCases.map((c) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={c.id}>
                  <PatientCard patientCase={c} onViewReport={handleViewReport} />
                </Grid>
              ))}
            </Grid>
            {filteredCases.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 10 }}>
                <Typography variant="h6" color="text.secondary">No patient records found.</Typography>
              </Box>
            )}
          </>
        )}

        <PatientReportModal
          open={isModalOpen}
          handleClose={() => setIsModalOpen(false)}
          patientCase={selectedCase}
        />
      </Container>
    </DashboardLayout>
  );
}

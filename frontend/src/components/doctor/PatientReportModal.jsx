import { Modal, Box, Typography, IconButton, Divider, Grid, Chip, Stack } from "@mui/material";
import CloseIcon from "@mui/icons-material/CloseRounded";
import { motion, AnimatePresence } from "framer-motion";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', md: 700 },
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 4,
    maxHeight: '90vh',
    overflowY: 'auto'
};

export default function PatientReportModal({ open, handleClose, patientCase }) {
    if (!patientCase) return null;

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h5" fontWeight={900}>Medical Report</Typography>
                    <IconButton onClick={handleClose}><CloseIcon /></IconButton>
                </Stack>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="caption" fontWeight={700} color="text.secondary" uppercase>Patient Name</Typography>
                        <Typography variant="h6" fontWeight={700}>{patientCase.patient_name || "Anonymous"}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="caption" fontWeight={700} color="text.secondary" uppercase>Contact Number</Typography>
                        <Typography variant="h6" fontWeight={700}>{patientCase.phone || "N/A"}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="caption" fontWeight={700} color="text.secondary" uppercase>Case ID</Typography>
                        <Typography variant="h6" fontWeight={700}>#{patientCase.id}</Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="caption" fontWeight={700} color="text.secondary" uppercase sx={{ display: 'block', mb: 1 }}>Symptoms Report</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {JSON.parse(patientCase.symptoms || "[]").map((s, i) => (
                                <Chip key={i} label={s} sx={{ fontWeight: 600 }} />
                            ))}
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
                            <Typography variant="caption" fontWeight={700} color="text.secondary" uppercase sx={{ display: 'block', mb: 2 }}>AI Diagnostic Results</Typography>
                            {JSON.parse(patientCase.predictions || "[]").map((p, i) => (
                                <Stack key={i} direction="row" justifyContent="space-between" mb={1}>
                                    <Typography fontWeight={600}>{p.disease || p.label}</Typography>
                                    <Typography fontWeight={800} color="primary">{p.probability}%</Typography>
                                </Stack>
                            ))}
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="caption" fontWeight={700} color="text.secondary" uppercase>Assessment Date</Typography>
                        <Typography variant="body1">{new Date(patientCase.created_at).toLocaleString()}</Typography>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
}

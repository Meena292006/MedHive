import { useState } from "react";
import { api } from "../api/api";
import Navbar from "../components/Navbar";
import SymptomSelect from "../components/SymptomSelect";
import { Button, TextField, Card } from "@mui/material";

export default function PatientDashboard() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [symptoms, setSymptoms] = useState([]);
  const [result, setResult] = useState(null);

  const submit = async () => {
    const res = await api.post("/cases/submit", {
      patient: name,
      symptoms
    });
    setResult(res.data);
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>Patient Portal</h2>

        <TextField label="Name" fullWidth onChange={e => setName(e.target.value)} />
        <TextField label="Contact Number" fullWidth sx={{ mt: 2 }} onChange={e => setPhone(e.target.value)} />

        <SymptomSelect value={symptoms} setValue={setSymptoms} />

        <Button variant="contained" sx={{ mt: 2 }} onClick={submit}>
          Submit Symptoms
        </Button>

        {result && (
          <Card sx={{ mt: 3, p: 2 }}>
            <h3>AI Prediction</h3>
            {result.predictions.map(p => (
              <p key={p.disease}>{p.disease} – {p.probability}%</p>
            ))}
            <b>Priority: {result.priority}</b>
          </Card>
        )}
      </div>
    </>
  );
}

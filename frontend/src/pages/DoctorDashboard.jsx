import { useEffect, useState } from "react";
import { api } from "../api/api";
import Navbar from "../components/Navbar";
import { Card, Button } from "@mui/material";

export default function DoctorDashboard() {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    api.get("/cases").then(res => {
      setCases(res.data);
      res.data.forEach(c => {
        if (c.priority === "HIGH") {
          alert("🚨 Urgent patient case detected!");
        }
      });
    });
  }, []);

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>Doctor Dashboard</h2>

        {cases.map(c => (
          <Card
            key={c.id}
            sx={{
              p: 2,
              mb: 2,
              borderLeft: c.priority === "HIGH" ? "6px solid red" : "6px solid green"
            }}
          >
            <b>{c.patient_name}</b><br />
            Risk Score: {c.risk_score}<br />
            Priority: {c.priority}
          </Card>
        ))}
      </div>
    </>
  );
}

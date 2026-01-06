import { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { mlApi } from "../api/mlApi";

export default function SymptomSelect({ value, setValue }) {
  const [options, setOptions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    mlApi.get("/symptoms")
      .then(res => {
        if (res.data && res.data.symptoms) {
          setOptions(res.data.symptoms);
        } else {
          setError("Invalid data format");
        }
      })
      .catch(err => {
        console.error(err);
        setError("Connection failed");
      });
  }, []);

  return (
    <>
      <Autocomplete
        multiple
        options={options}
        value={value}
        onChange={(e, newValue) => setValue(newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            label={error ? `Error: ${error}` : "Search & Select Symptoms"}
            error={!!error}
          />
        )}
      />
      {error && (
        <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '4px' }}>
          Backend not connected. Is it running on port 8000?
        </div>
      )}
    </>
  );
}



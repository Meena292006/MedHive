import { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import axios from "axios";

export default function SymptomSelect({ value, setValue }) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/symptoms")
      .then(res => setOptions(res.data.symptoms))
      .catch(err => console.error(err));
  }, []);

  return (
    <Autocomplete
      multiple
      options={options}
      value={value}
      onChange={(e, newValue) => setValue(newValue)}
      renderInput={(params) => (
        <TextField {...params} label="Search & Select Symptoms" />
      )}
    />
  );
}



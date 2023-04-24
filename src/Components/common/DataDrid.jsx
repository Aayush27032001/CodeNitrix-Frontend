import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const DataGrid = ({testCases, onSave}) => {
  const [rows, setRows] = useState(testCases);

  const handleInputChange = (e, index) => {
    const newRows = [...rows];
    newRows[index].input = e.target.value;
    setRows(newRows);
  };

  const handleOutputChange = (e, index) => {
    const newRows = [...rows];
    newRows[index].output = e.target.value;
    setRows(newRows);
  };

  const handleDeleteRow = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  const handleAddRow = () => {
    setRows([...rows, { input: "", output: "" }]);
  };
  

  return (
    <Box m={2}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleAddRow}
      >
        Add Row
      </Button>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Typography variant="subtitle1" gutterBottom>
            Input
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="subtitle1" gutterBottom>
            Output
          </Typography>
        </Grid>
        <Grid item xs={4} />
        {rows.map((row, index) => (
          <React.Fragment key={index}>
            <Grid item xs={5}>
              <TextField
                fullWidth
                value={row.input}
                onChange={(e) => handleInputChange(e, index)}
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                fullWidth
                value={row.output}
                onChange={(e) => handleOutputChange(e, index)}
              />
            </Grid>
            <Grid item xs={2}>
              <IconButton
                onClick={() => handleDeleteRow(index)}
                disabled={rows.length === 1}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
      <Button variant="text" color="primary" onClick={()=>{onSave(rows)}}>
        Save
      </Button>
    </Box>
  );
};

export default DataGrid;

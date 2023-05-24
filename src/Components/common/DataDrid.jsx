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
const SantizationArray = ['[', ']', '{', '}', '(', ')',".",";",'"',"'"]
const DataGrid = ({ testCases, onSave }) => {
  const [rows, setRows] = useState(testCases);

  const handleInputChange = (e, index) => {
    e.stopPropagation();
    const newRows = [...rows];
    newRows[index].input = SantizationArray?.reduce((str, char) => str.split(char).join(''), e.target?.value)?.split(",")?.map((item) => item.trim());
    
    setRows(newRows);
  };

  const handleOutputChange = (e, index) => {
    e.stopPropagation();
    const newRows = [...rows];
    newRows[index].output = SantizationArray?.reduce((str, char) => str.split(char).join(''), e.target?.value)?.split(",")?.map((item) => item.trim());
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

  const handleSave = () => {
    onSave(rows.map(row=>{
      row.input = row.input?.filter((item) => item !== "");
      row.output = row.output?.filter((item) => item !== "");
      return row;
    }));
  };

  return (
    <Box m={2} mt={1}>
      <Typography mb={2} variant="body1" color="initial">Note: For multiple values separte values with <i>comma(,)</i></Typography>
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
      <Button variant="text" color="primary" onClick={handleSave}>
        Save
      </Button>
    </Box>
  );
};

export default DataGrid;

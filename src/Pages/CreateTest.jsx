import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DataGrid from "../Components/common/DataDrid";
const CreateTest = () => {
  const [questions, setQuestions] = useState([{id:0}]);
  const QuestionForm = ({id}) => {
    const [testCases, setTestCases] = useState([{ input: "", output: "" }]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddTestCase = () => {
      setIsModalOpen(true);
    };

    const handleModalClose = () => {
      setIsModalOpen(false);
    };

    const handleSaveTestCases = (newTestCases) => {
      setTestCases(newTestCases);
      setIsModalOpen(false);
    };

    return (
      <Box m={2}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField fullWidth label="Name" />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Description" multiline />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Constraints
            </Typography>
            <TextField fullWidth label="Constraints" multiline />
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddTestCase}
              >
                Add Test Cases
              </Button>
              <Button disabled={!id} sx={{ml:"1rem"}} onClick={()=>{setQuestions(prev=>[...prev.filter(e=>e.id!==id)])}} variant="contained" color="error">
                Delete
              </Button>
            </Box>
          </Grid>
        </Grid>
        <Dialog open={isModalOpen} onClose={handleModalClose}>
          <DialogTitle>Add Test Cases</DialogTitle>
          <DialogContent sx={{ overflowX: "hidden" }}>
            <Box width={600}>
              <DataGrid testCases={testCases} onSave={handleSaveTestCases} />
            </Box>
            <DialogActions>
              <Button onClick={handleModalClose} color="secondary">
                Cancel
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </Box>
    );
  };
  const handleAddQuestion = () => {
    setQuestions((prev)=>{
      if(prev.length===0){
        return [{id:0}]
      }
      return [...prev,{id:prev[prev.length-1]?.id+1}]
    })
  }
  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Question Form
      </Typography>
      <Button variant="contained" color="primary" onClick={handleAddQuestion}>
        Add Question
      </Button>
      {questions.map((question)=>{
        return <QuestionForm id={question.id}/>
      })}
    </div>
  );
};

export default CreateTest;

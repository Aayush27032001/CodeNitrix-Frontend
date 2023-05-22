import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
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
import { get } from "../utils/request";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const CreateTest = () => {
  const [questions, setQuestions] = useState([{ id: 0 }]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "")
  );
  const navigate = useNavigate();
  const QuestionForm = ({ id }) => {
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
              <Button
                disabled={!id}
                sx={{ ml: "1rem" }}
                onClick={() => {
                  setQuestions((prev) => [...prev.filter((e) => e.id !== id)]);
                }}
                variant="contained"
                color="error"
              >
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
    setQuestions((prev) => {
      if (prev.length === 0) {
        return [{ id: 0 }];
      }
      return [...prev, { id: prev[prev.length - 1]?.id + 1 }];
    });
  };

  const checkLogin = async () => {
    const resp = await get(
      "/results/myResults",
      {},
      localStorage.getItem("token")
    );
    console.log(resp);
    if (!resp.ok) {
      toast("Please Login!", {
        theme: "light",
        type: "error",
        position: "top-right",
      });
      navigate("/login");
      return;
    }
    setLoggedIn(true);
  };
  useEffect(() => {
    checkLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!loggedIn) {
    return (
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress sx={{ mr: "1rem" }} /> Loading...
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          height: "4.5rem",
          p: "1rem",
          mb: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "rgba(0, 0, 0, 0.18) 0px 2px 4px",
          position: "sticky",
          top: 0,
          background: "#fff",
          zIndex: "9",
        }}
      >
        <Typography variant="body1" color="initial" fontSize="1.375rem">
          Welcome, {user.firstName}
        </Typography>
        <Link to={"/result"}>
          <Button variant="contained" color="primary">
            View Test Results
          </Button>
        </Link>
      </Box>
      <Box
        sx={{
          border: "solid #c1c1c1 1px",
          m: "1rem",
          mt: "2rem",
          pt: "1.5rem",
          position: "relative",
        }}
      >
        <Typography
          sx={{
            fontSize: "1.125rem",
            border: "solid #c1c1c1 1px",
            display: "inline",
            position: "absolute",
            background: "#fff",
            top: "-24px",
            left: "1rem",
            p: "0.5rem 2rem",
            borderRadius: "4px",
          }}
        >
          Create Test
        </Typography>
        {questions.map((question) => {
          return <QuestionForm id={question.id} />;
        })}
        <Box p={"1rem"}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddQuestion}
          >
            Add Question
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateTest;

import {
  Box,
  CircularProgress,
  Tab,
  Tabs,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CodeEditor from "../Components/CodeEditor/CodeEditor";
import DisableDevTools from "../Components/DisableDevTools";
import FullscreenWrapper from "../Components/FullscreenWrapper";
import Layout from "../Components/Layout/Layout";
import { get, post } from "../utils/request";
import styles from "./AttemptTest.module.scss";
function deleteLocalStorageItemsExcept(keysToKeep) {
  // Get all keys currently in localStorage
  const allKeys = Object.keys(localStorage);

  // Loop through all keys and delete any that aren't in keysToKeep
  for (let i = 0; i < allKeys.length; i++) {
    const key = allKeys[i];

    if (!keysToKeep.includes(key)) {
      localStorage.removeItem(key);
    }
  }
}
function convertSecondsToHMS(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return {
    hours,
    minutes,
    seconds: remainingSeconds,
  };
}

const QuestionViewer = React.memo(function QuestionViewer({ question }) {
  return (
    <Box p={"1rem"} height="100vh" overflow="auto">
      <Box
        sx={{
          background: "#ddd",
          p: "1rem",
          borderRadius: "8px",
          textAlign: "justify",
          fontSize: "1.125rem",
          fontWeight: "500",
        }}
      >
        <Typography variant="body1" color="initial" fontWeight={700} fontSize={"18px"}>Question:</Typography>
        <Typography variant="body1" color="initial" fontSize={"16px"}>{question?.name}</Typography>
      </Box>
      <Box
        sx={{
          background: "#ddd",
          p: "1rem",
          my: "1rem",
          borderRadius: "8px",
          textAlign: "justify",
          fontSize: "1.125rem",
          fontWeight: "500",
        }}
      >
        <Typography variant="body1" color="initial" fontWeight={700}>Statement:</Typography>
        <Typography variant="body1" color="initial" fontSize={"14px"}>{question?.statement}</Typography>
      </Box>
      {question.testcases.map((testcase, i) => {
        if (i > 1) {
          return null;
        }
        return (
          <Box
            key={i}
            sx={{
              background: "#ddd",
              p: "1rem",
              my: "1rem",
              borderRadius: "8px",
              textAlign: "justify",
              fontSize: "1.125rem",
              fontWeight: "500",
            }}
          >
            <Typography variant="body1" fontWeight={700} color="initial">
              Example: {i + 1}
            </Typography>
            <Typography variant="body1" color="initial">
              Input: {Array.isArray(testcase?.input) ? `[ ${testcase?.input?.join(" , ")} ]` : JSON.stringify(testcase?.input)}
            </Typography>
            <Typography variant="body1" color="initial">
              Output: {testcase?.output?.[0]}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
});

const AttemptTest = () => {
  const [loading, setLoading] = useState(true);
  const [test, setTest] = useState();
  const [value, setValue] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState();
  const [confirmTestSubmission, setConfirmTestSubmission] = useState(false);
  const [submittingTest, setSubmittingTest] = useState(false);

  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const fetchTest = async () => {
    if (!localStorage.getItem("testCode")) {
      navigate("/");
    }
    const res = await get(`tests/${localStorage.getItem("testCode")}`);
    if (res.status !== 200) {
      navigate("/");
    } else {
      setTest(res.data.test);
      if (isNaN(localStorage.getItem("timeout"))) {
        localStorage.setItem("timeout", res.data.test.duration);
      }
      if (!!!localStorage.getItem("timeout")) {
        localStorage.setItem("timeout", res.data.test.duration);
      }
      setTimeRemaining(
        parseInt(localStorage.getItem("timeout")) ?? res.data.test.duration
      );
      res?.data?.test?.Question?.forEach((q) => {
        localStorage.setItem(
          q?._id,
          "module.exports = function(input) {\n  //Your code goes here\n\n}"
        );
      });
      if (localStorage.getItem("prevTest") === res?.data?.test?._id) {
        if (
          !isNaN(localStorage.getItem("prevTimeout")) &&
          !!localStorage.getItem("prevTimeout")
        ) {
          if (
            // eslint-disable-next-line eqeqeq
            JSON.parse(localStorage.getItem("user") ?? "{'email':''}")?.email ==
            localStorage.getItem("prevEmail")
          ) {
            setTimeRemaining(localStorage.getItem("prevTimeout"));
            localStorage.setItem(
              "timeout",
              localStorage.getItem("prevTimeout")
            );
            setLoading(false);
            return;
          }
        }
      }
      setLoading(false);
    }
  };

  const submitTestHandler = async () => {
    setSubmittingTest(true);
    const codePayload = test.Question.map((c) => {
      return { questionID: c._id, code: localStorage.getItem(c._id) };
    }, {});
    const resp = await post("/submit/test", {
      user: JSON.parse(localStorage.getItem("user")),
      code: codePayload,
      testID: localStorage.getItem("testCode"),
    });
    if (resp.ok) {
      toast(resp.message, { type: "success", position: "top-right" });
      navigate("/");
    } else {
      toast(resp.message, { type: "error", position: "top-right" });
    }
    let timer;
    timer = setTimeout(() => {
      setSubmittingTest(false);
      clearTimeout(timer);
    }, 3000);
  };
  useEffect(() => {
    if (timeRemaining < 0) {
      submitTestHandler();
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRemaining]);
  useEffect(() => {
    fetchTest();
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        localStorage.setItem("timeout", prev - 1);
        return prev - 1;
      });
    }, 1000);
    return () => {
      localStorage.setItem("prevTimeout", localStorage.getItem("timeout"));
      localStorage.setItem("prevTest", localStorage.getItem("testCode"));
      localStorage.setItem(
        "prevEmail",
        JSON.parse(localStorage.getItem("user")).email
      );
      clearInterval(interval);
      deleteLocalStorageItemsExcept([
        "token",
        "prevTimeout",
        "prevTest",
        "prevEmail",
      ]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <DisableDevTools>
      <FullscreenWrapper>
        {loading ? (
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
        ) : (
          <div className={styles.testContainer}>
            <Box
              display={"flex"}
              background="#1e1e1e"
              justifyContent="space-between"
            >
              <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"
              >
                {test?.Question?.map((_, i) => {
                  return <Tab label={`Question ${i + 1}`} key={i} />;
                })}
              </Tabs>
              <Box display="flex" alignItems={"center"}>
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    pr: "1rem",
                    fontSize: "1.2rem",
                  }}
                >
                  Time Remaining:{" "}
                  {`${convertSecondsToHMS(timeRemaining).hours}:${
                    convertSecondsToHMS(timeRemaining).minutes
                  }:${convertSecondsToHMS(timeRemaining).seconds}`}
                </Box>
                <Box pr="0.5rem">
                  <Button
                    variant="contained"
                    onClick={() => {
                      setConfirmTestSubmission(true);
                    }}
                    color="success"
                  >
                    Submit Test
                  </Button>
                </Box>
              </Box>
            </Box>
            <Layout
              left={<QuestionViewer question={test?.Question[value]} />}
              right={<CodeEditor question={test?.Question[value]} />}
            />
          </div>
        )}
        <Dialog
          open={confirmTestSubmission}
          onClose={() => {
            setConfirmTestSubmission(false);
          }}
        >
          <DialogTitle>Confirm Your Test Submission</DialogTitle>
          <DialogActions>
            <Button
              color="error"
              onClick={() => {
                setConfirmTestSubmission(false);
              }}
              disabled={submittingTest}
              variant="contained"
            >
              Cancel
            </Button>
            <Button
              color="success"
              onClick={submitTestHandler}
              variant="contained"
              disabled={submittingTest}
            >
              {submittingTest && (
                <CircularProgress
                  color="inherit"
                  size={24}
                  sx={{ mr: "0.5rem" }}
                />
              )}{" "}
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </FullscreenWrapper>
    </DisableDevTools>
  );
};

export default AttemptTest;

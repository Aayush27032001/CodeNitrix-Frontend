import ReactCodeMirror from "@uiw/react-codemirror";
import React, { useEffect, useState } from "react";
import { javascript, esLint } from "@codemirror/lang-javascript";
import { post } from "../../utils/request";
import { lintGutter, linter } from "@codemirror/lint";
import Linter from "eslint4b-prebuilt";
import { Box, Button, Typography } from "@mui/material";
import { toast } from "react-toastify";

const esLintConfigs = {
  env: { es6: true },
  rules: { "no-unused-vars": "off" },
};

const CodeEditor = ({ question }) => {
  const [code, setCode] = useState(
    localStorage.getItem(question?._id) ||
      "module.exports = function(input) {\n  //Your code goes here\n\n}"
  );
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    setCode(
      localStorage.getItem(question?._id) ||
        "module.exports = function(input) {\n  //Your code goes here\n\n}"
    );
    setResults([])
  }, [question?._id]);

  const submitHandler = async () => {
    setLoading(true);
    try {
      const res = await post("js", {
        code,
        testId: localStorage.getItem("testCode"),
        questionId: question?._id,
      });
      if (!res.ok) {
        throw new Error(res.message);
      }
      setResults(res.data);
    } catch (error) {
      toast(error.message, { type: "error", position: "top-right" });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    localStorage.setItem(question?._id, code);
  }, [code, question?._id]);

  return (
    <Box height="100%" position="relative">
      <ReactCodeMirror
        value={code}
        theme="light"
        height="60vh"
        extensions={[
          javascript(),
          linter(esLint(new Linter(), esLintConfigs)),
          lintGutter(),
        ]}
        onChange={(value) => setCode(value)}
      />
      <Box sx={{ height: "30vh", overflow: "auto" }}>
        {!loading &&
          results.map((result, index) => (
            <Typography
              key={index}
              sx={{
                m: "0.25rem",
                background: result ? "rgba(221,255,221,1.00)" : "#f9c9c9",
                p: "1rem",
                borderRadius: "8px",
              }}
            >
              {`Test Case ${index + 1}: `}
              {result ? "Passed" : "Failed"}
            </Typography>
          ))}
      </Box>
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          background: "#f5f5f5",
          display: "flex",
          height: "4vh",
          justifyContent: "flex-end",
        }}
      >
        <Button
          onClick={submitHandler}
          disabled={loading}
          variant="contained"
          color="error"
        >
          Run Test
        </Button>
      </Box>
    </Box>
  );
};

export default CodeEditor;

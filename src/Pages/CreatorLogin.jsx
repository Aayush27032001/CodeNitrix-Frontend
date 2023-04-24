import { Box, Button, Link, TextField } from "@mui/material";
import React, { useState } from "react";
import FormLayout from "../Components/Layout/FormLayout";
import { post } from "../utils/request";

const SignUp = ({ setisLogin }) => {
  const [form, setform] = useState();
  const submitHandler = async (e) => {
    e.preventDefault();
    const resp = await post("/users/signup", form);
    if (resp.ok) {
      localStorage.setItem("token", resp.token);
    } else {
      alert("Try After Sometime");
    }
  };
  const formLogger = (e) => {
    setform((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  return (
    <>
      <form onSubmit={submitHandler} onChange={formLogger} className="form">
        <TextField
          label="Name"
          name="firstName"
          required
          fullWidth
          sx={{ mb: "2rem" }}
        />
        <TextField
          label="Email"
          type="email"
          name="email"
          required
          fullWidth
          sx={{ mb: "2rem" }}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          required
          fullWidth
          sx={{ mb: "2rem" }}
        />
        <TextField
          label="Confirm Password"
          name="passwordConfirm"
          type="password"
          required
          fullWidth
          sx={{ mb: "2rem" }}
        />
        <Button variant="contained" type="submit" fullWidth>
          Submit
        </Button>
        <Box sx={{ width: "100%", mt: "0.5rem" }}>
          <Link
            onClick={() => {
              setisLogin(true);
            }}
            component={"span"}
          >
            {"Already have an aacount?"}
          </Link>
        </Box>
      </form>
    </>
  );
};
const Login = ({ setisLogin }) => {
  const [form, setform] = useState();
  const submitHandler = async (e) => {
    e.preventDefault();
    const resp = await post("/users/login", form);
    console.log(resp);
  };
  const formLogger = (e) => {
    setform((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  return (
    <>
      <form onSubmit={submitHandler} onChange={formLogger} className="form">
        <TextField
          label="Email"
          type="email"
          name="firstname"
          required
          fullWidth
          sx={{ mb: "2rem" }}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          required
          fullWidth
          sx={{ mb: "2rem" }}
        />
        <Button variant="contained" type="submit" fullWidth>
          Submit
        </Button>
        <Box sx={{ width: "100%", mt: "0.5rem" }}>
          <Link
            onClick={() => {
              setisLogin(false);
            }}
            component={"span"}
          >
            {"Create New Account?"}
          </Link>
        </Box>
      </form>
    </>
  );
};

const CreatorLogin = () => {
  const [isLogin, setisLogin] = useState(true);
  return (
    <FormLayout
      image_url={"https://source.unsplash.com/random?topics=technology"}
    >
      {isLogin ? (
        <Login setisLogin={setisLogin} />
      ) : (
        <SignUp setisLogin={setisLogin} />
      )}
    </FormLayout>
  );
};

export default CreatorLogin;

import { Box, Button, CircularProgress, Link, TextField } from "@mui/material";
import React, { useState } from "react";
import FormLayout from "../Components/Layout/FormLayout";
import { post } from "../utils/request";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SignUp = ({ setisLogin }) => {
  const [form, setform] = useState();
  const [loadding, setLoading] = useState(false);
  const navigate = useNavigate()
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    const resp = await post("/users/signup", form);
    if (resp.ok) {
      localStorage.setItem("token", resp.token);
      localStorage.setItem("user",JSON.stringify(resp?.data?.user));
      toast("Your Account has been Created!", {
        type: "success",
        position: "top-right",
      });
      navigate("/createTest")
    } else {
      toast("Try after Sometime!", {
        type: "error",
        position: "top-right",
      });
    }
    setLoading(false);
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
        <Button variant="contained" type="submit" disabled={loadding} fullWidth>
          {loadding ? "Submitting" : "Submit"}
          {loadding && <CircularProgress size={24} sx={{ml:"1rem", color:"grey"}}/>}
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
  const [loadding, setLoading] = useState(false);
  const navigate = useNavigate()
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    const resp = await post("/users/login", form);
    if (resp.ok) {
      localStorage.setItem("token", resp.token);
      localStorage.setItem("user",JSON.stringify(resp?.data?.user));
      toast("Your Account has been Loggedin!", {
        type: "success",
        position: "top-right",
      });
      navigate("/createTest")
    } else {
      toast(resp.message || "Try after Sometime!", {
        type: "error",
        position: "top-right",
      });
    }
    setLoading(false);
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
        <Button variant="contained" type="submit" disabled={loadding} fullWidth>
          {loadding ? "Submitting" : "Submit"}
          {loadding && <CircularProgress size={24} sx={{ml:"1rem", color:"grey"}}/>}
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
      image_url={"https://s40424.pcdn.co/in/wp-content/uploads/2022/10/What-is-MBA-in-HR_Human-Resource.jpg.webp"}
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

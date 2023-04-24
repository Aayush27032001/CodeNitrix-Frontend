import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Drawer,
  CircularProgress,
} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { get, post } from "../utils/request";

const Results = () => {
  const [loading, setLoading] = useState(true);
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [resultList, setResultList] = useState([]);
  const [activeTest, setActiveTest] = useState({});
  const fetchResult = async (token) => {
    const resp = await get("/results/myResults", {}, token);
    if (resp.ok) {
      setResultList(resp.data.results);
      setActiveTest(resp.data.results[0]);
      setIsLoggedin(true);
      setLoading(false);
    }
  };
  const checkValidToken = async (token) => {
    const response = await get("/results/myResults", {}, token);
    if (!response.ok) {
      setIsLoggedin(false);
      toast("Please Login!", {
        theme: "light",
        type: "error",
        position: "top-right",
      });
      setLoading(false);
    } else {
      fetchResult(token);
    }
  };
  const loginSubmitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const response = await post("/users/login", {
      email: formData.get("email"),
      password: formData.get("password"),
    });
    if (response.ok) {
      localStorage.setItem("token", response.token);
      toast("Log In successful")
      fetchResult(response.token)
      setIsLoggedin(true);
    } else {
      toast(response.message, { type: "error", position: "top-right" });
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      checkValidToken(localStorage.getItem("token"));
    } else {
      setIsLoggedin(false);
      checkValidToken(localStorage.getItem("token"));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (loading) {
    return (
      <Box display="flex" alignItems="center" justifyContent={"center"} width="100vw" height="100vh">
        <CircularProgress sx={{ mr: "0.5rem" }} />
        <Typography variant="body1" color="initial">
          Loading...
        </Typography>
      </Box>
    );
  }
  return (
    <Box>
      <Dialog open={!isLoggedin} onClick={() => {}}>
        <form onSubmit={loginSubmitHandler}>
          <DialogTitle>Login</DialogTitle>
          <DialogContent>
            <Box display={"flex"} flexDirection="column">
              <TextField
                sx={{ mt: "1rem" }}
                name="email"
                type="email"
                label="Email"
                required
              />
              <TextField
                sx={{ mt: "1rem" }}
                name="password"
                type="password"
                label="Password"
                required
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button color="primary" type="submit">
              Login
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Box width={"100%"} display="flex">
        <Box height="100vh">
          <Drawer
            sx={{
              "& .MuiDrawer-paper": { boxSizing: "border-box", width: "360px" },
            }}
            variant="permanent"
            anchor="left"
          >
            <List>
              {resultList.map((e) => {
                return (
                  <ListItem key={e?._id}>
                    <ListItemButton
                      onClick={() => {
                        setActiveTest(e);
                      }}
                    >
                      <Typography
                        variant="body1"
                        color="initial"
                      >{`Test ID: ${e?.testID}`}</Typography>
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Drawer>
        </Box>
        <Box
          p="1rem"
          ml={"360px"}
          display="inline-block"
          height="100vh"
          width={"100%"}
          sx={{ overflowX: "hidden", overflowY: "auto" }}
        >
          {activeTest?.candidate
            ?.sort((a, b) => {
              return a?.name.localeCompare(b?.name);
            })
            ?.map((e) => {
              return (
                <Box
                  key={e._id}
                  display={"flex"}
                  justifyContent="space-between"
                  flexWrap={"wrap"}
                  my="0.5rem"
                  sx={{
                    background: "#dfd",
                    padding: "1rem",
                    borderRadius: "4px",
                  }}
                >
                  <Typography variant="body1" color="initial">
                    Name: {e?.name}
                  </Typography>
                  <Typography variant="body1" color="initial" ml="0.5rem">
                    Email: {e?.email}
                  </Typography>
                  <Typography variant="body1" color="initial" ml="0.5rem">
                    Score: {e?.score.toFixed(2)}%
                  </Typography>
                </Box>
              );
            })}
        </Box>
      </Box>
    </Box>
  );
};

export default Results;

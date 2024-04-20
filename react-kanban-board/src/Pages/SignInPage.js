import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Typography, TextField, Button } from "@mui/material";
import { styled } from "@mui/system";
import { useDispatch, useSelector } from "react-redux";
import { signIn, clearError } from "../reducers/user/userSlice"; // Update the path
import { fetchBoards } from "../reducers/board/boardSlice";

const Container = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
}));

const Paper = styled("div")(({ theme }) => ({
  padding: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "300px",
}));

const Form = styled("form")(({ theme }) => ({
  width: "100%",
  marginTop: theme.spacing(1),
  "& [autocomplete='off']": {
    WebkitBoxShadow: "0 0 0 1000px white inset", // Fix for Chrome
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
}));

const SignInPage = () => {
  const dispatch = useDispatch();
  const error = useSelector((state) => state.user.error);

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();

    dispatch(clearError());
    // Validate email (you can add more sophisticated validation)
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      // Invalid email format
      // Set an error message or dispatch an action to store the error
      // Example: dispatch(setError("Invalid email format"));
      return;
    }

    // Dispatch the sign-in action
    dispatch(signIn({ email, password }))
      .unwrap()
      .then((result) => {
        // Redirect to '/' on successful sign-in

        // dispatch board here using this same email
        dispatch(fetchBoards(email));
        setEmail("");
        setPassword("");

        navigate("/");
      })
      .catch((err) => {
        // Handle any errors here (they are already set in the Redux state)
        // You can also display an error message to the user
      });

    setEmail("");
    setPassword("");
  };

  return (
    <Container>
      <Paper>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <Form onSubmit={handleSignIn} autoComplete="disabled">
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="disabled"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="disabled"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <Typography color="error">{error}</Typography>}
          <SubmitButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            Sign In
          </SubmitButton>
          <Link to="/signup" variant="body2">
            {"Don't have an account? Sign Up"}
          </Link>
        </Form>
      </Paper>
    </Container>
  );
};

export default SignInPage;

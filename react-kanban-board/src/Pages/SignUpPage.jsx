import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Typography, TextField, Button } from "@mui/material";
import { styled } from "@mui/system";
import { useDispatch, useSelector } from "react-redux";
import { signUp, clearError, signIn } from "../reducers/user/userSlice"; // Update the path

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
  width: "300px", // Adjust the width as needed
}));

const Form = styled("form")(({ theme }) => ({
  width: "100%",
  marginTop: theme.spacing(1),
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
}));

const SignUpPage = () => {
  const dispatch = useDispatch();
  const error = useSelector((state) => state.user.error);
  const successMessage = useSelector((state) => state.user.successMessage);

  const [validationMessages, setValidationMessages] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const history = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous validation messages
    setValidationMessages({
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    });

    if (!formData.name.trim()) {
      setValidationMessages((prev) => ({
        ...prev,
        name: "Name cannot be empty",
      }));
      return;
    }

    if (!formData.email.trim()) {
      setValidationMessages((prev) => ({
        ...prev,
        email: "Email cannot be empty",
      }));
      return;
    }

    if (!isValidEmail(formData.email)) {
      setValidationMessages((prev) => ({
        ...prev,
        email: "Invalid email format",
      }));
      return;
    }

    if (!formData.password.trim() || !formData.confirmPassword.trim()) {
      setValidationMessages((prev) => ({
        ...prev,
        password: "Password and Confirm Password cannot be empty",
      }));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setValidationMessages((prev) => ({
        ...prev,
        password: "Password and Confirm Password do not match",
      }));
      return;
    }

    try {
      // All validations passed, proceed with sign up logic
      e.preventDefault();
      dispatch(clearError());

      // Dispatch sign up action
      await dispatch(signUp(formData));

      // Sign up successful, dispatch login action
      await dispatch(
        signIn({ email: formData.email, password: formData.password })
      );
      dispatch(clearError());
      setFormData({
        email: "",
        name: "",
        password: "",
        confirmPassword: "",
      });
      // Redirect to '/'
      history("/");
    } catch (error) {
      // Sign up or login failed, handle the error
      console.error("Sign up or login error:", error);

      // You can dispatch an action to store the error in the Redux store if needed
      // Clear form data
      setFormData({
        email: "",
        name: "",
        password: "",
        confirmPassword: "",
      });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    dispatch(clearError());
  };

  // Function to check if the email is in a valid format
  const isValidEmail = (email) => {
    // Implement your email validation logic here
    // This is a simple example, you might want to use a library or a more robust validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <Container>
      <Paper>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        {/* Display success message in green box */}
        {successMessage && (
          <Typography
            color="success"
            sx={{
              backgroundColor: "green",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "10px",
            }}
          >
            {successMessage}
          </Typography>
        )}
        {/* Display error message in red box */}
        {error && (
          <Typography
            color="error"
            sx={{
              backgroundColor: "red",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "10px",
            }}
          >
            {error}
          </Typography>
        )}
        <Form onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoComplete="name"
            autoFocus
            onChange={handleChange}
          />
          {validationMessages.name && (
            <Typography color="error">{validationMessages.name}</Typography>
          )}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={handleChange}
          />
          {/* Display validation message for email */}
          {validationMessages.email && (
            <Typography color="error">{validationMessages.email}</Typography>
          )}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            onChange={handleChange}
          />
          {/* Display validation message for password */}
          {validationMessages.password && (
            <Typography color="error">{validationMessages.password}</Typography>
          )}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            onChange={handleChange}
          />
          {/* Display validation message for confirmPassword */}
          {validationMessages.confirmPassword && (
            <Typography color="error">
              {validationMessages.confirmPassword}
            </Typography>
          )}
          {/* No need for "Work as" field */}
          <SubmitButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            Sign Up
          </SubmitButton>
          <Link to="/signin" variant="body2">
            Already have an account? Sign In
          </Link>
        </Form>
      </Paper>
    </Container>
  );
};

export default SignUpPage;

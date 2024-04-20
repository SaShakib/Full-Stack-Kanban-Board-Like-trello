import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axiosConfig"; // Import your configured Axios instance

// Async thunk for user sign up
export const signUp = createAsyncThunk("user/signUp", async (userData) => {
  try {
    const response = await axios.post("/auth/signup", userData);
    return response.data;
    // console.log(userData);
  } catch (error) {
    throw error.response.data;
  }
});

// Async thunk for user sign in
export const signIn = createAsyncThunk("user/signIn", async (userData) => {
  try {
    const response = await axios.post("/auth/signin", userData);
    localStorage.setItem("accessToken", response.data.token);

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
});

// Async thunk for verifying user token
export const verifyUser = createAsyncThunk("user/verifyUser", async (token) => {
  try {
    const response = await axios.post("/verify", { token });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
});

export const logout = createAsyncThunk("user/logout", async () => {
  try {
    // You may want to send a request to the server to invalidate the token if needed
    // For simplicity, let's clear the token from localStorage only in this example
    localStorage.removeItem("accessToken");

    console.log("Logout done");
    return null; // You can return any data you want, or use null
  } catch (error) {
    throw error.response.data;
  }
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    isAuthenticated: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.fulfilled, (state, action) => {
        
      })
      .addCase(signUp.rejected, (state, action) => {
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.error = action.error.message;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(verifyUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(verifyUser.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;

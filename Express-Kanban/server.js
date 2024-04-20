const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;
const multerRouter = require("./multer");

const path = require("path");

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/Kanban", {});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", require("./routes/auth")); // Create this file later
app.use("/api/board", require("./routes/board")); // Create this file later
app.use("/api/upload", multerRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

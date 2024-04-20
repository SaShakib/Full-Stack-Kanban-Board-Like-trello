// Import necessary modules
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const authMiddleware = require("./authMiddleware");

router.use(authMiddleware);
// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Single image upload middleware
const imageUpload = multer({ storage }).single("image");

// Multiple file upload middleware (up to 5 files)
const filesUpload = multer({ storage }).array("files", 5);

// Apply authMiddleware to the entire router

// Single image upload endpoint
router.post("/upload-image", (req, res) => {
  imageUpload(req, res, (err) => {
    try {
      if (err instanceof multer.MulterError) {
        console.error(err);
        return res.status(500).json({ message: "Multer error" });
      } else if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error uploading image" });
      }

      const imageUrl = `/uploads/${req.file.filename}`;
      res.json({ message: "Image uploaded successfully", imageUrl });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error uploading image" });
    }
  });
});

// Multiple file upload endpoint
router.post("/upload-files", (req, res) => {
  filesUpload(req, res, (err) => {
    try {
      if (err instanceof multer.MulterError) {
        console.error(err);
        return res.status(500).json({ message: "Multer error" });
      } else if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error uploading files" });
      }

      const fileUrls = req.files.map((file) => {
        return { url: `/uploads/${file.filename}`, name: file.filename };
      });

      res.json({ message: "Files uploaded successfully", fileUrls });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error uploading files" });
    }
  });
});
router.get("/get-file/:filename", (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, "uploads", filename);

    // Check if the file exists
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ message: "File not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting file" });
  }
});
router.delete("/delete-file/:filename", (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, "uploads", filename);

    // Check if the file exists
    if (fs.existsSync(filePath)) {
      // Remove the file
      fs.unlinkSync(filePath);
      res.json({ message: "File deleted successfully" });
    } else {
      res.status(404).json({ message: "File not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting file" });
  }
});

module.exports = router;

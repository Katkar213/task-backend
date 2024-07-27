const express = require('express');
const { Login, Register, uploadFile, getFiles, deleteFile } = require('../controller/components-controller');
const auth = require('../middlewear/auth');
const upload = require('../upload');

const routes = express.Router();

// Login Route
routes.post("/login", Login);

// Register Route
routes.post("/register", Register);

// File Upload Route
routes.post("/upload", auth, upload.single('file'), uploadFile);

// Get Files Route 
routes.get("/files", auth, getFiles);

// Delete File Route
routes.delete("/files/:fileId", auth, deleteFile);

module.exports = routes;


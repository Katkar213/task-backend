const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Registerdata2, UploadedFile } = require("../model/models");
const secretKey = "ketan";
const fs = require('fs');
const path = require('path');

// Register
const Register = async (req, res) => {
    const details = req.body;
    const saltRounds = 10;
    const existingUser = await Registerdata2.findOne({ email: details.email });

    if (existingUser) {
        return res.send({ message: "User is already registered" });
    }

    const hashPassword = bcrypt.hashSync(details.password, saltRounds);
    const newUser = {
        name: details.name,
        email: details.email,
        password: hashPassword,
    };

    await Registerdata2.create(newUser);
    return res.send({ message: "User is successfully Registered" });
};

// Login
const Login = async (req, res) => {
    const { email, password } = req.body;
    const user = await Registerdata2.findOne({ email });

    if (user) {
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (isPasswordValid) {
            const token = jwt.sign({ userEmail: email }, secretKey, { expiresIn: "7d" });
            return res.send({ message: "User is successfully Login", name: user.name, token });
        } else {
            return res.send({ message: "Password is wrong" });
        }
    } else {
        return res.send({ message: "Enter valid Email" });
    }
};

// File Upload
const uploadFile = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).send({ message: "No file uploaded" });
        }

        const uniqueCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const newFile = {
            filename: file.originalname,
            code: uniqueCode,
            owner: req.userId,
            path: file.path
        };

        await UploadedFile.create(newFile);
        res.send({ message: "File uploaded successfully", code: uniqueCode });
    } catch (error) {
        console.error('Error uploading file:', error);
        if (!res.headersSent) {
            res.status(500).send({ message: "Internal Server Error" });
        }
    }
};

// Get Uploaded Files
const getFiles = async (req, res) => {
    try {
        const files = await UploadedFile.find({ owner: req.userId });
        res.send(files);
    } catch (error) {
        console.error('Error retrieving files:', error);
        if (!res.headersSent) {
            res.status(500).send({ message: "Internal Server Error" });
        }
    }
};

// Delete File
const deleteFile = async (req, res) => {
    try {
        const { fileId } = req.params;
        const file = await UploadedFile.findOneAndDelete({ _id: fileId, owner: req.userId });

        if (file) {
            fs.unlinkSync(path.join(__dirname, '../', file.path));
            res.send({ message: "File deleted successfully" });
        } else {
            res.status(404).send({ message: "File not found" });
        }
    } catch (error) {
        console.error('Error deleting file:', error);
        if (!res.headersSent) {
            res.status(500).send({ message: "Internal Server Error" });
        }
    }
};

module.exports = { Login, Register, uploadFile, getFiles, deleteFile };

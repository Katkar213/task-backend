const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String
});

const UploadedFileSchema = new mongoose.Schema({
    filename: String,
    code: String,
    owner: { type: String, required: true },
    path: String
});

const Registerdata2 = mongoose.model('User', UserSchema);
const UploadedFile = mongoose.model('UploadedFile', UploadedFileSchema);

module.exports = { Registerdata2, UploadedFile };

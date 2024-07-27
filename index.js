const express = require('express');

const path = require('path');
const routes = require('./Routes/Routes');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 4001;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', routes);



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

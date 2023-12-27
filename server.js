require('dotenv').config();
const express = require('express');
const app = express();
const connectDB = require('./config/db');
const path = require('path');
const cors = require('cors');

const PORT = process.env.PORT || 3000;
connectDB();

// CORS
const corsOptions = {
    origin: process.env.ALLOW_CLIENTS.split(',')
}

app.use(cors(corsOptions));
app.use(express.json());
// Templete Engine
app.use(express.static('public'));
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// Routes
app.use('/api/files',require('./routes/files'));
app.use('/files',require('./routes/show'));
app.use('/files/download',require('./routes/download'));

app.listen(PORT, ()=> {
    console.log(`Listening on port ${PORT}`);
});
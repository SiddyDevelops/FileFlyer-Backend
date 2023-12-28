require('dotenv').config();
const mongoose = require('mongoose');

async function connectDB() {
    // Database connection
    try {
        const connection = await mongoose.connect(process.env.MONGO_CONNECTION_URL);
        console.log('Database connected.');
    } catch(err) {
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDB;
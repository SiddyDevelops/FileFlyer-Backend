const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const infoSchema = new Schema({
    information: {
        type: String,
        required: true
    },
    uuid: {
        type: String,
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Info', infoSchema);
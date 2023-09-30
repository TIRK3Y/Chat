// backend/models/Project.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    files: [
        {
            type: String,
        }
    ],
    sourceCode: {
        type: String,
    },
    category: {
        type: String,
        enum: ['graphics', 'programming', 'music', 'video'],
        required: true,
    },
    // Add more fields as needed
});

module.exports = mongoose.model('Project', projectSchema);

const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: false, default: 'Student' },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'counselor'], default: 'student' },
  preferences: {
    preferredCountry: { type: String },
    budget: { type: Number },
    fieldOfStudy: { type: String },
    intake: { type: String },
    ieltsScore: { type: Number }
  }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
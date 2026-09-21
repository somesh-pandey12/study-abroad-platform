const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
  universityName: { type: String, required: true, index: true },
  country: { type: String, required: true, index: true },
  programName: { type: String, required: true },
  fieldOfStudy: { type: String, required: true, index: true },
  degreeLevel: { type: String, required: true },
  tuitionFee: { type: Number, required: true, index: true },
  intake: { type: [String], required: true },
  minIelts: { type: Number, required: true },
  scholarshipAvailable: { type: Boolean, default: false }
});

programSchema.index({ country: 1, fieldOfStudy: 1, tuitionFee: 1 });

module.exports = mongoose.model('Program', programSchema);
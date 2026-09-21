const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
  universityName: { type: String, required: true, index: true },
  country: { type: String, required: true, index: true },
  programName: { type: String, required: false },
  fieldOfStudy: { type: String, required: false, index: true },
  degreeLevel: { type: String, required: false },
  tuitionFee: { type: Number, required: false, index: true },
  intake: { type: [String], required: false },
  minIelts: { type: Number, required: false },
  scholarshipAvailable: { type: Boolean, default: false }
});

programSchema.index({ country: 1, fieldOfStudy: 1, tuitionFee: 1 });

module.exports = mongoose.model('Program', programSchema);
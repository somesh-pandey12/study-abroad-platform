const mongoose = require('mongoose');

const statusHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const applicationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program', required: true },
  intake: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Applied', 'Reviewed', 'Accepted', 'Rejected'], 
    default: 'Applied' 
  },
  statusHistory: [statusHistorySchema]
}, { timestamps: true });

applicationSchema.index({ student: 1, program: 1, intake: }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
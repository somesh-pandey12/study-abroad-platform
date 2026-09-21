const Program = require('../models/Program');
const asyncHandler = require('../utils/asyncHandler');

// Example implementations (agar aapke paas pehle se hain toh unhi ko rakhein, bas export check karein)
const getPrograms = asyncHandler(async (req, res) => {
  const programs = await Program.find({});
  res.status(200).json({ success: true, data: programs });
});

const getProgramById = asyncHandler(async (req, res) => {
  const program = await Program.findById(req.params.id);
  res.status(200).json({ success: true, data: program });
});

const searchPrograms = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: [] });
});

module.exports = {
  getPrograms,
  getProgramById,
  searchPrograms
};
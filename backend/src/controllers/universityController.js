const University = require('../models/University');
const asyncHandler = require('../utils/asyncHandler');

const getUniversities = asyncHandler(async (req, res) => {
  const universities = await University.find({});
  res.status(200).json({ success: true, data: universities });
});

const getUniversityById = asyncHandler(async (req, res) => {
  const university = await University.findById(req.params.id);
  res.status(200).json({ success: true, data: university });
});

module.exports = {
  getUniversities,
  getUniversityById
};
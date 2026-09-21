const Program = require('../models/Program');

exports.getPrograms = async (req, res, next) => {
  try {
    const { country, fieldOfStudy, degreeLevel, intake, scholarship, search, page = 1, limit = 10, sortBy = 'tuitionFee', order = 'asc' } = req.query;

    let query = {};
    if (country) query.country = country;
    if (fieldOfStudy) query.fieldOfStudy = fieldOfStudy;
    if (degreeLevel) query.degreeLevel = degreeLevel;
    if (intake) query.intake = intake;
    if (scholarship) query.scholarshipAvailable = scholarship === 'true';
    if (search) {
      query.$or = [
        { universityName: { $regex: search, $options: 'i' } },
        { programName: { $regex: search, $options: 'i' } },
        { fieldOfStudy: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOrder = order === 'desc' ? -1 : 1;
    const sortCriteria = { [sortBy]: sortOrder };

    const programs = await Program.find(query)
      .sort(sortCriteria)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Program.countDocuments(query);

    res.status(200).json({
      success: true,
      count: programs.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      data: programs
    });
  } catch (error) {
    next(error);
  }
};
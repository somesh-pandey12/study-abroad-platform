const Application = require('../models/Application');
const Program = require('../models/Program');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalPrograms = await Program.countDocuments();
    const totalApplications = await Application.countDocuments(req.user.role === 'counselor' ? {} : { student: req.user.id });

    res.status(200).json({
      success: true,
      data: {
        totalPrograms,
        totalApplications,
        role: req.user.role
      }
    });
  } catch (error) {
    next(error);
  }
};
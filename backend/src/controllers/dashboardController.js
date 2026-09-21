const Application = require('../models/Application');
const Program = require('../models/Program');

const getDashboardData = async (req, res, next) => {
  try {
    const studentId = req.user ? req.user.id : null;
    
    // Summary statistics
    const totalApplications = studentId ? await Application.countDocuments({ student: studentId }) : await Application.countDocuments({});
    const acceptedApplications = studentId ? await Application.countDocuments({ student: studentId, status: 'Accepted' }) : 0;
    const totalPrograms = await Program.countDocuments({});

    res.status(200).json({
      success: true,
      data: {
        totalApplications,
        acceptedApplications,
        totalPrograms,
        message: "Dashboard summary data retrieved successfully"
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardData
};
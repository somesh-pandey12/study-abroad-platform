const Student = require('../models/Student');
const { getRecommendationsForStudent } = require('../services/recommendationService');

exports.getRecommendations = async (req, res, next) => {
  try {
    const studentId = req.params.studentId || req.user.id;
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const recommendations = await getRecommendationsForStudent(student);

    res.status(200).json({
      success: true,
      count: recommendations.length,
      data: recommendations
    });
  } catch (error) {
    next(error);
  }
};
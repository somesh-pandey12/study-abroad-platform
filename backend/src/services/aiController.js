const Student = require('../models/Student');

exports.generateStudyPlan = async (req, res, next) => {
  try {
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const { preferredCountry, fieldOfStudy, intake, ieltsScore } = student.preferences || {};

    const aiStudyPlan = {
      targetCountry: preferredCountry || "USA / UK",
      field: fieldOfStudy || "Computer Science",
      intake: intake || "Fall 2026",
      recommendedTimeline: [
        { phase: "Months 1-3", action: "Prepare for IELTS and achieve required band score (Target: " + (ieltsScore || 7.0) + ")" },
        { phase: "Months 4-5", action: "Shortlist universities, draft SOP, and collect Letters of Recommendation" },
        { phase: "Months 6-7", action: "Submit applications and apply for scholarships" },
        { phase: "Months 8-9", action: "Receive offers, finalize university, and apply for student visa" }
      ],
      aiSuggestions: "Focus on strengthening your practical projects in " + (fieldOfStudy || "tech") + " and maintain a solid financial backup as per " + (preferredCountry || "destination") + " guidelines."
    };

    res.status(200).json({
      success: true,
      message: "AI study plan generated successfully",
      data: aiStudyPlan
    });
  } catch (error) {
    next(error);
  }
};
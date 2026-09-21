const Application = require('../models/Application');

exports.createApplication = async (req, res, next) => {
  try {
    const { programId, intake } = req.body;
    const studentId = req.user.id;

    const existingApp = await Application.findOne({ student: studentId, program: programId, intake });
    if (existingApp) {
      return res.status(400).json({ success: false, message: 'Duplicate application for this program and intake.' });
    }

    const application = await Application.create({
      student: studentId,
      program: programId,
      intake,
      status: 'Applied',
      statusHistory: [{ status: 'Applied', timestamp: new Date() }]
    });

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};

exports.getApplications = async (req, res, next) => {
  try {
    const filter = req.user.role === 'counselor' ? {} : { student: req.user.id };
    const applications = await Application.find(filter).populate('program').populate('student', '-password');
    res.status(200).json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    next(error);
  }
};

exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validTransitions = {
      'Applied': ['Reviewed', 'Rejected'],
      'Reviewed': ['Accepted', 'Rejected'],
      'Accepted': [],
      'Rejected': []
    };

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (!validTransitions[application.status].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: `Invalid status transition from ${application.status} to ${status}` 
      });
    }

    application.status = status;
    application.statusHistory.push({ status, timestamp: new Date() });
    await application.save();

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};
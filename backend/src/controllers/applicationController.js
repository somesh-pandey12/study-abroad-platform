const Application = require("../models/Application");
const Program = require("../models/Program");
const { applicationStatuses, validStatusTransitions } = require("../config/constants");
const asyncHandler = require("../utils/asyncHandler");
const HttpError = require("../utils/httpError");

const listApplications = asyncHandler(async (req, res) => {
  const { studentId, status } = req.query;
  const filters = {};

  if (studentId) {
    filters.student = studentId;
  }

  if (status) {
    filters.status = status;
  }

  const applications = await Application.find(filters)
    .populate("student", "fullName email role")
    .populate("program", "title degreeLevel tuitionFeeUsd")
    .populate("university", "name country city")
    .sort({ createdAt: -1 })
    .lean();

  res.json({
    success: true,
    data: applications,
  });
});

const createApplication = asyncHandler(async (req, res) => {
  const { student, program: programId, intake } = req.body;

  if (!student || !programId || !intake) {
    throw new HttpError(400, "student, program and intake are required.");
  }

  const program = await Program.findById(programId).lean();
  if (!program) {
    throw new HttpError(404, "Program not found.");
  }

  if (!program.intakes.includes(intake)) {
    throw new HttpError(400, `This program does not offer the '${intake}' intake.`);
  }

  // Prevent duplicate applications for the same student/program/intake.
  // The Application schema also enforces this at the DB level via a
  // unique compound index, so this is a fast, user-friendly pre-check.
  const existingApplication = await Application.findOne({
    student,
    program: programId,
    intake,
  });

  if (existingApplication) {
    throw new HttpError(
      409,
      "You have already applied to this program for this intake."
    );
  }

  try {
    const application = await Application.create({
      student,
      program: programId,
      university: program.university,
      destinationCountry: program.country,
      intake,
      status: "draft",
      timeline: [{ status: "draft", note: "Application created." }],
    });

    res.status(201).json({
      success: true,
      data: application,
    });
  } catch (error) {
    if (error.code === 11000) {
      throw new HttpError(
        409,
        "You have already applied to this program for this intake."
      );
    }
    throw error;
  }
});

const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, note } = req.body;

  if (!status || !applicationStatuses.includes(status)) {
    throw new HttpError(
      400,
      `status is required and must be one of: ${applicationStatuses.join(", ")}`
    );
  }

  const application = await Application.findById(id);
  if (!application) {
    throw new HttpError(404, "Application not found.");
  }

  const allowedNextStatuses = validStatusTransitions[application.status] || [];

  if (!allowedNextStatuses.includes(status)) {
    throw new HttpError(
      400,
      `Cannot move from '${application.status}' to '${status}'. Allowed next status(es): ${
        allowedNextStatuses.join(", ") || "none (final state)"
      }.`
    );
  }

  application.status = status;
  application.timeline.push({
    status,
    note: note || `Status changed to ${status}.`,
  });

  await application.save();

  res.json({
    success: true,
    data: application,
  });
});

module.exports = {
  createApplication,
  listApplications,
  updateApplicationStatus,
};
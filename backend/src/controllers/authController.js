const jwt = require("jsonwebtoken");

const env = require("../config/env");
const Student = require("../models/Student");
const asyncHandler = require("../utils/asyncHandler");
const HttpError = require("../utils/httpError");

function signToken(student) {
  return jwt.sign({ sub: student._id.toString() }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

function sanitizeStudent(student) {
  const plain = typeof student.toObject === "function" ? student.toObject() : { ...student };
  delete plain.password;
  return plain;
}

const register = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    password,
    targetCountries,
    interestedFields,
    preferredIntake,
    maxBudgetUsd,
    englishTest,
  } = req.body;

  if (!fullName || !email || !password) {
    throw new HttpError(400, "fullName, email and password are required.");
  }

  if (password.length < 8) {
    throw new HttpError(400, "Password must be at least 8 characters long.");
  }

  const existingStudent = await Student.findOne({ email: email.toLowerCase().trim() });
  if (existingStudent) {
    throw new HttpError(409, "An account with this email already exists.");
  }

  const student = await Student.create({
    fullName,
    email,
    password,
    targetCountries,
    interestedFields,
    preferredIntake,
    maxBudgetUsd,
    englishTest,
  });

  const token = signToken(student);

  res.status(201).json({
    success: true,
    data: {
      student: sanitizeStudent(student),
      token,
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new HttpError(400, "Email and password are required.");
  }

  const student = await Student.findOne({ email: email.toLowerCase().trim() });
  if (!student) {
    throw new HttpError(401, "Invalid email or password.");
  }

  const isPasswordValid = await student.comparePassword(password);
  if (!isPasswordValid) {
    throw new HttpError(401, "Invalid email or password.");
  }

  const token = signToken(student);

  res.json({
    success: true,
    data: {
      student: sanitizeStudent(student),
      token,
    },
  });
});

const me = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      student: req.user,
    },
  });
});

module.exports = {
  register,
  login,
  me,
};
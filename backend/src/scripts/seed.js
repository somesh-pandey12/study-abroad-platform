const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Student = require('../models/Student');
const University = require('../models/University');
const Program = require('../models/Program');
const Application = require('../models/Application');
const { students, universities, programs, applications } = require('../data/seedData');

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/waygood-assignment';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully.');

    // Clear existing data
    await Student.deleteMany({});
    await University.deleteMany({});
    await Program.deleteMany({});
    await Application.deleteMany({});

    console.log('Existing data cleared.');

    // Insert Students safely
    if (students && students.length > 0) {
      await Student.insertMany(students);
      console.log('Students seeded successfully.');
    }

    // Insert Universities safely
    if (universities && universities.length > 0) {
      await University.insertMany(universities);
      console.log('Universities seeded successfully.');
    }

    // Insert Programs safely with fallback mapping
    if (programs && programs.length > 0) {
      const formattedPrograms = programs.map((p) => ({
        universityName: p.universityName || p.university || 'Unknown University',
        country: p.country || 'Unknown',
        programName: p.programName || p.name || 'General Program',
        fieldOfStudy: p.fieldOfStudy || p.field || 'General',
        degreeLevel: p.degreeLevel || p.degree || 'Bachelors',
        tuitionFee: p.tuitionFee || p.fee || 10000,
        intake: p.intake || ['Fall'],
        minIelts: p.minIelts || p.ielts || 6.0,
        scholarshipAvailable: p.scholarshipAvailable || false
      }));
      await Program.insertMany(formattedPrograms);
      console.log('Programs seeded successfully.');
    }

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
};

seedDatabase(); 
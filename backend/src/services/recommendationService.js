const Program = require("../models/Program");
const Student = require("../models/Student");
const HttpError = require("../utils/httpError");

async function buildProgramRecommendations(studentId) {
  const student = await Student.findById(studentId).lean();

  if (!student) {
    throw new HttpError(404, "Student not found.");
  }

  const targetCountries = student.targetCountries || [];
  const interestedFields = student.interestedFields || [];
  const preferredIntake = student.preferredIntake || null;
  const maxBudgetUsd = typeof student.maxBudgetUsd === "number" ? student.maxBudgetUsd : null;
  const ieltsScore = student.englishTest?.score || 0;

  const pipeline = [
    {
      $match: {
        country: { $in: targetCountries.length ? targetCountries : ["__none__"] },
      },
    },
    {
      $addFields: {
        countryMatchScore: {
          $cond: [{ $in: ["$country", targetCountries] }, 35, 0],
        },
        fieldMatchScore: {
          $cond: [
            {
              $gt: [
                {
                  $size: {
                    $filter: {
                      input: interestedFields,
                      as: "interestedField",
                      cond: {
                        $regexMatch: {
                          input: "$field",
                          regex: "$$interestedField",
                          options: "i",
                        },
                      },
                    },
                  },
                },
                0,
              ],
            },
            30,
            0,
          ],
        },
        budgetScore: {
          $cond: [
            {
              $and: [
                { $ne: [maxBudgetUsd, null] },
                { $lte: ["$tuitionFeeUsd", maxBudgetUsd] },
              ],
            },
            20,
            0,
          ],
        },
        intakeScore: {
          $cond: [
            {
              $and: [
                { $ne: [preferredIntake, null] },
                { $in: [preferredIntake, "$intakes"] },
              ],
            },
            10,
            0,
          ],
        },
        ieltsScore: {
          $cond: [{ $lte: ["$minimumIelts", ieltsScore] }, 5, 0],
        },
      },
    },
    {
      $addFields: {
        matchScore: {
          $add: [
            "$countryMatchScore",
            "$fieldMatchScore",
            "$budgetScore",
            "$intakeScore",
            "$ieltsScore",
          ],
        },
      },
    },
    { $match: { matchScore: { $gt: 0 } } },
    { $sort: { matchScore: -1, tuitionFeeUsd: 1 } },
    { $limit: 5 },
    {
      $project: {
        title: 1,
        universityName: 1,
        university: 1,
        country: 1,
        city: 1,
        field: 1,
        degreeLevel: 1,
        tuitionFeeUsd: 1,
        intakes: 1,
        durationMonths: 1,
        minimumIelts: 1,
        scholarshipAvailable: 1,
        stem: 1,
        matchScore: 1,
        countryMatchScore: 1,
        fieldMatchScore: 1,
        budgetScore: 1,
        intakeScore: 1,
        ieltsScore: 1,
      },
    },
  ];

  const recommendations = await Program.aggregate(pipeline);

  const recommendationsWithReasons = recommendations.map((program) => {
    const reasons = [];

    if (program.countryMatchScore) reasons.push(`Preferred country match: ${program.country}`);
    if (program.fieldMatchScore) reasons.push(`Field alignment: ${program.field}`);
    if (program.budgetScore) reasons.push("Within budget range");
    if (program.intakeScore) reasons.push(`Preferred intake available: ${preferredIntake}`);
    if (program.ieltsScore) reasons.push("English test score meets requirement");

    return { ...program, reasons };
  });

  return {
    data: {
      student: {
        id: student._id,
        fullName: student.fullName,
        targetCountries,
        interestedFields,
      },
      recommendations: recommendationsWithReasons,
    },
    meta: {
      implementationStatus: "mongodb-aggregation-pipeline",
    },
  };
}

module.exports = {
  buildProgramRecommendations,
};
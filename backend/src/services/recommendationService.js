const Program = require('../models/Program');

const getRecommendationsForStudent = async (student) => {
  const { preferredCountry, budget, fieldOfStudy, intake, ieltsScore } = student.preferences || {};

  const pipeline = [
    {
      $match: {
        ...(preferredCountry && { country: preferredCountry }),
        ...(fieldOfStudy && { fieldOfStudy: fieldOfStudy }),
        ...(budget && { tuitionFee: { $lte: budget } }),
        ...(intake && { intake: intake }),
        ...(ieltsScore && { minIelts: { $lte: ieltsScore } })
      }
    },
    {
      $addFields: {
        matchScore: {
          $add: [
            { $cond: [{ $eq: ["$country", preferredCountry] }, 40, 0] },
            { $cond: [{ $eq: ["$fieldOfStudy", fieldOfStudy] }, 40, 0] },
            { $cond: [{ $lte: ["$tuitionFee", budget || 0] }, 20, 0] }
          ]
        },
        matchReason: {
          $concat: [
            "Matched based on preferred country, field of study, and budget constraints."
          ]
        }
      }
    },
    { $sort: { matchScore: -1, tuitionFee: 1 } },
    { $limit: 10 }
  ];

  let results = await Program.aggregate(pipeline);
  if (results.length === 0) {
    results = await Program.find().limit(5);
  }
  return results;
};

module.exports = { getRecommendationsForStudent };
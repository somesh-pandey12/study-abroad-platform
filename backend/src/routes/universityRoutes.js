const express = require('express');
const router = express.Router();
const { getUniversities, getUniversityById } = require('../controllers/universityController');

const safeHandler = (fn, name) => {
  if (!fn) {
    return (req, res) => res.status(500).json({ success: false, error: `Controller method ${name} is not defined` });
  }
  return fn;
};

router.get('/', safeHandler(getUniversities, 'getUniversities'));
router.get('/:id', safeHandler(getUniversityById, 'getUniversityById'));

module.exports = router;
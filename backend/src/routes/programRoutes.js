const express = require('express');
const router = express.Router();

const { 
  getPrograms, 
  getProgramById, 
  searchPrograms 
} = require('../controllers/programController');

const safeHandler = (fn, name) => {
  if (!fn) {
    return (req, res) => res.status(500).json({ success: false, error: `Controller method ${name} is not defined` });
  }
  return fn;
};

router.get('/', safeHandler(getPrograms, 'getPrograms'));
router.get('/search', safeHandler(searchPrograms, 'searchPrograms'));
router.get('/:id', safeHandler(getProgramById, 'getProgramById'));

module.exports = router;
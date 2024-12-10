const express = require('express');
const router = express.Router();
const salaryController = require('../controllers/salaryController');
const {auth} = require('../middleware/auth');

router.use(auth); // Middleware auth untuk semua route di bawah ini
router.get('/', salaryController.getAllSalaries);
router.get('/:id', salaryController.getSalaryById);
router.post('/', salaryController.createSalary);
router.put('/:id', salaryController.updateSalary);
router.delete('/:id', salaryController.deleteSalary);

module.exports = router;

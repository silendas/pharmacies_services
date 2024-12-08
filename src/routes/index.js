const express = require('express');
const router = express.Router();

const customerRoutes = require('./customerRoutes');
const employeeRoutes = require('./employeeRoutes');
const userRoutes = require('./userRoutes');
const roleRoutes = require('./roleRoutes');
const paymentRoutes = require('./paymentRoutes');
const cartRoutes = require('./cartRoutes');
const salaryRoutes = require('./salaryRoutes');
const inventoryRoutes = require('./inventoryRoutes');
const auth = require('../middleware/auth');

// Routes untuk setiap tabel
router.use('/customers', auth, customerRoutes);
router.use('/employees', auth, employeeRoutes);
router.use('/users', auth,userRoutes);
router.use('/roles', auth, roleRoutes);
router.use('/payments', auth, paymentRoutes);
router.use('/carts', auth, cartRoutes);
router.use('/salaries', auth, salaryRoutes);
router.use('/inventories', auth, inventoryRoutes);

module.exports = router;

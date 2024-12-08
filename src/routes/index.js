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

// Routes untuk setiap tabel
router.use('/customers', customerRoutes);
router.use('/employees', employeeRoutes);
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/payments', paymentRoutes);
router.use('/carts', cartRoutes);
router.use('/salaries', salaryRoutes);
router.use('/inventories', inventoryRoutes);

module.exports = router;

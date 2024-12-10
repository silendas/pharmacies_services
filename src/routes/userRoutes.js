const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, checkAdmin } = require('../middleware/auth');

// Public routes
router.post('/login', userController.login);

// Protected routes
router.use(auth);

// Admin only routes
router.get('/users', auth, checkAdmin, userController.getAllUsers);
router.get('/users/:id', auth, checkAdmin, userController.getUserById);
router.post('/users', auth, checkAdmin, userController.createUser);
router.put('/users/:id', auth, checkAdmin, userController.updateUser);
router.delete('/users/:id', auth, checkAdmin, userController.deleteUser);

// Regular authenticated routes
router.post('/logout', userController.logout);

module.exports = router;
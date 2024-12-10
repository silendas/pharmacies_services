const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, checkAdmin } = require('../middleware/auth');

// Public routes
router.post('/login', userController.login);

// Protected routes
router.use(auth);
// Admin only routes
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

// Regular authenticated routes
router.post('/logout', userController.logout);

module.exports = router;
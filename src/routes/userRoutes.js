const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, checkAdmin } = require('../middleware/auth');

// Public routes
router.post('/login', userController.login);

// Protected routes
router.use(auth);
router.use(checkAdmin);
// Admin only routes
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

// Regular authenticated routes
router.post('/logout', userController.logout);

module.exports = router;
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Public routes
router.post('/login', userController.login);

// Protected routes
router.use(auth); // Middleware auth untuk semua route di bawah ini
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);
router.post('/logout', userController.logout);

module.exports = router;

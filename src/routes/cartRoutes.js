const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const {auth} = require('../middleware/auth');

router.use(auth);
router.get('/', cartController.getAllCarts);
router.get('/:id', cartController.getCartById);
router.post('/', cartController.createCart);
router.put('/:id', cartController.updateCart);
router.delete('/:id', cartController.deleteCart);

module.exports = router;

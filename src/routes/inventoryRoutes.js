const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const {auth} = require('../middleware/auth');

router.use(auth);
router.get('/', inventoryController.getAllInventories);
router.get('/:id', inventoryController.getInventoryById);
router.post('/', inventoryController.createInventory);
router.put('/:id', inventoryController.updateInventory);
router.delete('/:id', inventoryController.deleteInventory);

module.exports = router;

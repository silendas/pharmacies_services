const { Payment, Employee, Customer, Cart, Inventory } = require("../models");
const { sequelize } = require("../models");

const paymentController = {
  getAllPayments: async (req, res) => {
    try {
      const payments = await Payment.findAll({
        include: [
          {
            model: Employee,
            attributes: ["id", "name", "phone"],
          },
          {
            model: Customer,
            attributes: ["id", "name", "phone", "address"],
          },
          {
            model: Cart,
            as: "carts", // Alias untuk Cart
            include: [
              {
                model: Inventory,
                as: 'Inventory', // Tambahkan alias di sini
                attributes: ["id", "name", "price", "stock"],
              },
            ],
            attributes: ['id', 'qty', [sequelize.literal('qty * `carts->Inventory`.`price`'), 'total_price']],
          },
        ],
      });      
      res.json(payments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getPaymentById: async (req, res) => {
    try {
      const payment = await Payment.findByPk(req.params.id, {
        include: [
          {
            model: Employee,
            attributes: ["id", "name", "phone"],
          },
          {
            model: Customer,
            attributes: ["id", "name", "phone", "address"],
          },
          {
            model: Cart,
            as: "carts", // Tambahkan alias sesuai definisi di model
            include: [
              {
                model: Inventory,
                attributes: ["id", "name", "price", "stock"],
              },
            ],
          },
        ],
      });      
      if (payment) {
        res.json(payment);
      } else {
        res.status(404).json({ message: "Pembayaran tidak ditemukan" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createPayment: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const { customer_id, employee_id, date, carts } = req.body;

      // Create Payment
      const payment = await Payment.create(
        { customer_id, employee_id, date },
        { transaction }
      );

      // Process Cart
      for (const cartItem of carts) {
        const { kode, qty } = cartItem;

        // Get Inventory by Kode
        const inventory = await Inventory.findOne({
          where: { kode },
          transaction,
        });
        if (!inventory || inventory.stock < qty) {
          throw new Error(`Stok tidak cukup untuk item dengan kode ${kode}`);
        }

        // Deduct Inventory Stock
        await inventory.update(
          { stock: inventory.stock - qty },
          { transaction }
        );

        // Create Cart Entry
        await Cart.create(
          { payment_id: payment.id, inventory_id: inventory.id, qty },
          { transaction }
        );
      }

      await transaction.commit();
      res.status(201).json(payment);
    } catch (error) {
      await transaction.rollback();
      res.status(400).json({ message: error.message });
    }
  },

  updatePayment: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const payment = await Payment.findByPk(req.params.id, { transaction });
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }

      const { customer_id, employee_id, date, carts } = req.body;

      // Update Payment
      await payment.update({ customer_id, employee_id, date }, { transaction });

      // Clear existing carts for this payment
      await Cart.destroy({ where: { payment_id: payment.id }, transaction });

      // Process new carts
      for (const cartItem of carts) {
        const { kode, qty } = cartItem;

        // Get Inventory by Kode
        const inventory = await Inventory.findOne({
          where: { kode },
          transaction,
        });
        if (!inventory || inventory.stock < qty) {
          throw new Error(`Stok tidak cukup untuk item dengan kode ${kode}`);
        }

        // Deduct Inventory Stock
        await inventory.update(
          { stock: inventory.stock - qty },
          { transaction }
        );

        // Create Cart Entry
        await Cart.create(
          { payment_id: payment.id, inventory_id: inventory.id, qty },
          { transaction }
        );
      }

      await transaction.commit();
      res.json(payment);
    } catch (error) {
      await transaction.rollback();
      res.status(400).json({ message: error.message });
    }
  },

  deletePayment: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const payment = await Payment.findByPk(req.params.id, { transaction });
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }

      // Restore stock for carts
      const carts = await Cart.findAll({
        where: { payment_id: payment.id },
        transaction,
      });
      for (const cart of carts) {
        const inventory = await Inventory.findByPk(cart.inventory_id, {
          transaction,
        });
        if (inventory) {
          await inventory.update(
            { stock: inventory.stock + cart.qty },
            { transaction }
          );
        }
      }

      // Delete carts and payment
      await Cart.destroy({ where: { payment_id: payment.id }, transaction });
      await payment.destroy({ transaction });

      await transaction.commit();
      res.json({ message: "Payment deleted" });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = paymentController;

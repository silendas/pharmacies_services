const { Payment, Employee, Customer, Cart, Inventory, sequelize } = require('../models');

module.exports = {
  // Endpoint untuk mendapatkan semua pembayaran
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
            as: "carts",
            include: [
              {
                model: Inventory,
                as: "Inventory",
                attributes: ["id", "kode", "name", "price", "stock"],
              },
            ],
            attributes: [
              "id",
              "qty",
              [sequelize.literal("qty * `carts->Inventory`.`price`"), "total_price"],
            ],
          },
        ],
        attributes: {
          include: [
            ["id", "transaction_id"],
            [
              sequelize.literal(`CONCAT('S-', LPAD(Payment.id, 5, '0'))`),
              "receipt_code",
            ],
          ],
        },
      });

      if (!payments) {
        return res.status(404).json({ message: "Pembayaran tidak ditemukan." });
      }

      const paymentsWithTotalPrice = payments.map((payment) => {
        const carts = payment.carts || [];
        const totalPrice = carts.reduce((sum, cart) => {
          return sum + cart.qty * (cart.Inventory?.price || 0);
        }, 0);

        return {
          ...payment.toJSON(),
          total_price: totalPrice,
        };
      });

      res.json(paymentsWithTotalPrice);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Endpoint untuk mendapatkan pembayaran berdasarkan ID
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
            as: "carts",
            include: [
              {
                model: Inventory,
                as: "Inventory",
                attributes: ["id", "kode", "name", "price", "stock"],
              },
            ],
            attributes: [
              "id",
              "qty",
              [sequelize.literal("qty * `carts->Inventory`.`price`"), "total_price"],
            ],
          },
        ],
        attributes: {
          include: [
            ["id", "transaction_id"],
            [
              sequelize.literal(`CONCAT('S-', LPAD(Payment.id, 5, '0'))`),
              "receipt_code",
            ],
          ],
        },
      });

      if (!payment) {
        return res.status(404).json({ message: "Pembayaran tidak ditemukan." });
      }

      const carts = payment.carts || [];
      const totalPrice = carts.reduce((sum, cart) => {
        return sum + cart.qty * (cart.Inventory?.price || 0);
      }, 0);

      res.json({ ...payment.toJSON(), total_price: totalPrice });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createPayment: async (req, res) => {
    const t = await sequelize.transaction();
    
    try {
      const { customer_id, employee_id, date, carts } = req.body;
      
      // Validate required fields
      if (!customer_id || !employee_id || !date || !carts) {
        return res.status(400).json({ 
          message: "customer_id, employee_id, date, dan carts harus diisi" 
        });
      }
  
      const newPayment = await Payment.create({
        customer_id,
        employee_id,
        date,
      }, { transaction: t });
  
      if (carts && Array.isArray(carts)) {
        for (const cart of carts) {
          const inventory = await Inventory.findOne({ 
            where: { kode: cart.kode },
            transaction: t
          });
          
          if (!inventory) {
            await t.rollback();
            return res.status(400).json({ 
              message: `Inventori dengan kode ${cart.kode} tidak ditemukan.` 
            });
          }
  
          // Check stock availability
          if (inventory.stock < cart.qty) {
            await t.rollback();
            return res.status(400).json({
              message: `Stok tidak mencukupi untuk produk ${inventory.name}`
            });
          }
  
          await Cart.create({
            payment_id: newPayment.id,
            inventory_id: inventory.id,
            kode: cart.kode,
            qty: cart.qty,
          }, { transaction: t });
  
          // Update inventory stock
          await inventory.decrement('stock', { 
            by: cart.qty,
            transaction: t 
          });
        }
      }
  
      await t.commit();
  
      // Get complete payment data with total
      const completePayment = await Payment.findByPk(newPayment.id, {
        include: [{
          model: Cart,
          as: "carts",
          include: [{
            model: Inventory,
            as: "Inventory",
            attributes: ["price"]
          }]
        }]
      });
  
      const totalPrice = completePayment.carts.reduce((sum, cart) => {
        return sum + cart.qty * (cart.Inventory?.price || 0);
      }, 0);
  
      res.status(201).json({
        message: "Pembayaran berhasil dibuat",
        payment: {
          ...completePayment.toJSON(),
          total_price: totalPrice,
        }
      });
      
    } catch (error) {
      await t.rollback();
      res.status(500).json({ message: error.message });
    }
  },  


  // Endpoint untuk memperbarui pembayaran berdasarkan ID
  updatePayment: async (req, res) => {
    try {
      const payment = await Payment.findByPk(req.params.id);
      if (!payment) {
        return res.status(404).json({ message: "Pembayaran tidak ditemukan." });
      }

      const { customer_id, employee_id, date } = req.body;
      payment.customer_id = customer_id || payment.customer_id;
      payment.employee_id = employee_id || payment.employee_id;
      payment.date = date || payment.date;
      await payment.save();

      res.json({ message: "Pembayaran berhasil diperbarui", payment });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Endpoint untuk menghapus pembayaran berdasarkan ID
  deletePayment: async (req, res) => {
    try {
      const payment = await Payment.findByPk(req.params.id);
      if (!payment) {
        return res.status(404).json({ message: "Pembayaran tidak ditemukan." });
      }

      await payment.destroy();
      res.json({ message: "Pembayaran berhasil dihapus." });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

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
              [sequelize.literal('qty * "carts->Inventory"."price"'), "total_price"],
            ],
          },
        ],
        attributes: {
          include: [
            ["id", "transaction_id"],
            [
              sequelize.literal(`CONCAT('S-', LPAD(CAST("Payment"."id" AS VARCHAR), 5, '0'))`),
              "receipt_code"
            ]
            ,
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
              [sequelize.literal('qty * "carts->Inventory"."price"'), "total_price"],
            ],
          },
        ],
        attributes: {
          include: [
            ["id", "transaction_id"],
            [
              sequelize.literal(`CONCAT('S-', LPAD(CAST("Payment"."id" AS VARCHAR), 5, '0'))`),
              "receipt_code"
            ]
            ,
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
      
        if (!employee_id) {
          return res.status(400).json({ 
            status: 'error',
            code: 'MISSING_EMPLOYEE_ID',
            message: "employee_id is required"
          });
        }

        if (!date) {
          return res.status(400).json({ 
            status: 'error',
            code: 'MISSING_DATE',
            message: "date is required"
          });
        }

        if (!carts || !Array.isArray(carts) || carts.length === 0) {
          return res.status(400).json({ 
            status: 'error',
            code: 'INVALID_CART_DATA',
            message: "carts must be a non-empty array"
          });
        }

        const newPayment = await Payment.create({
          customer_id,
          employee_id,
          date,
        }, { transaction: t });
  
        for (const cart of carts) {
          const inventory = await Inventory.findOne({ 
            where: { kode: cart.kode },
            transaction: t
          });
          
          if (!inventory) {
            await t.rollback();
            return res.status(404).json({ 
              status: 'error',
              code: 'INVENTORY_NOT_FOUND',
              message: `Product with code ${cart.kode} not found`,
              details: { providedCode: cart.kode }
            });
          }
  
          if (inventory.stock < cart.qty) {
            await t.rollback();
            return res.status(400).json({
              status: 'error',
              code: 'INSUFFICIENT_STOCK',
              message: `Insufficient stock for product ${inventory.name}`,
              details: {
                productName: inventory.name,
                requestedQty: cart.qty,
                availableStock: inventory.stock
              }
            });
          }

          await Cart.create({
            payment_id: newPayment.id,
            inventory_id: inventory.id,
            kode: cart.kode,
            qty: cart.qty,
          }, { transaction: t });
  
          await inventory.decrement('stock', { 
            by: cart.qty,
            transaction: t 
          });
        }
  
        await t.commit();
  
        const completePayment = await Payment.findByPk(newPayment.id, {
          include: [{
            model: Cart,
            as: "carts",
            include: [{
              model: Inventory,
              as: "Inventory",
              attributes: ["id", "kode", "name", "price", "stock"]
            }]
          }]
        });
  
        const totalPrice = completePayment.carts.reduce((sum, cart) => {
          return sum + cart.qty * (cart.Inventory?.price || 0);
        }, 0);
  
        res.status(201).json({
          status: 'success',
          message: "Payment created successfully",
          data: {
            payment: {
              ...completePayment.toJSON(),
              total_price: totalPrice,
            }
          }
        });
      
      } catch (error) {
        await t.rollback();
        res.status(500).json({ 
          status: 'error',
          code: 'SERVER_ERROR',
          message: "An error occurred while processing the payment",
          details: {
            error: error.message,
            type: error.name,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
          }
        });
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

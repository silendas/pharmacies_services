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
  try {
    const { customer_id, employee_id, date, carts } = req.body;
    const newPayment = await Payment.create({
      customer_id,
      employee_id,
      date,
    });

    // Simpan data cart yang terkait dengan pembayaran
    if (carts && Array.isArray(carts)) {
      for (const cart of carts) {
        // Validasi apakah kode valid di tabel Inventory
        const inventory = await Inventory.findOne({ where: { kode: cart.kode } });
        if (!inventory) {
          return res.status(400).json({ message: `Inventori dengan kode ${cart.kode} tidak ditemukan.` });
        }

        await Cart.create({
          payment_id: newPayment.id,
          inventory_id: inventory.id, // Menggunakan ID dari inventory yang ditemukan
          kode: cart.kode, // Simpan kode untuk referensi
          qty: cart.qty,
        });
      }
    }

    // Hitung total harga setelah data cart disimpan
    const cartsInPayment = await Cart.findAll({
      where: { payment_id: newPayment.id },
      include: [
        {
          model: Inventory,
          as: "Inventory",
          attributes: ["price"],
        },
      ],
    });

    const totalPrice = cartsInPayment.reduce((sum, cart) => {
      return sum + cart.qty * (cart.Inventory?.price || 0);
    }, 0);

    res.status(201).json({
      message: "Pembayaran berhasil dibuat",
      payment: {
        ...newPayment.toJSON(),
        total_price: totalPrice,
      },
    });
  } catch (error) {
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

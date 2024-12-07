'use strict';
const { Model, DataTypes, Sequelize } = require('sequelize');

module.exports = (sequelize) => {
  const Payment = sequelize.define(
    'Payment',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      kode_struk: {
        type: DataTypes.STRING,
      },
      customer_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'customers',
          key: 'id',
        },
        allowNull: true,
      },
      employee_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'employees',
          key: 'id',
        },
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      total_price: {
        type: DataTypes.VIRTUAL,
        get() {
          if (this.Carts) {
            return this.Carts.reduce(
              (total, cart) =>
                total + (cart.qty * (cart.Inventory?.price || 0)),
              0
            );
          }
          return 0;
        },
      },
    },
    {
      sequelize,
      modelName: 'Payment',
      tableName: 'payments',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  // Hook to generate kode_struk
  Payment.beforeCreate(async (payment, options) => {
    const latestPayment = await Payment.findOne({
      order: [['id', 'DESC']],
    });

    // Generate new kode_struk
    const nextNumber = latestPayment ? latestPayment.id + 1 : 1;
    payment.kode_struk = `S-${String(nextNumber).padStart(4, '0')}`;
  });

  Payment.associate = (models) => {
    Payment.belongsTo(models.Customer, { foreignKey: 'customer_id', as: 'Customer' });
    Payment.belongsTo(models.Employee, { foreignKey: 'employee_id', as: 'Employee' });
    Payment.hasMany(models.Cart, { foreignKey: 'payment_id', as: 'Carts' });
  };

  return Payment;
};

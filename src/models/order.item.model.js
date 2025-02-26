// src/models/orderItem.model.js
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class OrderItems extends Model {
        static associate(models) {
            OrderItems.belongsTo(models.Orders, { foreignKey: 'orderId', as: 'order' });
            OrderItems.belongsTo(models.Products, { foreignKey: 'productId', as: 'product' });
        }
    }

    OrderItems.init(
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            orderId: {
                type: DataTypes.BIGINT,
                field: 'order_id',
                allowNull: false
            },
            productId: {
                type: DataTypes.BIGINT,
                field: 'product_id',
                allowNull: false
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            price: {
                type: DataTypes.REAL,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'OrderItems',
            tableName: 'order_items',
            schema: 'e_commerce',
            timestamps: true
        }
    );
    OrderItems.sync({ force: false })
        .then(() => {
        })
        .catch((error) => {
            console.error('Error creating user table:', error);
        });

    return OrderItems;
};
const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Cart extends Model {
        static associate(models) {
            Cart.belongsTo(models.Users, { foreignKey: 'userId' });
            Cart.belongsTo(models.Products, { foreignKey: 'productId', as: 'product' });
        }
    }

    Cart.init({
        id: {
            type: DataTypes.BIGINT,
            field: 'cart_id',
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.BIGINT,
            field: 'user_id',
            allowNull: false
        },
        productId: {
            type: DataTypes.BIGINT,
            field: 'product_id',
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            field: 'quantity',
            allowNull: false,
            defaultValue: 1
        },
        price: {
            type: DataTypes.REAL,
            field: 'price',
            allowNull: false,
            comment: 'Product price at the time of adding to cart'
        }
    }, {
        sequelize,
        modelName: 'Cart',
        schema: 'e_commerce',
        tableName: 'cart',
        timestamps: true
    });

    Cart.sync({ force: false })
        .then(() => {
        })
        .catch((error) => {
            console.error('Error creating user table:', error);
        });

    return Cart;
};
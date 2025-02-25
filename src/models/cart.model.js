const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Cart extends Model {
        static associate(models) {
            Cart.belongsTo(models.Users, { foreignKey: 'userId' });
            Cart.belongsTo(models.Products, { foreignKey: 'productId' });
        }
    }

    Cart.init({
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        productId: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        price: {
            type: DataTypes.REAL,
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
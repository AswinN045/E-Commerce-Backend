const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Orders extends Model {
        static associate(models) {
            Orders.belongsTo(models.Users, { foreignKey: 'userId', as: 'users' });
            Orders.hasMany(models.OrderItems, { foreignKey: 'orderId', as: 'items' });
        }
    }

    Orders.init(
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            userId: {
                type: DataTypes.BIGINT,
                field: 'user_id',
                allowNull: false
            },
            total: {
                type: DataTypes.REAL,
                allowNull: false
            },
            status: {
                type: DataTypes.STRING,
                defaultValue: 'pending',
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'Orders',
            tableName: 'orders',
            schema: 'e_commerce',
            timestamps: true,
            paranoid: true
        }
    );
    Orders.sync({ force: false })
        .then(() => {
        })
        .catch((error) => {
            console.error('Error creating user table:', error);
        });

    return Orders;
};
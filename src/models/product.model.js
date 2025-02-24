const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Products extends Model {
        static associate(models) {
            Products.belongsTo(models.Categories, {
                foreignKey: 'id',
                as: 'products'
            });
        }
    }
    Products.init(
        {
            id: {
                type: DataTypes.BIGINT,
                field: "id",
                primaryKey: true,
                unique: true,
                allowNull: false,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                field: 'name',
                allowNull: false
            },
            description: {
                type: DataTypes.STRING,
                field: 'description'
            },
            price: {
                type: DataTypes.REAL,
                field: 'price',
                allowNull: false
            },
            stock: {
                type: DataTypes.BIGINT,
                field: 'stock',
                allowNull: false
            },
            categoryId: {
                type: DataTypes.BIGINT,
                field: 'category_id',
                allowNull: false
            },
            imageUrl: {
                type: DataTypes.STRING,
                field: 'image',
                allowNull: false
            },
            uId: {
                type: DataTypes.UUID,
                field: "u_id",
                defaultValue: Sequelize.UUIDV4,
                unique: true,
            }
        },
        {
            sequelize,
            modelName: 'Products',
            schema: 'e_commerce',
            tableName: 'products',
            freezeTableName: true,
            paranoid: true,
            timestamps: false
        }
    );

    Products.sync({ force: true })
        .then(() => {
        })
        .catch((error) => {
            console.error('Error creating user table:', error);
        });

    return Products;
};
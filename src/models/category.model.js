const { Model, Sequelize } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
    class Categories extends Model {
        static associate(models) {
            Categories.hasMany(models.Products, {
                foreignKey: 'categoryId',
                as: 'products'
            });
        }
    }

    Categories.init(
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: { msg: 'Category name cannot be empty' }
                }
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true
            }
        },
        {
            sequelize,
            modelName: 'Categories',
            tableName: 'categories',
            schema: 'e_commerce',
            timestamps: true,
            paranoid: true
        }
    );
    Categories.sync({ force: false })
        .then(() => {
        })
        .catch((error) => {
            console.error('Error creating user table:', error);
        });

    return Categories;
};
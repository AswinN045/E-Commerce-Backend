const { Model, Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {

    validPassword(password) {
      return bcrypt.compareSync(password, this.password);
    }
  }
  Users.init(
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
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      role: {
        type: DataTypes.ENUM("Admin", "Customer"),
        allowNull: false,
        defaultValue: "Customer"
      },
      uUserId: {
        type: DataTypes.UUID,
        field: "u_user_id",
        defaultValue: Sequelize.UUIDV4,
        unique: true,
      }
    },
    {
      sequelize,
      modelName: 'Users',
      schema: 'e_commerce',
      tableName: 'users',
      freezeTableName: true,
      paranoid: true,
      timestamps: false,
      hooks: {
        beforeCreate: async (user) => {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        },
        beforeUpdate: async (user) => {
          if (user.changed('password')) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        }
      }
    }
  );

  Users.sync({ force: false })
    .then(() => {
    })
    .catch((error) => {
      console.error('Error creating user table:', error);
    });

  return Users;
};
import { DataTypes } from "sequelize";
import bcrypt from 'bcrypt'
import { randomUUID } from "crypto";
import { sequelize } from "../../utils/database.js";
import { logger } from "../../utils/logger.js";

export const User = sequelize.define(
  "User",
  {
    userId: {
      type: DataTypes.UUID,
      defaultValue: () => randomUUID(),
      primaryKey: true,
      allowNull: false,
    },

    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: false }
);



/**
 * Hashes the user's password before creating a new user record.
 * This hook is executed automatically before a new user record is created.
 * It ensures the password is securely stored by hashing it with bcrypt.
 */
User.beforeCreate(async function (user, options) {
  try {
    user.password = await bcrypt.hash(user.password, 10);
  } catch (err) {
    logger.error(err.stack);
  }
});
import { DataTypes } from "sequelize";
import { sequelize } from "../../utils/database.js";
import { randomUUID } from "crypto";
import { User } from "../auth/model.js";

export const Organisation = sequelize.define(
  "Organisation",
  {
    orgId: {
      type: DataTypes.UUID,
      defaultValue: () => randomUUID(),
      primaryKey: true,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { timestamps: false }
);

export const UserOrganisation = sequelize.define(
  "UserOrganisation",
  {
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    orgId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  { timestamps: false }
);

User.belongsToMany(Organisation, {
  foreignKey: "userId",
  through: UserOrganisation,
  onDelete: "CASCADE",
});
Organisation.belongsToMany(User, {
  foreignKey: "orgId",
  through: UserOrganisation,
  onDelete: "CASCADE",
});

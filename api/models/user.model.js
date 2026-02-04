import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelize.client.js";

export class User extends Model {}

User.init({
  username: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },

  password: {
    type: DataTypes.TEXT,
    allowNull: false,
    
  }
}, {
  sequelize,
  tableName: "user"
});

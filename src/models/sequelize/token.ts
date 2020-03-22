import { Sequelize, Model, DataTypes, Association } from 'sequelize';

import User from './user';
import logger from 'src/src/utils/logger';

export default class Token extends Model {
  public id!: number;
  public userId!: number;
  public jwt!: string;
  public expired!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly user?: User;
  public static associations: {
    user: Association<User, Token>;
  };
}

export const initModel = (sequelize: Sequelize) => {
  const config = {
    tableName: 'tokens',
    sequelize,
  };

  Token.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    jwt: {
      type: new DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    expired: {
      type: new DataTypes.DATE,
      allowNull: true,
    },
  },
    config,
  );

  // Token.belongsTo(User, { keyType: 'userId', targetKey: 'id' });
  // Token.belongsTo(User, { foreignKey: 'userId', as: 'user', });
  // Token.belongsTo(User);
  // try {
  //   Token.belongsTo(User, { keyType: 'userId', targetKey: 'id' });
  // } catch (error) {
  //   console.log(error);
  // }



  // We save the return values of the association setup calls to use them later
  // Product.User = Product.belongsTo(User);
  // User.Addresses = User.hasMany(Address);
};

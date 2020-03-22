import bcrypt from 'bcrypt';
import {
  Sequelize,
  Model,
  DataTypes,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyHasAssociationMixin,
  Association,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin
} from 'sequelize';

import Token from './token';


export default class User extends Model {
  public id!: number;
  public email!: string;
  public screenName!: string | null;
  public firstName!: string | null;
  public lastName!: string | null;
  public passwordHash!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getTokens!: HasManyGetAssociationsMixin<Token>;
  public addTokens!: HasManyAddAssociationMixin<Token, number>;
  public hasTokens!: HasManyHasAssociationMixin<Token, number>;
  public countTokens!: HasManyCountAssociationsMixin;
  public createToken!: HasManyCreateAssociationMixin<Token>;

  public readonly tokens?: Token[];
  public static associations: {
    tokens: Association<User, Token>;
  };

  public verifyPassword: (password: string) => boolean;
  public generateHash: (password: string) => string;
}

export const initModel = (sequelize: Sequelize) => {
  const config = {
    tableName: 'users',
    sequelize,
  };

  User.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    email: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },

    screenName: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },

    avatar: {
      type: new DataTypes.STRING(512),
      allowNull: true,
    },

    firstName: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },

    lastName: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },

    passwordHash: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
  },
    config,
  );

  User.hasMany(Token, {
    sourceKey: 'id',
    foreignKey: 'userId',
    as: 'tokens',
  });

  Token.belongsTo(User, { keyType: 'userId', targetKey: 'id' });
};

User.prototype.verifyPassword = function (password: string) {
  return bcrypt.compareSync(password, this.password);
};

User.prototype.generateHash = function (password: string) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

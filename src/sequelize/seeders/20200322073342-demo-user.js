'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [{
      email: 'example@example.com',
      screenName: 'DemoUser',
      avatar: 'https://avatars3.githubusercontent.com/u/37445718?s=460&u=539b5ab149f390b8d1334a1e982ecc36e68bcaab&v=4',
      firstName: 'John',
      lastName: 'Doe',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};

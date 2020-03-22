'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('tokens', [{
      jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImV4YW1wbGVAZXhhbXBsZS5jb20iLCJzY3JlZW5OYW1lIjoiRGVtb1VzZXIiLCJleHBpcmVkIjoxNTg0ODc5MDAwMDAwfQ.hUQsMm4ijbzRJqFpU2foBHBbaIjFyXGlBSrHtKD2Svs',
      userId: 1,
      expired: new Date(1584879000000),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImV4YW1wbGVAZXhhbXBsZS5jb20iLCJzY3JlZW5OYW1lIjoiRGVtb1VzZXIiLCJleHBpcmVkIjoxNTg0ODc5MDAwMDAwfQ.hUQsMm4ijbzRJqFpU2foBHBbaIjFyXGlBSrHtKD2Svs',
      userId: 1,
      expired: new Date(1584879000000),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('tokens', null, {});
  }
};

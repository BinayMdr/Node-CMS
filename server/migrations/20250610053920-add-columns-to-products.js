'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Products', 'model_id', {
      type: Sequelize.STRING,
      allowNull: true,
    },{
      after:'id'
    });
    await queryInterface.addColumn('Products', 'image', {
      type: Sequelize.STRING,
      allowNull: true,
    },{
      after:'name'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Products', 'model_id');
    await queryInterface.removeColumn('Products', 'image');
  }
};

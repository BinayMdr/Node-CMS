'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Offers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      offer_type: {
        type: Sequelize.STRING
      },
      offer_on: {
        type: Sequelize.STRING
      },
      offer_on_amount: {
        type: Sequelize.STRING
      },
      offer_on_product: {
        type: Sequelize.STRING
      },
      offer_on_quantity: {
        type: Sequelize.INTEGER
      },
      offer_on_amount: {
        type: Sequelize.INTEGER
      },
      discount_off: {
        type: Sequelize.FLOAT
      },
      amount_off: {
        type: Sequelize.INTEGER
      },
      is_enabled:{
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Offers');
  }
};
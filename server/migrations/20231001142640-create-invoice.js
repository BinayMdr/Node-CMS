'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Invoices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      invoice_number: {
        type: Sequelize.STRING
      },
      customer_id: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      customer_name: {
        allowNull: true,
        type: Sequelize.STRING
      },
      sub_total: {
        type: Sequelize.STRING
      },
      discount_percent: {
        type: Sequelize.STRING
      },
      discount_amount: {
        type: Sequelize.STRING
      },
      total: {
        type: Sequelize.STRING
      },
      received_amount: {
        type: Sequelize.STRING
      },
      changed_amount: {
        type: Sequelize.STRING
      },
      payment_method_id: {
        type: Sequelize.INTEGER
      },
      prepared_by_id: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.STRING
      },
      branch_id: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Invoices');
  }
};
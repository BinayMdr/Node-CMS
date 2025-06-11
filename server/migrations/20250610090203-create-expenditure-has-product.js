'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ExpenditureHasProducts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      expendtiure_id: {
        type: Sequelize.INTEGER
      },
      name:{
        type: Sequelize.STRING,
        allowNull: true
      },
      is_product:{
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      product_id:{
        type:Sequelize.INTEGER,
        allowNull:true
      },
      product_has_variation_id:{
        type:Sequelize.INTEGER,
        allowNull:true
      },
      quantity:{
        type:Sequelize.INTEGER,
        allowNull:true
      },
      cost:{
        type:Sequelize.FLOAT,
        allowNull:true
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
    await queryInterface.dropTable('Expenditures');
  }
};
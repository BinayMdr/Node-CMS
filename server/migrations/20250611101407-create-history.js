module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Histories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      product_has_variation_id: {
        type: Sequelize.INTEGER
      },
      previous_quantity:{
        type: Sequelize.INTEGER
      },
      new_quantity:{
        type: Sequelize.INTEGER
      },
      transaction_type:{
        type: Sequelize.STRING
      },
      transaction_id:{
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
    await queryInterface.dropTable('Histories');
  }
};
'use strict'

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  const tableInfo = await queryInterface.describeTable('releases')
  if (!tableInfo.release_type) {
    await queryInterface.addColumn('releases', 'release_type', {
      type: Sequelize.ENUM('Album', 'EP', 'Single', 'V.A'),
      allowNull: false,
    })
  }
}
export async function down(queryInterface, Sequelize) {
  const tableInfo = await queryInterface.describeTable('releases')
  if (tableInfo.release_type) {
    await queryInterface.removeColumn('releases', 'release_type')
  }
}

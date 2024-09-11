'use strict'

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  const tableInfo = await queryInterface.describeTable('artists')
  if (tableInfo.created_at) {
    await queryInterface.renameColumn('artists', 'created_at', 'createdAt')
  }
  if (tableInfo.updated_at) {
    await queryInterface.renameColumn('artists', 'updated_at', 'updatedAt')
  }
}
export async function down(queryInterface, Sequelize) {
  const tableInfo = await queryInterface.describeTable('artists')
  if (tableInfo.createdAt) {
    await queryInterface.renameColumn('artists', 'createdAt', 'created_at')
  }
  if (tableInfo.updatedAt) {
    await queryInterface.renameColumn('artists', 'updatedAt', 'updated_at')
  }
}

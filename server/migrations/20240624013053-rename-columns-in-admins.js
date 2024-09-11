'use strict'

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  const tableInfo = await queryInterface.describeTable('admins')
  if (tableInfo.created_at) {
    await queryInterface.renameColumn('admins', 'created_at', 'createdAt')
  }
  if (tableInfo.updated_at) {
    await queryInterface.renameColumn('admins', 'updated_at', 'updatedAt')
  }
}
export async function down(queryInterface, Sequelize) {
  const tableInfo = await queryInterface.describeTable('admins')
  if (tableInfo.createdAt) {
    await queryInterface.renameColumn('admins', 'createdAt', 'created_at')
  }
  if (tableInfo.updatedAt) {
    await queryInterface.renameColumn('admins', 'updatedAt', 'updated_at')
  }
}

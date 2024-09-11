'use strict'

export async function up(queryInterface, Sequelize) {
  const tableInfo = await queryInterface.describeTable('users')
  if (tableInfo.created_at) {
    await queryInterface.removeColumn('users', 'created_at')
  }
  if (tableInfo.updated_at) {
    await queryInterface.removeColumn('users', 'updated_at')
  }
}
export async function down(queryInterface, Sequelize) {
  const tableInfo = await queryInterface.describeTable('users')
  if (!tableInfo.created_at) {
    await queryInterface.addColumn('users', 'created_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    })
  }
  if (!tableInfo.updated_at) {
    await queryInterface.addColumn('users', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    })
  }
}

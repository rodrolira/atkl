"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("artists", "role", {
    type: Sequelize.ENUM("Dj", "Producer"),
    allowNull: true,
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn("artists", "role");
}

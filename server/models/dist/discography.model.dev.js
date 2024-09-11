"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _sequelize = require("sequelize");

var _sequelize2 = _interopRequireDefault(require("../db/sequelize.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// models/discography.js
var Discography = _sequelize2["default"].define('Discography', {
  title: {
    type: _sequelize.DataTypes.STRING,
    allowNull: true,
    field: 'title' // nombre de la columna en la base de datos

  },
  artist: {
    type: _sequelize.DataTypes.STRING,
    allowNull: true,
    field: 'artist' // nombre de la columna en la base de datos

  },
  release_title: {
    type: _sequelize.DataTypes.STRING,
    field: 'release_title' // nombre de la columna en la base de datos

  },
  catalogue: {
    type: _sequelize.DataTypes.STRING,
    field: 'catalogue' // nombre de la columna en la base de datos

  },
  release_type: {
    type: _sequelize.DataTypes.STRING,
    field: 'release_type' // nombre de la columna en la base de datos

  },
  release_date: {
    type: _sequelize.DataTypes.DATE,
    field: 'release_date' // nombre de la columna en la base de datos

  },
  genre: {
    type: _sequelize.DataTypes.STRING,
    field: 'genre' // nombre de la columna en la base de datos

  },
  file_info: {
    type: _sequelize.DataTypes.STRING,
    field: 'file_info' // nombre de la columna en la base de datos

  },
  download_url: {
    type: _sequelize.DataTypes.STRING,
    field: 'download_url' // nombre de la columna en la base de datos

  }
}, {
  timestamps: false,
  // Si no quieres que Sequelize añada campos `createdAt` y `updatedAt`
  underscored: true // Esto asegurará que Sequelize use snake_case en lugar de camelCase

});

var _default = Discography;
exports["default"] = _default;
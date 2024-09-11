"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _sequelize = require("sequelize");

var _sequelize2 = _interopRequireDefault(require("../db/sequelize.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// models/release_artist.model.js
var ReleaseArtist = _sequelize2["default"].define('ReleaseArtist', {
  release_id: {
    type: _sequelize.DataTypes.INTEGER,
    allowNull: false
  },
  artist_id: {
    type: _sequelize.DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true
});

var _default = ReleaseArtist;
exports["default"] = _default;
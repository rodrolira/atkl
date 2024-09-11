"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _sequelize = require("sequelize");

var _sequelize2 = _interopRequireDefault(require("../db/sequelize.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// models/user.model.js
var User = _sequelize2["default"].define('User', {
  id: {
    type: _sequelize.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: _sequelize.DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: _sequelize.DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: _sequelize.DataTypes.STRING,
    allowNull: false
  },
  createdAt: {
    type: _sequelize.DataTypes.DATE,
    allowNull: false,
    defaultValue: _sequelize.DataTypes.NOW
  },
  updatedAt: {
    type: _sequelize.DataTypes.DATE,
    allowNull: false,
    defaultValue: _sequelize.DataTypes.NOW
  }
}, {
  timestamps: true,
  tableName: 'users'
});

var _default = User;
exports["default"] = _default;
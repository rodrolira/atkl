"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _sequelize = require("sequelize");

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _sequelize2 = _interopRequireDefault(require("../db/sequelize.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// models/admin.model.js
var Admin = _sequelize2["default"].define('Admin', {
  id: {
    type: _sequelize.DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: _sequelize.DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: _sequelize.DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: _sequelize.DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true,
  tableName: 'admins'
}); // Hash password before saving


Admin.beforeCreate(function _callee(admin) {
  var salt;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(_bcryptjs["default"].genSalt(10));

        case 2:
          salt = _context.sent;
          _context.next = 5;
          return regeneratorRuntime.awrap(_bcryptjs["default"].hash(admin.password, salt));

        case 5:
          admin.password = _context.sent;

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
});
var _default = Admin;
exports["default"] = _default;
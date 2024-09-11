"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _artistModel = _interopRequireDefault(require("../models/artist.model.js"));

var _sequelize = require("sequelize");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// routes/roles.js
var router = _express["default"].Router(); // Endpoint para obtener los roles únicos


router.get('/roles', function _callee(req, res) {
  var roles, formattedRoles;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(_artistModel["default"].findAll({
            attributes: [[_sequelize.Sequelize.fn('DISTINCT', _sequelize.Sequelize.col('role')), 'role']],
            raw: true
          }));

        case 3:
          roles = _context.sent;
          // Formatear los roles como una lista de objetos con id y label
          formattedRoles = roles.map(function (role, index) {
            return {
              id: index + 1,
              // o usa un identificador único si tienes uno
              value: role.role,
              label: role.role
            };
          });
          res.json(formattedRoles);
          _context.next = 12;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          console.error('Error fetching roles:', _context.t0);
          res.status(500).json({
            message: 'Error fetching roles'
          });

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
});
var _default = router;
exports["default"] = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logoutAdmin = exports.verifyTokenAdmin = exports.profileAdmin = exports.loginAdmin = exports.findAdminByUsername = exports.findAdminByEmail = exports.createAdmin = void 0;

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _adminModel = _interopRequireDefault(require("../models/admin.model.js"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// admin.controller.js
_dotenv["default"].config();

var createToken = function createToken(adminId) {
  return _jsonwebtoken["default"].sign({
    adminId: adminId
  }, process.env.SECRET, {
    expiresIn: '12h'
  });
};

var createAdmin = function createAdmin(_ref) {
  var username, email, password, newAdmin;
  return regeneratorRuntime.async(function createAdmin$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          username = _ref.username, email = _ref.email, password = _ref.password;
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(_adminModel["default"].create({
            username: username,
            email: email,
            password: password
          }));

        case 4:
          newAdmin = _context.sent;
          return _context.abrupt("return", newAdmin);

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](1);
          throw new Error("Error creating admin: ".concat(_context.t0.message));

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 8]]);
};

exports.createAdmin = createAdmin;

var findAdminByEmail = function findAdminByEmail(email) {
  var admin;
  return regeneratorRuntime.async(function findAdminByEmail$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(_adminModel["default"].findOne({
            where: {
              email: email
            }
          }));

        case 3:
          admin = _context2.sent;

          if (admin) {
            _context2.next = 6;
            break;
          }

          throw new Error('Admin not found');

        case 6:
          return _context2.abrupt("return", admin);

        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](0);
          throw new Error("Error finding admin by email: ".concat(_context2.t0.message));

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.findAdminByEmail = findAdminByEmail;

var findAdminByUsername = function findAdminByUsername(username) {
  var admin;
  return regeneratorRuntime.async(function findAdminByUsername$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(_adminModel["default"].findOne({
            where: {
              username: username
            }
          }));

        case 3:
          admin = _context3.sent;

          if (admin) {
            _context3.next = 6;
            break;
          }

          throw new Error('Admin not found');

        case 6:
          return _context3.abrupt("return", admin);

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          throw new Error("Error finding admin by username: ".concat(_context3.t0.message));

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.findAdminByUsername = findAdminByUsername;

var loginAdmin = function loginAdmin(username, password) {
  var admin, isMatch, token;
  return regeneratorRuntime.async(function loginAdmin$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(_adminModel["default"].findOne({
            where: {
              username: username
            }
          }));

        case 3:
          admin = _context4.sent;

          if (admin) {
            _context4.next = 6;
            break;
          }

          throw new Error('Admin not found');

        case 6:
          _context4.next = 8;
          return regeneratorRuntime.awrap(_bcryptjs["default"].compare(password, admin.password));

        case 8:
          isMatch = _context4.sent;

          if (isMatch) {
            _context4.next = 11;
            break;
          }

          throw new Error('Invalid credentials');

        case 11:
          token = createToken(admin.id);
          return _context4.abrupt("return", token);

        case 15:
          _context4.prev = 15;
          _context4.t0 = _context4["catch"](0);
          throw new Error("Error logging in admin: ".concat(_context4.t0.message));

        case 18:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

exports.loginAdmin = loginAdmin;

var profileAdmin = function profileAdmin(adminId) {
  var admin;
  return regeneratorRuntime.async(function profileAdmin$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(_adminModel["default"].findByPk(adminId));

        case 3:
          admin = _context5.sent;

          if (admin) {
            _context5.next = 6;
            break;
          }

          throw new Error('Admin not found');

        case 6:
          return _context5.abrupt("return", admin);

        case 9:
          _context5.prev = 9;
          _context5.t0 = _context5["catch"](0);
          throw new Error("Error fetching admin profile: ".concat(_context5.t0.message));

        case 12:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.profileAdmin = profileAdmin;

var verifyTokenAdmin = function verifyTokenAdmin(token) {
  var decoded, admin;
  return regeneratorRuntime.async(function verifyTokenAdmin$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          decoded = _jsonwebtoken["default"].verify(token, process.env.SECRET);
          _context6.next = 4;
          return regeneratorRuntime.awrap(_adminModel["default"].findByPk(decoded.adminId));

        case 4:
          admin = _context6.sent;

          if (admin) {
            _context6.next = 7;
            break;
          }

          throw new Error('Unauthorized');

        case 7:
          return _context6.abrupt("return", admin);

        case 10:
          _context6.prev = 10;
          _context6.t0 = _context6["catch"](0);
          throw new Error('Unauthorized');

        case 13:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

exports.verifyTokenAdmin = verifyTokenAdmin;

var logoutAdmin = function logoutAdmin(req, res) {
  return regeneratorRuntime.async(function logoutAdmin$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          try {
            res.clearCookie('token');
            res.json({
              message: 'Logout successful'
            });
          } catch (error) {
            console.error('Error logging out admin:', error);
            res.status(500).json({
              message: 'Server Error'
            });
          }

        case 1:
        case "end":
          return _context7.stop();
      }
    }
  });
};

exports.logoutAdmin = logoutAdmin;
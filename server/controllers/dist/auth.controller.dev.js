"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logoutUser = exports.verifyTokenUser = exports.profileUser = exports.loginUser = exports.findUserByUsername = exports.findUserByEmail = exports.createUser = void 0;

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _userModel = _interopRequireDefault(require("../models/user.model.js"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// user.controller.js
_dotenv["default"].config();

var createToken = function createToken(userId) {
  return _jsonwebtoken["default"].sign({
    userId: userId
  }, process.env.SECRET, {
    expiresIn: '12h'
  });
};

var createUser = function createUser(_ref) {
  var username, email, password, hashedPassword, newUser;
  return regeneratorRuntime.async(function createUser$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          username = _ref.username, email = _ref.email, password = _ref.password;
          _context.next = 3;
          return regeneratorRuntime.awrap(_bcryptjs["default"].hash(password, 10));

        case 3:
          hashedPassword = _context.sent;
          _context.prev = 4;
          _context.next = 7;
          return regeneratorRuntime.awrap(_userModel["default"].create({
            username: username,
            email: email,
            password: hashedPassword
          }));

        case 7:
          newUser = _context.sent;
          return _context.abrupt("return", newUser);

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](4);
          throw new Error("Error creating user: ".concat(_context.t0.message));

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[4, 11]]);
};

exports.createUser = createUser;

var findUserByEmail = function findUserByEmail(email) {
  var user;
  return regeneratorRuntime.async(function findUserByEmail$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(_userModel["default"].findOne({
            where: {
              email: email
            }
          }));

        case 3:
          user = _context2.sent;
          return _context2.abrupt("return", user);

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          throw new Error("Error finding user by email: ".concat(_context2.t0.message));

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.findUserByEmail = findUserByEmail;

var findUserByUsername = function findUserByUsername(username) {
  var user;
  return regeneratorRuntime.async(function findUserByUsername$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(_userModel["default"].findOne({
            where: {
              username: username
            }
          }));

        case 3:
          user = _context3.sent;
          return _context3.abrupt("return", user);

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          throw new Error("Error finding user by username: ".concat(_context3.t0.message));

        case 10:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.findUserByUsername = findUserByUsername;

var loginUser = function loginUser(username, password) {
  var user, isMatch, token;
  return regeneratorRuntime.async(function loginUser$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(_userModel["default"].findOne({
            where: {
              username: username
            }
          }));

        case 3:
          user = _context4.sent;

          if (user) {
            _context4.next = 6;
            break;
          }

          throw new Error('User not found');

        case 6:
          _context4.next = 8;
          return regeneratorRuntime.awrap(_bcryptjs["default"].compare(password, user.password));

        case 8:
          isMatch = _context4.sent;

          if (isMatch) {
            _context4.next = 11;
            break;
          }

          throw new Error('Invalid credentials');

        case 11:
          token = createToken(user.id);
          return _context4.abrupt("return", token);

        case 15:
          _context4.prev = 15;
          _context4.t0 = _context4["catch"](0);
          throw new Error("Error logging in user: ".concat(_context4.t0.message));

        case 18:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

exports.loginUser = loginUser;

var profileUser = function profileUser(userId) {
  var user;
  return regeneratorRuntime.async(function profileUser$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(_userModel["default"].findByPk(userId, {
            attributes: ['id', 'username', 'email']
          }));

        case 3:
          user = _context5.sent;

          if (user) {
            _context5.next = 6;
            break;
          }

          throw new Error('User not found');

        case 6:
          return _context5.abrupt("return", user);

        case 9:
          _context5.prev = 9;
          _context5.t0 = _context5["catch"](0);
          throw new Error("Error fetching user profile: ".concat(_context5.t0.message));

        case 12:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.profileUser = profileUser;

var verifyTokenUser = function verifyTokenUser(token) {
  var decoded, user;
  return regeneratorRuntime.async(function verifyTokenUser$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          decoded = _jsonwebtoken["default"].verify(token, process.env.SECRET);
          _context6.next = 4;
          return regeneratorRuntime.awrap(_userModel["default"].findByPk(decoded.userId));

        case 4:
          user = _context6.sent;

          if (user) {
            _context6.next = 7;
            break;
          }

          throw new Error('Unauthorized');

        case 7:
          return _context6.abrupt("return", user);

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

exports.verifyTokenUser = verifyTokenUser;

var logoutUser = function logoutUser(req, res) {
  try {
    res.clearCookie('token');
    res.status(200).json({
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: "Error logging out: ".concat(error.message)
    });
  }
};

exports.logoutUser = logoutUser;
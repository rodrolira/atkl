"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var adminController = _interopRequireWildcard(require("../controllers/admin.controller.js"));

var _validateToken = require("../middlewares/validateToken.js");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// admin.routes.js
var router = _express["default"].Router();

router.post('/admin/register', function _callee(req, res) {
  var _req$body, username, email, password, newAdmin;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, username = _req$body.username, email = _req$body.email, password = _req$body.password;
          _context.next = 4;
          return regeneratorRuntime.awrap(adminController.createAdmin({
            username: username,
            email: email,
            password: password
          }));

        case 4:
          newAdmin = _context.sent;
          res.status(201).json({
            message: 'Admin registered successfully',
            admin: newAdmin
          });
          _context.next = 12;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          console.error('Error registering admin:', _context.t0);
          res.status(500).json({
            message: 'Server Error'
          });

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
});
router.post('/admin/login', function _callee2(req, res) {
  var _req$body2, username, password, token;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body2 = req.body, username = _req$body2.username, password = _req$body2.password;
          _context2.next = 4;
          return regeneratorRuntime.awrap(adminController.loginAdmin(username, password));

        case 4:
          token = _context2.sent;
          res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'dev',
            maxAge: 12 * 60 * 60 * 1000 // 12hrs

          });
          res.json({
            message: 'Login successful',
            admin: {
              username: username,
              password: password
            }
          });
          _context2.next = 13;
          break;

        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](0);
          console.error('Error logging in admin:', _context2.t0);
          res.status(401).json({
            message: 'Invalid credentials'
          });

        case 13:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 9]]);
});
router.post('/admin/logout', adminController.logoutAdmin);
router.get('/admin/profile', _validateToken.verifyTokenAdmin, function _callee3(req, res) {
  var admin;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(adminController.profileAdmin(req.adminId));

        case 3:
          admin = _context3.sent;
          res.json({
            admin: admin
          });
          _context3.next = 11;
          break;

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          console.error('Error fetching admin profile:', _context3.t0);
          res.status(500).json({
            message: 'Server Error'
          });

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
router.get('/admin/verify', function _callee4(req, res) {
  var token, admin;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          token = req.cookies.token;
          _context4.prev = 1;
          _context4.next = 4;
          return regeneratorRuntime.awrap(adminController.verifyTokenAdmin(token));

        case 4:
          admin = _context4.sent;
          res.json({
            admin: admin
          });
          _context4.next = 11;
          break;

        case 8:
          _context4.prev = 8;
          _context4.t0 = _context4["catch"](1);
          res.status(401).json({
            message: 'Unauthorized'
          });

        case 11:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[1, 8]]);
});
var _default = router;
exports["default"] = _default;
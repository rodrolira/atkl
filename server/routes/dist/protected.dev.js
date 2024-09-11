"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _validateToken = _interopRequireDefault(require("../middlewares/validateToken.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// routes/protectedRoutes.js
var router = (0, _express.Router)(); // Ruta protegida que usa el middleware

router.get('/protected', _validateToken["default"], function (req, res) {
  res.json({
    message: 'This is a protected route',
    user: req.user
  });
});
var _default = router;
exports["default"] = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _artistsController = require("../controllers/artists.controller.js");

var _multer = _interopRequireDefault(require("multer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// routes/artists.routes.js
var router = _express["default"].Router(); // Configuración de multer


var storage = _multer["default"].diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, 'uploads/'); // Define dónde se almacenarán los archivos
  },
  filename: function filename(req, file, cb) {
    cb(null, "".concat(Date.now(), "_").concat(file.originalname)); // Define el nombre del archivo
  }
});

var upload = (0, _multer["default"])({
  storage: storage
});
router.get('/artists', _artistsController.getArtists);
router.get('/artists/:id', _artistsController.getArtistById);
router.get('/artists/:id/releases', _artistsController.getArtistReleases);
router.post('/artists', upload.single('image'), _artistsController.addArtist);
router.put('/artists/:id', upload.single('image'), _artistsController.updateArtist);
router["delete"]('/artists/:id', _artistsController.deleteArtist);
var _default = router;
exports["default"] = _default;
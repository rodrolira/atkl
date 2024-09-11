"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _multer = _interopRequireDefault(require("multer"));

var _releasesController = require("../controllers/releases.controller.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// routes/release.routes.js
// Importa multer para manejar la carga de archivos
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
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  // Example limit: 5MB
  fileFilter: function fileFilter(req, file, cb) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
}); // Rutas

router.get('/releases', _releasesController.getReleases);
router.get('/releases/:id', _releasesController.getReleaseById);
router.post('/releases', upload.single('cover_image_url'), _releasesController.addRelease);
router.put('/releases/:id', upload.single('cover_image_url'), _releasesController.updateRelease);
router["delete"]('/releases/:id', _releasesController.deleteRelease);
var _default = router;
exports["default"] = _default;
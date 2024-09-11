"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _genreController = _interopRequireDefault(require("../controllers/genre.controller.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// routes/genre.routes.js
var router = _express["default"].Router(); // Ruta para obtener todos los géneros


router.get('/genres', _genreController["default"].getAllGenres); // Ruta para obtener un género por ID

router.get('/genres/:id', _genreController["default"].getGenreById); // Ruta para crear un nuevo género

router.post('/genres', _genreController["default"].createGenre); // Ruta para actualizar un género existente

router.put('/genres/:id', _genreController["default"].updateGenre); // Ruta para eliminar un género

router["delete"]('/genres/:id', _genreController["default"].deleteGenre);
var _default = router;
exports["default"] = _default;
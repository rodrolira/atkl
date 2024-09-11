"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _discographyModel = _interopRequireDefault(require("../models/discography.model.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var router = (0, _express.Router)(); // Crear varios tracks a partir de datos CSV
// Crear varios tracks a partir de datos CSV

router.post('/discography/bulk', function _callee(req, res) {
  var tracks, cleanedTracks, results;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          tracks = req.body;

          if (Array.isArray(tracks)) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: 'Los datos deben ser una lista de registros.'
          }));

        case 4:
          // Verificar y limpiar los datos antes de insertarlos
          cleanedTracks = tracks.map(function (track) {
            return {
              title: track.title,
              artist: track.artist,
              release_title: track.release_title,
              catalogue: track.catalogue,
              release_type: track.release_type,
              release_date: track.release_date,
              genre: track.genre,
              file_info: track.file_info,
              download_url: track.download_url
            };
          });
          _context.next = 7;
          return regeneratorRuntime.awrap(Promise.all(tracks.map(function (track) {
            return _discographyModel["default"].create(track);
          })));

        case 7:
          results = _context.sent;
          res.status(201).json(results);
          _context.next = 14;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](0);
          res.status(400).json({
            error: _context.t0.message
          });

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 11]]);
}); // Crear un nuevo track

router.post('/discography', function _callee2(req, res) {
  var track;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(_discographyModel["default"].create(req.body));

        case 3:
          track = _context2.sent;
          res.status(201).json(track);
          _context2.next = 10;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          res.status(400).json({
            error: _context2.t0.message
          });

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
}); // Obtener todos los tracks

router.get('/discography', function _callee3(req, res) {
  var tracks;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(_discographyModel["default"].findAll());

        case 3:
          tracks = _context3.sent;
          res.status(200).json(tracks);
          _context3.next = 10;
          break;

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          res.status(500).json({
            error: _context3.t0.message
          });

        case 10:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 7]]);
}); // Obtener un track por ID

router.get('/discography/:id', function _callee4(req, res) {
  var track;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(_discographyModel["default"].findByPk(req.params.id));

        case 3:
          track = _context4.sent;

          if (track) {
            _context4.next = 6;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            error: 'Track not found'
          }));

        case 6:
          res.status(200).json(track);
          _context4.next = 12;
          break;

        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4["catch"](0);
          res.status(500).json({
            error: _context4.t0.message
          });

        case 12:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 9]]);
}); // Actualizar un track por ID

router.put('/discography/:id', function _callee5(req, res) {
  var _ref, _ref2, updated, updatedTrack;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(_discographyModel["default"].update(req.body, {
            where: {
              id: req.params.id
            }
          }));

        case 3:
          _ref = _context5.sent;
          _ref2 = _slicedToArray(_ref, 1);
          updated = _ref2[0];

          if (!updated) {
            _context5.next = 13;
            break;
          }

          _context5.next = 9;
          return regeneratorRuntime.awrap(_discographyModel["default"].findByPk(req.params.id));

        case 9:
          updatedTrack = _context5.sent;
          res.status(200).json(updatedTrack);
          _context5.next = 14;
          break;

        case 13:
          res.status(404).json({
            error: 'Track not found'
          });

        case 14:
          _context5.next = 19;
          break;

        case 16:
          _context5.prev = 16;
          _context5.t0 = _context5["catch"](0);
          res.status(500).json({
            error: _context5.t0.message
          });

        case 19:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 16]]);
}); // Eliminar un track por ID

router["delete"]('/discography/:id', function _callee6(req, res) {
  var deleted;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(_discographyModel["default"].destroy({
            where: {
              id: req.params.id
            }
          }));

        case 3:
          deleted = _context6.sent;

          if (deleted) {
            res.status(204).json({});
          } else {
            res.status(404).json({
              error: 'Track not found'
            });
          }

          _context6.next = 10;
          break;

        case 7:
          _context6.prev = 7;
          _context6.t0 = _context6["catch"](0);
          res.status(500).json({
            error: _context6.t0.message
          });

        case 10:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
var _default = router;
exports["default"] = _default;
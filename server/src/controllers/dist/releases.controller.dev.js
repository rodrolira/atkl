"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteRelease = exports.updateRelease = exports.getReleaseById = exports.getReleases = exports.addRelease = void 0;

var _releaseModel = _interopRequireDefault(require("../models/release.model.js"));

var _artistModel = _interopRequireDefault(require("../models/artist.model.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// Importa el modelo Artist
var addRelease = function addRelease(req, res) {
  var _req$body, title, release_date, is_explicit, description, genre_id, release_type, artist_id, cover_image_url, newRelease;

  return regeneratorRuntime.async(function addRelease$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, title = _req$body.title, release_date = _req$body.release_date, is_explicit = _req$body.is_explicit, description = _req$body.description, genre_id = _req$body.genre_id, release_type = _req$body.release_type, artist_id = _req$body.artist_id; // Verifica si hay un archivo subido para la imagen de portada

          cover_image_url = req.file ? req.file.path : null; // Verifica que los campos obligatorios estén presentes

          if (!(!title || !release_date || !genre_id || !release_type || !artist_id || artist_id.length === 0)) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: 'title, release_date, genre_id, release_type, and at least one artist_id are required'
          }));

        case 4:
          _context.prev = 4;
          _context.next = 7;
          return regeneratorRuntime.awrap(_releaseModel["default"].create({
            title: title,
            release_date: release_date,
            is_explicit: is_explicit,
            description: description,
            genre_id: genre_id,
            cover_image_url: cover_image_url,
            release_type: release_type
          }));

        case 7:
          newRelease = _context.sent;
          _context.next = 10;
          return regeneratorRuntime.awrap(newRelease.setArtists(artist_id));

        case 10:
          // Usar setArtists para reemplazar artistas
          res.status(201).json(newRelease);
          _context.next = 17;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](4);
          // Handle errors
          console.error('Error adding release:', _context.t0);
          return _context.abrupt("return", res.status(500).json({
            message: 'Failed to add release'
          }));

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[4, 13]]);
};

exports.addRelease = addRelease;

var getReleases = function getReleases(req, res) {
  var releases;
  return regeneratorRuntime.async(function getReleases$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(_releaseModel["default"].findAll({
            include: [{
              model: _artistModel["default"],
              as: 'artists'
            }]
          }));

        case 3:
          releases = _context2.sent;
          res.status(200).json(releases);
          _context2.next = 10;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);

          if (_context2.t0.message === 'Artist is not associated to Release!') {
            res.status(400).json({
              message: 'Artist is not associated to Release!'
            });
          } else {
            res.status(500).json({
              message: _context2.t0.message
            });
          }

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.getReleases = getReleases;

var getReleaseById = function getReleaseById(req, res) {
  var id, release;
  return regeneratorRuntime.async(function getReleaseById$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          id = req.params.id;
          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap(_releaseModel["default"].findByPk(id, {
            include: [{
              model: _artistModel["default"],
              as: 'artists'
            }]
          }));

        case 4:
          release = _context3.sent;

          if (release) {
            _context3.next = 7;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: 'Release not found'
          }));

        case 7:
          res.status(200).json(release);
          _context3.next = 13;
          break;

        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](1);
          res.status(500).json({
            message: _context3.t0.message
          });

        case 13:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 10]]);
};

exports.getReleaseById = getReleaseById;

var updateRelease = function updateRelease(req, res) {
  var id, _req$body2, title, release_date, is_explicit, description, genre_id, release_type, cover_image_url, bandcamp_link, beatport_link, spotify_link, apple_music_link, youtube_link, soundcloud_link, artist_id, _ref, _ref2, updatedRowsCount, updatedRows, release;

  return regeneratorRuntime.async(function updateRelease$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          id = req.params.id;
          _req$body2 = req.body, title = _req$body2.title, release_date = _req$body2.release_date, is_explicit = _req$body2.is_explicit, description = _req$body2.description, genre_id = _req$body2.genre_id, release_type = _req$body2.release_type, cover_image_url = _req$body2.cover_image_url, bandcamp_link = _req$body2.bandcamp_link, beatport_link = _req$body2.beatport_link, spotify_link = _req$body2.spotify_link, apple_music_link = _req$body2.apple_music_link, youtube_link = _req$body2.youtube_link, soundcloud_link = _req$body2.soundcloud_link, artist_id = _req$body2.artist_id;
          _context4.prev = 2;

          if (title) {
            _context4.next = 5;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            error: 'Title is required'
          }));

        case 5:
          console.log("Updating release with ID: ".concat(id));
          console.log('Update data:', req.body); // Log para verificar los datos recibidos
          // Actualizar el release en la base de datos

          _context4.next = 9;
          return regeneratorRuntime.awrap(_releaseModel["default"].update({
            title: title,
            release_date: release_date,
            is_explicit: is_explicit,
            description: description,
            genre_id: genre_id,
            release_type: release_type,
            cover_image_url: cover_image_url,
            bandcamp_link: bandcamp_link,
            beatport_link: beatport_link,
            spotify_link: spotify_link,
            apple_music_link: apple_music_link,
            youtube_link: youtube_link,
            soundcloud_link: soundcloud_link
          }, {
            where: {
              id: id
            },
            returning: true // Devolver el registro actualizado

          }));

        case 9:
          _ref = _context4.sent;
          _ref2 = _slicedToArray(_ref, 2);
          updatedRowsCount = _ref2[0];
          updatedRows = _ref2[1];

          if (!(updatedRowsCount === 0)) {
            _context4.next = 15;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: 'Release not found'
          }));

        case 15:
          // Actualizar asociaciones con artistas
          release = updatedRows[0];
          _context4.next = 18;
          return regeneratorRuntime.awrap(release.setArtists(artist_id));

        case 18:
          // Usar setArtists para reemplazar artistas
          res.json(release); // Devuelve el primer registro actualizado

          _context4.next = 25;
          break;

        case 21:
          _context4.prev = 21;
          _context4.t0 = _context4["catch"](2);
          console.error('Error updating release:', _context4.t0);
          res.status(500).json({
            message: _context4.t0.message
          });

        case 25:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[2, 21]]);
};

exports.updateRelease = updateRelease;

var deleteRelease = function deleteRelease(req, res) {
  var id, release;
  return regeneratorRuntime.async(function deleteRelease$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          id = req.params.id;
          _context5.next = 4;
          return regeneratorRuntime.awrap(_releaseModel["default"].findByPk(id));

        case 4:
          release = _context5.sent;

          if (release) {
            _context5.next = 7;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            message: 'Release not found'
          }));

        case 7:
          _context5.next = 9;
          return regeneratorRuntime.awrap(_releaseModel["default"].destroy({
            where: {
              id: id
            }
          }));

        case 9:
          res.status(200).json({
            message: 'Release deleted successfully'
          });
          _context5.next = 15;
          break;

        case 12:
          _context5.prev = 12;
          _context5.t0 = _context5["catch"](0);
          res.status(500).json({
            message: _context5.t0.message
          });

        case 15:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

exports.deleteRelease = deleteRelease;
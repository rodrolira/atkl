"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getArtistReleases = exports.getArtistById = exports.getArtists = exports.deleteArtist = exports.updateArtist = exports.addArtist = void 0;

var _artistModel = _interopRequireDefault(require("../models/artist.model.js"));

var _releaseModel = _interopRequireDefault(require("../models/release.model.js"));

var _userModel = _interopRequireDefault(require("../models/user.model.js"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

_dotenv["default"].config();

var addArtist = function addArtist(req, res) {
  var _req$body, artist_name, email, username, password, bio, role, bandcamp_link, facebook_link, instagram_link, soundcloud_link, twitter_link, youtube_link, spotify_link, apple_music_link, beatport_link, image, newUser, newArtist, token;

  return regeneratorRuntime.async(function addArtist$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, artist_name = _req$body.artist_name, email = _req$body.email, username = _req$body.username, password = _req$body.password, bio = _req$body.bio, role = _req$body.role, bandcamp_link = _req$body.bandcamp_link, facebook_link = _req$body.facebook_link, instagram_link = _req$body.instagram_link, soundcloud_link = _req$body.soundcloud_link, twitter_link = _req$body.twitter_link, youtube_link = _req$body.youtube_link, spotify_link = _req$body.spotify_link, apple_music_link = _req$body.apple_music_link, beatport_link = _req$body.beatport_link; // Verifica si hay un archivo subido

          image = req.file ? req.file.path : null;

          if (!(!artist_name || !email || !username || !password)) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: 'artist_name, username, email, and password are required'
          }));

        case 4:
          _context.prev = 4;
          _context.t0 = regeneratorRuntime;
          _context.t1 = _userModel["default"];
          _context.t2 = username;
          _context.t3 = email;
          _context.next = 11;
          return regeneratorRuntime.awrap(_bcryptjs["default"].hash(password, 10));

        case 11:
          _context.t4 = _context.sent;
          _context.t5 = {
            username: _context.t2,
            email: _context.t3,
            password: _context.t4
          };
          _context.t6 = _context.t1.create.call(_context.t1, _context.t5);
          _context.next = 16;
          return _context.t0.awrap.call(_context.t0, _context.t6);

        case 16:
          newUser = _context.sent;
          _context.next = 19;
          return regeneratorRuntime.awrap(_artistModel["default"].create({
            artist_name: artist_name,
            user_id: newUser.id,
            email: email,
            role: role,
            bio: bio,
            image: image,
            bandcamp_link: bandcamp_link,
            facebook_link: facebook_link,
            instagram_link: instagram_link,
            soundcloud_link: soundcloud_link,
            twitter_link: twitter_link,
            youtube_link: youtube_link,
            spotify_link: spotify_link,
            apple_music_link: apple_music_link,
            beatport_link: beatport_link
          }));

        case 19:
          newArtist = _context.sent;
          token = _jsonwebtoken["default"].sign({
            email: email
          }, process.env.SECRET, {
            expiresIn: '12h'
          });
          res.cookie('token', token, {
            httpOnly: true
          });
          console.log('New artist created:', newArtist);
          res.status(201).json(newArtist);
          _context.next = 30;
          break;

        case 26:
          _context.prev = 26;
          _context.t7 = _context["catch"](4);
          console.error("Error adding artist: ".concat(_context.t7.message), _context.t7);
          return _context.abrupt("return", res.status(500).json({
            message: _context.t7.message,
            details: _context.t7.stack
          }));

        case 30:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[4, 26]]);
};

exports.addArtist = addArtist;

var updateArtist = function updateArtist(req, res) {
  var id, _req$body2, artist_name, bio, role, image, twitter_link, instagram_link, facebook_link, soundcloud_link, bandcamp_link, youtube_link, spotify_link, apple_music_link, beatport_link, _ref, _ref2, updatedRowsCount, updatedRows;

  return regeneratorRuntime.async(function updateArtist$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          id = req.params.id;
          _req$body2 = req.body, artist_name = _req$body2.artist_name, bio = _req$body2.bio, role = _req$body2.role, image = _req$body2.image, twitter_link = _req$body2.twitter_link, instagram_link = _req$body2.instagram_link, facebook_link = _req$body2.facebook_link, soundcloud_link = _req$body2.soundcloud_link, bandcamp_link = _req$body2.bandcamp_link, youtube_link = _req$body2.youtube_link, spotify_link = _req$body2.spotify_link, apple_music_link = _req$body2.apple_music_link, beatport_link = _req$body2.beatport_link;
          _context2.prev = 2;

          if (!(!artist_name || !role)) {
            _context2.next = 5;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            error: 'Artist name and role are required'
          }));

        case 5:
          console.log("Updating artist with ID: ".concat(id));
          console.log('Update data:', req.body); // Log para verificar los datos recibidos
          // Lógica de actualización en la base de datos

          _context2.next = 9;
          return regeneratorRuntime.awrap(_artistModel["default"].update({
            artist_name: artist_name,
            bio: bio,
            role: role,
            image: image,
            twitter_link: twitter_link,
            instagram_link: instagram_link,
            facebook_link: facebook_link,
            soundcloud_link: soundcloud_link,
            bandcamp_link: bandcamp_link,
            youtube_link: youtube_link,
            spotify_link: spotify_link,
            apple_music_link: apple_music_link,
            beatport_link: beatport_link
          }, {
            where: {
              id: id
            },
            returning: true // Para devolver el registro actualizado

          }));

        case 9:
          _ref = _context2.sent;
          _ref2 = _slicedToArray(_ref, 2);
          updatedRowsCount = _ref2[0];
          updatedRows = _ref2[1];

          if (!(updatedRowsCount === 0)) {
            _context2.next = 15;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            error: 'Artist not found'
          }));

        case 15:
          res.json(updatedRows[0]); // Devuelve el primer registro actualizado

          _context2.next = 22;
          break;

        case 18:
          _context2.prev = 18;
          _context2.t0 = _context2["catch"](2);
          console.error('Error updating artist:', _context2.t0);
          res.status(500).json({
            error: 'Internal server error'
          });

        case 22:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[2, 18]]);
};

exports.updateArtist = updateArtist;

var deleteArtist = function deleteArtist(req, res) {
  var id, artist;
  return regeneratorRuntime.async(function deleteArtist$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          id = req.params.id;
          _context3.next = 4;
          return regeneratorRuntime.awrap(_artistModel["default"].findByPk(id));

        case 4:
          artist = _context3.sent;

          if (artist) {
            _context3.next = 7;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: 'Artist not found'
          }));

        case 7:
          _context3.next = 9;
          return regeneratorRuntime.awrap(_artistModel["default"].destroy({
            where: {
              id: id
            }
          }));

        case 9:
          _context3.next = 11;
          return regeneratorRuntime.awrap(_userModel["default"].destroy({
            where: {
              id: artist.user_id
            }
          }));

        case 11:
          res.status(200).json({
            message: 'Artist and user account deleted successfully'
          });
          _context3.next = 17;
          break;

        case 14:
          _context3.prev = 14;
          _context3.t0 = _context3["catch"](0);
          res.status(500).json({
            message: _context3.t0.message
          });

        case 17:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 14]]);
};

exports.deleteArtist = deleteArtist;

var getArtists = function getArtists(req, res) {
  var artists;
  return regeneratorRuntime.async(function getArtists$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(_artistModel["default"].findAll());

        case 3:
          artists = _context4.sent;
          res.status(200).json(artists);
          _context4.next = 10;
          break;

        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](0);
          res.status(500).json({
            message: _context4.t0.message
          });

        case 10:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.getArtists = getArtists;

var getArtistById = function getArtistById(req, res) {
  var id, artist;
  return regeneratorRuntime.async(function getArtistById$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          id = req.params.id;
          _context5.prev = 1;
          _context5.next = 4;
          return regeneratorRuntime.awrap(_artistModel["default"].findByPk(id));

        case 4:
          artist = _context5.sent;

          if (artist) {
            _context5.next = 7;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            message: 'Artist not found'
          }));

        case 7:
          res.status(200).json(artist);
          _context5.next = 13;
          break;

        case 10:
          _context5.prev = 10;
          _context5.t0 = _context5["catch"](1);
          res.status(500).json({
            message: _context5.t0.message
          });

        case 13:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[1, 10]]);
};

exports.getArtistById = getArtistById;

var getArtistReleases = function getArtistReleases(req, res) {
  var id, artist;
  return regeneratorRuntime.async(function getArtistReleases$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          id = req.params.id;
          _context6.prev = 1;
          _context6.next = 4;
          return regeneratorRuntime.awrap(_artistModel["default"].findByPk(id, {
            include: {
              model: _releaseModel["default"],
              as: 'releases'
            } // Incluye los lanzamientos asociados al artista

          }));

        case 4:
          artist = _context6.sent;

          if (artist) {
            _context6.next = 7;
            break;
          }

          return _context6.abrupt("return", res.status(404).json({
            message: 'Artist not found'
          }));

        case 7:
          res.status(200).json(artist.releases); // Devuelve los lanzamientos del artista

          _context6.next = 14;
          break;

        case 10:
          _context6.prev = 10;
          _context6.t0 = _context6["catch"](1);
          console.error('Error fetching artist releases:', _context6.t0);
          res.status(500).json({
            message: 'Internal server error'
          });

        case 14:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[1, 10]]);
};

exports.getArtistReleases = getArtistReleases;
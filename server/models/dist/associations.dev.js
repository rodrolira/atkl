"use strict";

var _artistModel = _interopRequireDefault(require("./artist.model.js"));

var _releaseModel = _interopRequireDefault(require("./release.model.js"));

var _userModel = _interopRequireDefault(require("./user.model.js"));

var _genreModel = _interopRequireDefault(require("./genre.model.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// associations.js
// Define associations
// Definir la asociación entre Artist y User (one-to-one)
_artistModel["default"].belongsTo(_userModel["default"], {
  foreignKey: 'user_id',
  targetKey: 'id'
});

_userModel["default"].hasOne(_artistModel["default"], {
  foreignKey: 'user_id',
  sourceKey: 'id'
}); // Definir la relación entre Release y Genre (many-to-one)


_releaseModel["default"].belongsTo(_genreModel["default"], {
  foreignKey: 'genre_id',
  as: 'genre'
});

_genreModel["default"].hasMany(_releaseModel["default"], {
  foreignKey: 'genre_id',
  as: 'releases'
}); // Definir la asociación entre Release y Artist (many-to-many)


_releaseModel["default"].belongsToMany(_artistModel["default"], {
  through: 'ReleaseArtist',
  foreignKey: 'release_id',
  as: 'artists'
});

_artistModel["default"].belongsToMany(_releaseModel["default"], {
  through: 'ReleaseArtist',
  foreignKey: 'artist_id',
  as: 'releases'
});
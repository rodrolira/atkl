"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _sequelize = require("sequelize");

var _sequelize2 = _interopRequireDefault(require("../db/sequelize.js"));

var _genreModel = _interopRequireDefault(require("./genre.model.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Release = _sequelize2["default"].define('Release', {
  title: {
    type: _sequelize.DataTypes.STRING,
    allowNull: false
  },
  release_date: {
    type: _sequelize.DataTypes.DATE,
    allowNull: true
  },
  genre_id: {
    type: _sequelize.DataTypes.INTEGER,
    references: {
      model: _genreModel["default"]
    },
    allowNull: true // Adjust this as per your schema

  },
  is_explicit: {
    type: _sequelize.DataTypes.BOOLEAN,
    allowNull: true
  },
  description: {
    type: _sequelize.DataTypes.TEXT,
    allowNull: true
  },
  cover_image_url: {
    type: _sequelize.DataTypes.STRING,
    allowNull: true
  },
  release_type: {
    type: _sequelize.DataTypes.ENUM('Album', 'EP', 'Single', 'V.A'),
    allowNull: false
  },
  bandcamp_link: {
    type: _sequelize.DataTypes.STRING,
    allowNull: true
  },
  beatport_link: {
    type: _sequelize.DataTypes.STRING,
    allowNull: true
  },
  spotify_link: {
    type: _sequelize.DataTypes.STRING,
    allowNull: true
  },
  apple_music_link: {
    type: _sequelize.DataTypes.STRING,
    allowNull: true
  },
  youtube_link: {
    type: _sequelize.DataTypes.STRING,
    allowNull: true
  },
  soundcloud_link: {
    type: _sequelize.DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'releases'
});

var _default = Release;
exports["default"] = _default;
import { DataTypes } from 'sequelize'
import sequelize from '../../db/sequelize.js'
import Genre from './genre.model.js'

const Release = sequelize.define(
  'Release',
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    release_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    genre_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Genre,
      },
      allowNull: true, // Adjust this as per your schema
    },
    is_explicit: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    cover_image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    release_type: {
      type: DataTypes.ENUM('Album', 'EP', 'Single', 'V.A', 'Compilation'),
      allowNull: false,
    },
    // Crédito del artista como texto, independiente de la tabla `artists`.
    //
    // La ficha de un artista se puede borrar desde el panel, pero el crédito de
    // un release es un hecho histórico: el disco siguió saliendo a nombre de
    // quien lo hizo. Antes el vínculo vivía solo en ReleaseArtists y al borrar
    // la ficha el release quedaba mostrando "sin artistas".
    //
    // La relación con `artists` se mantiene y sigue siendo la que da el enlace
    // clickeable. Esta columna es el respaldo que sobrevive al borrado.
    artist_credit: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bandcamp_link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // ID numérico del álbum en Bandcamp, el único dato que el reproductor
    // embebido necesita y que NO viene en la URL pública. El audio se queda
    // en Bandcamp: acá no se guarda ni se sirve ningún archivo.
    bandcamp_album_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // El iframe de Bandcamp no se autoajusta (es cross-origin), así que el alto
    // se calcula desde la cantidad de tracks. Sin esto la lista queda cortada
    // o sobra un hueco negro debajo.
    bandcamp_track_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    beatport_link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    spotify_link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    apple_music_link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    youtube_link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    soundcloud_link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: 'releases',
  }
)

export default Release

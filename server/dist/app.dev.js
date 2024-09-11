"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _cors = _interopRequireDefault(require("cors"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _authRoutes = _interopRequireDefault(require("./routes/auth.routes.js"));

var _artistsRoutes = _interopRequireDefault(require("./routes/artists.routes.js"));

var _releasesRoutes = _interopRequireDefault(require("./routes/releases.routes.js"));

var _adminRoutes = _interopRequireDefault(require("./routes/admin.routes.js"));

var _genreRoutes = _interopRequireDefault(require("./routes/genre.routes.js"));

var _contactFormRoutes = _interopRequireDefault(require("./routes/contact-form.routes.js"));

var _rolesRoutes = _interopRequireDefault(require("./routes/roles.routes.js"));

var _discographyRoutes = _interopRequireDefault(require("./routes/discography.routes.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// app.js
// import http from "http";
_dotenv["default"].config();

var app = (0, _express["default"])(); // Middleware para servir archivos estáticos

app.use('/uploads', _express["default"]["static"]('uploads')); // app.use(
//   cors({
//     origin: 'https://atkl-react2-fzwl.vercel.app',
//     credentials: true,
//     exposedHeaders: 'Access-Control-Allow-Origin' // Agrega esta línea
//   })
// )

app.use((0, _cors["default"])({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  // Agrega DELETE aquí si es necesario
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use((0, _morgan["default"])('dev'));
app.use(_express["default"].json());
app.use((0, _cookieParser["default"])()); // Rutas públicas

app.use('/api', _authRoutes["default"]);
app.use('/api', _artistsRoutes["default"]);
app.use('/api', _releasesRoutes["default"]);
app.use('/api', _adminRoutes["default"]);
app.use('/api', _contactFormRoutes["default"]);
app.use('/api', _genreRoutes["default"]);
app.use('/api', _rolesRoutes["default"]);
app.use('/api', _discographyRoutes["default"]); // Middleware para manejo de errores

app.use(function (err, req, res, next) {
  console.log(err);
  var status = err.status || 500;
  var message = err.message || 'Something went wrong';
  res.status(status).send(message);
  next();
}); // Middleware para manejo de rutas no encontradas

app.use(function (req, res) {
  res.status(404).json({
    error: 'Page not found'
  });
});
var _default = app;
exports["default"] = _default;
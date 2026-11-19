import express from 'express';
import {
  addRelease,
  getReleases,
  getReleaseById,
  updateRelease,
  deleteRelease,
} from '../controllers/releases.controller.js';
import { verifyTokenAdmin } from '../middlewares/verifyTokenAdmin.js';
import { cacheMiddleware } from '../middlewares/cacheMiddleware.js';
import { subirImagen } from '../middlewares/subidaImagen.js';

const router = express.Router();

// Rutas con caché para lecturas
router.get('/releases', cacheMiddleware('releases'), getReleases);
router.get('/releases/:id', cacheMiddleware('release'), getReleaseById);

router.post('/releases', verifyTokenAdmin, subirImagen('releases', 'cover_image_url'), addRelease);

router.put('/releases/:id', verifyTokenAdmin, subirImagen('releases', 'cover_image_url'), updateRelease);
router.delete('/releases/:id', verifyTokenAdmin, deleteRelease);

export default router;

import express from 'express';
import { login, registrarUsuario } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', registrarUsuario);

export default router;

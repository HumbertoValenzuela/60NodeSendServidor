const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const { autenticarUsuario, usuarioAutenticado } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/',
[
  check('email', 'Agrega un email válido').isEmail(),
  check('password', 'El password no puede ir vacio').not().isEmpty(),
],
  autenticarUsuario
);

router.get('/',
  auth,
  usuarioAutenticado
);

module.exports = router;
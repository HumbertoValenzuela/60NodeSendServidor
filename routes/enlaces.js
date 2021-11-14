const express = require('express');
// const { check } = require('express-validator');
const router = express.Router();
const { check } = require('express-validator');
// const { eliminarArchivo } = require('../controllers/archivosController');
const { 
  nuevoEnlace, 
  obtenerEnlace, 
  todosEnlace, 
  tienePassword,
  verificarPassword
 } = require('../controllers/enlacesController');
const auth = require('../middleware/auth');

router.post('/',
  [
    check('nombre', 'Sube un archivo').not().isEmpty(),
    check('nombre_original', 'Sube un archivo').not().isEmpty(),
  ],
  auth,
  nuevoEnlace
);

// Listado de enlaces url
router.get('/',
  todosEnlace
);

router.get( '/:url',
  tienePassword,
  obtenerEnlace  
);

router.post('/:url',
  verificarPassword,
  obtenerEnlace
)


module.exports = router;
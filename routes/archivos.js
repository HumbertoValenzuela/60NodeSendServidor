const express = require('express');
const router = express.Router();
const { subirArchivo, descargar, eliminarArchivo } = require('../controllers/archivosController');
const auth = require('../middleware/auth');

router.post('/',
  auth,
  subirArchivo
);

router.get('/:archivo',
  descargar,
  eliminarArchivo
);
// router.delete('/:id',
//   eliminarArchivo
// );

module.exports = router;
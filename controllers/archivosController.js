const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');
const Enlaces = require('../model/Enlaces');


exports.subirArchivo = async (req, res, next) => {

  const configuracionMulter = {
    limits : { fileSize: req.usuario ? 10000000 : 1000000 },//1000000 =1mb
    // diskStorage guardar disco local
    storage: fileStorage = multer.diskStorage( {
      destination: ( req, file, callback ) => {
        // error, directorioActual
        callback(null, __dirname+'/../uploads')
      },
      // Agregar la extensión de un archivo
      filename: (req, file, callback) => {
        // const extension = file.mimetype.split('/')[1];
        const extension = file.originalname.substring( file.originalname.lastIndexOf('.'), file.originalname.length );
        // generar un id corto para el nombre y agregar la extension
        callback(null, `${shortid.generate()}${extension}` );
      },
      // Filtrar archivos(ej solo aceptar jpg)
      fileFilter: ( req, file, callback ) => {
        if( file.mimetype === 'application/pdf' ) {        
          return callback( null, true );//No se acepta pdf
        }
      }
  
    })
  };

  // usar la config de multer
  const upload = multer( configuracionMulter ).single('archivo');

  upload( req, res, async (error) => {
    // console.log(req.file);

    if ( !error) { //Si no hay error
      res.json( { archivo: req.file.filename });
    } else {
      console.log(error);
      return next();
    }

  });


};

exports.eliminarArchivo = async (req, res) => {
  // console.log('Desde eliminarArchivo');
  // console.log( req.archivo);

  try {
    // eliminar un archivo del S.O. __dirname(imprime hasta controllers) y concatenar el un template string
    fs.unlinkSync( __dirname + `/../uploads/${req.archivo}`);
    // console.log('archivo eliminado');
  } catch (error) {
    console.log(error);
  }
};

// Descarga un archivo
exports.descargar = async ( req, res, next ) => {

  // console.log('Descargando...');
  // Obtiene el enlace
  const { archivo } = req.params;
  const enlace = await Enlaces.findOne( { nombre: archivo });
  //console.log(enlace); // muestra el objeto con el nombre 

  const archivoDescarga = __dirname + '/../uploads/' + archivo;
  // Definir el Content-Disposition
  res.download( archivoDescarga );
  // archivo es del router.get('/:archivo'
  //console.log(req.params.archivo);// nos dará una ruta hacia el archivo

  // Eliminar el archivo y la entrada de la BD
  const { descargas, nombre, id } = enlace;//desestructuring 

  if ( descargas === 1) {
    // console.log('Si solo 1');
    // Eliminar el archivo
    req.archivo = nombre;
    
    // Eliminar la entrada de la bd
    await Enlaces.findOneAndRemove( id );
    next();
  } else {
    // Si las descargas son > a 1 then Restar 1
    // console.log('aun hay descargas');
    enlace.descargas--;//restar uno
    await enlace.save();
  }
}
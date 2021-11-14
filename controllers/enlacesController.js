const Enlaces = require('../model/Enlaces');
const shortid = require('shortid');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.nuevoEnlace = async( req, res, next ) => {
  // console.log('Desde nuevo enlace');

  // Revisar si hay errores
    // Mostrar mensajes de error de express-validator
    const errores = validationResult( req );
    if ( !errores.isEmpty() ) {
      return res.status(400).json( { errores: errores.array() } );
    }

  // console.log(req.body);
  // Crear un objeto de Enlace
  // Extraer nombre_original y password
  // const { nombre_original, password } = req.body;
  const { nombre_original, nombre } = req.body;
  
  // console.log(req.body);
  const enlace = new Enlaces();
  // url aleatorio. npm install shortid
  enlace.url = shortid.generate();
  enlace.nombre = nombre;
  enlace.nombre_original = nombre_original;
  // enlace.password = password;
  
  // Si el usuario esta autenticado
  // console.log(req.usuario);
  if ( req.usuario) {
    // Campos no son obligatorios vacios o con contenido
    const { password, descargas } = req.body;
    // Asignar a enlace el numero de descargas
    if ( descargas ) {
      // La cantidad de descarga que coloca el usuario
      enlace.descargas = descargas;
    }

    // Asignar un password
    if ( password ) {
      const salt = await bcrypt.genSalt(10);
      enlace.password = await bcrypt.hash( password, salt );
    }

    // Asignar el autor
    enlace.autor = req.usuario.id
  }  
  
  // ALmacenar en la BD
  // console.log(enlace);
  try {
    await enlace.save();
    return res.json( { msg: `${enlace.url}`} );
    next();
  } catch (error) {
    console.log(error);
  }
}

// Obtiene un listado de todos los enlaces
exports.todosEnlace = async( req, res ) => {
  try {
    // const enlaces = await Enlaces.find( {} );//listado completo
    const enlaces = await Enlaces.find( {} ).select('url -_id');
    // res.json(enlaces);//retorna un array de objeto
    res.json( { enlaces } );//Retorna un objeto que se llama enlaces
  } catch (error) {
    console.log(error);
  }
}


// Retorna si el enlace tiene password o no
exports.tienePassword = async( req, res, next) => {
  // Verificar si existe el enlace, con el campo url
   // console.log(req.params.url);
   try {
    const { url } = req.params;
    // console.log(url);
    // Verificar si existe el enlace
    const enlace = await Enlaces.findOne({ url });
    if(!enlace) {
        res.status(404).json({msg: 'Ese Enlace no existe'});
        // return next();
    }
    if(enlace.password) {
      return res.json({ password: true, enlace: enlace.url });
      //  res.json({ password: true, enlace: enlace.url });
      }
    next();
   } catch (error) {
     console.log(error)
   } 

}

// Verifica si el password es correcto
exports.verificarPassword = async( req, res, next) => {
  // console.log('verificando');
  //console.log(req.params);//leer la url
  //console.log(req.body);//obtener el password que escribe para poder descargar
  try {
    const { url } = req.params;
    const { password} = req.body;
    // Consultar por el enlace
    const enlace = await Enlaces.findOne({ url });
    // Verificar el password
    if(bcrypt.compareSync( password, enlace.password )) {      // Permitirle al usuario descargar el archivo     
        next();
    } else {
        return res.status(401).json({msg: 'Password Incorrecto'})
    }
  } catch (error) {
    console.log(error);
  }

}

// Obtener el enlace
exports.obtenerEnlace = async ( req, res, next) => {
  // console.log('Entro a Obtener Enlace');
  // console.log( req.params );
  // console.log( req.params.url );
  // Verificar si existe el enlace, con el campo url
  try {
    const { url } = req.params;

    // console.log(url);

    // Verificar si existe el enlace
    const enlace = await Enlaces.findOne({ url });
  // console.log(enlace); // en postman - Send - entrega en la terminal el registro que contiene el campo url

  // Se tiene dos partes el nombre del archivo y la url
  // Si el enlace existe
  if(!enlace) {
    res.status(404).json({msg: 'Ese Enlace no existe'});
    return next();
  }

    // Si el enlace existe
    // console.log(enlace.nombre)
    res.json({archivo: enlace.nombre, password: false})

  // next();
  } catch (error) {
    console.log(error);
  }

  next();
  // Si las descargas son iguales a 1 - borrar la entrada y borrar el archivo
//   const { descargas, nombre } = enlace;//desestructuring 
// return;
//   if ( descargas === 1) {
//     // console.log('Si solo 1');
//     // Eliminar el archivo
//     req.archivo = nombre;
//     next();
//     // Eliminar la entrada de la bd
//     await Enlaces.findOneAndRemove( req.params.url );
//   } else {
//     // Si las descargas son > a 1 then Restar 1
//     // console.log('aun hay descargas');
//     enlace.descargas--;//restar uno
//     await enlace.save();
//   }
  
}





const bcrypt = require('bcrypt');
const Usuario = require('../model/Usuario');
const { validationResult } = require('express-validator');

exports.nuevoUsuario = async(req, res) => {

  // Mostrar mensajes de error de express-validator
  const errores = validationResult( req );
  if ( !errores.isEmpty() ) {
    return res.status(400).json( { errores: errores.array() } );
  }

  // Verificar si un usuario existe
  const { email, password} = req.body;
  // Retorna el primero que encuentre
  let emailExiste = await Usuario.findOne( { email });

  if( emailExiste ) {
    return res.status(400).json( { msg: 'El usuario ya esta registrado'});
  }
      
  // console.log(req.body);
  // Guardar un usuario
  const usuario = await new Usuario(req.body);
  // Hashear el password
  const salt = await bcrypt.genSalt(10);
  usuario.password = await bcrypt.hash( password, salt );
  
  try {
    await usuario.save();  
    res.json( {msg: 'Usuario creado Correctamente'});
    
  } catch (error) {
    console.log(error);
  }

}
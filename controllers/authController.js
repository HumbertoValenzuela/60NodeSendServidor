const Usuario = require('../model/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config( { path: '.env' });
const { validationResult } = require('express-validator');

exports.autenticarUsuario = async( req, res, next ) => {

  // console.log(req.body);
  // Revisar si hay errores
  // Mostrar mensajes de error de express-validator
  const errores = validationResult( req );
  if ( !errores.isEmpty() ) {
    return res.status(400).json( { errores: errores.array() } );
  }

  // Buscar el usuario para ver si esta registrado
  const { email, password } = req.body;
  const usuario = await Usuario.findOne( { email } );
  // console.log(usuario);

  if ( !usuario ) {
    res.status(401).json({ msg: ' El usuario no existe'});
    return next();
  }

  // verificar el password y autentica el usuario
  // console.log('El usuario si existe');  
  if ( bcrypt.compareSync(password, usuario.password )) {
    //Generar JWT
    const token = jwt.sign( {
      id: usuario._id,
      email: usuario.email,
      nombre: usuario.nombre
    }, process.env.SECRETA, {
      expiresIn: '100h'
    } );

    // console.log(token);
    res.json( { token });
    // res.json( { msg: token });

  } else {
    res.status(401).json( { msg: "Password Incorrecto"});
    return next();
  }
}

exports.usuarioAutenticado = ( req, res, next ) => {
  // console.log(req.usuario);//comunicacion middleware auth y el controlador. Al usar postman este queda con los datos. esto es debido a que usuario fue asignado a req.usuario

  // respuesta json. y usuario obtiene el request
  res.json( { usuario: req.usuario } );
}
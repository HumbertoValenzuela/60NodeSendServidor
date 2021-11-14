const jwt = require('jsonwebtoken');
require('dotenv').config( { path: '.env' });
 
module.exports = ( req, res, next ) => {
  // console.log('yo soy un middleware');
  // console.log(req.get('Authorization'));

  const authHeader = req.get('Authorization');

  if ( authHeader ) {
    // Obtener el Token
    const token = authHeader.split(' ')[1];

    // Comprobar el JWT
    try {
      const usuario = jwt.verify(token, process.env.SECRETA);        
      req.usuario = usuario; // Asignar un usuario. sirve para que el usuario no lo pueda manipular. De esta forma el middleware se comunica con el controlador
      // res.json({ usuario }); // retornar un usuario
    } catch (error) {
      console.log(error);
      console.log('JWT no valido');
    }
  }
  return next();
}
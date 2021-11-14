const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const { nuevoUsuario } = require('../controllers/usuarioController');


router.post('/',
  [
    check('nombre', 'El nombre es Obligatorio').not().isEmpty(),
    check('email', 'Agrega un email válido').isEmail(),
    check('password', 'El password debe ser al menos de 6 caracteres').isLength({min: 6}),
  ],
  nuevoUsuario
);

module.exports = router;

// 480 Probando el Endpoint de crear usuarios
// Crear un controlador. es mejor crear un modelo y un controlador para que sea facil de mantener.
// En el controlador es donde se manda llamar el modelo.
// En este caso este controller crea un usuario
// Realizar prueba de conexión con PostMAn http://localhost:4000/api/usuarios
// Respuesta es : usuario controller en la Terminal

// 481 Creando el Schema
// Creando un modelo. Modelo es el que interactua la bd. El nombre archivo modelo comienza la primera con mayuscula

// 482 Creando el Primer Usuario
// Enviar info a EndPoint nuevoUsuario. Usando req.body
// Ir postman - body - json - crear un json con nombre email password, en la terminal entrega valor undefined. Se soluciona habilitando ller los valores de un body 
// { nombre: 'Humberto', email: 'correo@correo.cl', password: '123456' }
// usuarioController y guardar info que fue enviada por postman
// ver en mongodb que se creo un nuevo registro usuario.
// Si al intentar enviar otro campo, no lo grabará debido a que en el modelo Schema no se encuentra el campo

// 484 Hasheando Passwords
// npm install bcrypt

// 485 Anadiendo Express Validator
// npm install express-validator 
// validationResult para  Mostrar mensajes de error 
//  check para revisar que se cumplan ciertas condiciones con los datos

// 487 Verificando si un usuario existe o no
// Probar conexion post /api/auth
// authcontroller, validar el usuario existe o no

// 488 Revisando si el password es correcto o no
// bcrypt.compareSync se ocupa cuando es async await

// 489 Creando un JSON Web Token (JWT)
// npm install jsonwebtoken
// al crear el jwt copiarlo y usarlo en postman

// 491 Obtener el Usuario Autenticado por el JWT
// End Point sin middleware
// Mandar el JWT y verificar si es un JWT valido
// Para probar que se manda correctamente un token. ir a postman - get - Authoriztion - Bearer Token - pegar el token
// authHeader.split(' ')[1] la posicion 1 seria el token
// Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxODFkMTBkNWE0ZGYxODczNjgzNDg3MSIsImVtYWlsIjoiY29ycmVvQGNvcnJlby5jbCIsIm5vbWJyZSI6Ikh1bWJlcnRvIiwiaWF0IjoxNjM1OTA3OTk5LCJleHAiOjE2MzYyNjc5OTl9.zQJtsOEb4b3OW6oIcZX7BEyIol4o8J42sEs-NYjMxYM

 
// 492 Creando un Middleware de Autenticacion
// EndPoint con Middleware

// 493 Creando Routing y Controllers
// index crear EndPoint llamado enlaces y archivo de rutas enlace

// 495 Guardando enlaces en la BD
// modelo Enlacesjs: descarga: default: 1 password: default: null

// 496 Definiendo Numero de Descargas y Passwords a Enlaces
// Se necesita que algunas cosas sean accesibles por alguien que creo una cuenta. En este caso uno anonimo o una con cuenta puede crear enlaces y subir archivos. La difirencia va ser que el tenga cuenta va a poder un limite maximo de descargas, mientras que el otro no. Quien suba un enlace y tenga no tenga cuenta solamente a la primera descarga vamos a borrar el archivo.
// Como enviar con un usuario autenticado. Lo primero es iniciar sesion con el EndPoint api/auth para generar un JWT. Con ese JWT en api/enlaces - Authorization - bearer Token - pegar el JWT
// EnlaceController.js req.body y req.usuario para asignar valores y además enlace.autor = req.usuario.id
// hashear password.
// Si enlace solo tiene nombre_original entonces guarda de todas formas pero password tendrá valor null. 

// 497 Añadiendo Validación
// Se requiere el nombre y nombre_original del archivo que se esta subiendo
// Se estará validando la parte del JSON, una vez que este en React se guardará en el state y de ahí enviar la petición hacia el servidor. Solamente la referencia, no vamos a enviar el archivo completo en lo que es la creación de enlaces
// Abrir router - crear los check-validator
// nombre y nombre_original no deben ser vacios.
// Los archivos no se suben con el nombre solamente además debe ir una librería que se llama molter que existe en node. Cuando se suben archivos reales la validación de express validator no funciona porque los archivos se suben con algo llamado multipartfromdate y ahí no se puede validar con express-validator. Asi que se tiene que crear  un nuevo EndPoint crear un nuevo controlador que se encargue unicamente de la subida de archivos

// 499 Configurando Multer para Subir Archivos
// npm install multer. Boiler play básico multer
// si se quiere leer datos de form se hace req.body
// para leer archivos se hace req.file.
// postman - api/archivos - body - form-data - key (nombre de archivo) - posicionar lado derecho del input seleccionar file - Select Files (cualquier imagen)
// Al presionar send. en la terminal req.file entrega info
// {
//   fieldname: 'archivo',
//   originalname: 'logoHumberto.png',
//   mimetype: 'image/png',
//   destination: './uploads/',
//   filename: 'd4694a1ca94c6b8052dcd350086e062b',  
//path: 'uploads\\d4694a1ca94c6b8052dcd350086e062b', 
//   size: 16190
// }
// Al revisar la carpeta uploads se tendrá el archivo subido, pero no tendrá extensión

// 500 Creando una Configuración más avanzada con Multer
// Boiler play normal multer
// {
//   fieldname: 'archivo',
//   originalname: 'logoHumberto.png',
//   encoding: '7bit',
//   mimetype: 'image/png',
//   destination: 'C:\\htmlCSSJavaScript\\React\\reactguia\\49PROYECTOFirefoxSendconNodeyReact\\NodeSend-Servidor\\controllers/../uploads',    
//   filename: '_1nJ8fNn6.png',
//   path: 'C:\\htmlCSSJavaScript\\React\\reactguia\\49PROYECTOFirefoxSendconNodeyReact\\NodeSend-Servidor\\uploads\\_1nJ8fNn6.png',
//   size: 16190
// }

// 501 Renombrando los Archivos y añadiendo extensión
// Las personas que estan autenticadas, van a poder subir archivos más grandes.
// Actualmente se tiene como maximo 1mb tamaño, si sobre pasa el limite entrega error.
// Los usuarios que tienen una cuenta podrá subir archivos más grandes que 1mb.
// Otro problema es que algunos archivos son archivos.1.apellido.jpg
// substring para cortar la ultima parte
// const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
//quedará con doble punto debido a `${shortid.generate()}.${extension}`
// quitarlo `${shortid.generate()}${extension}`

// 502 Obteniendo un enlace de Descarga y sus archivos
// enlaceController - se sube un archivo, se publica, se lo vas enviar alguien para que pueda entrar y descargar el archivo. El sistema Firefox Send es que cuando un archivo es descargado es eliminado completamente, es decir, no se queda todo el tiempo en internet.
// En la bd tiene el campo descargas, si es 1 entonces se tiene que eliminar. Pero algunos que tienen descargas: 20 entonces debe de bajar a 19 y luego una vez llegado a 1 se tiene que eliminar.
// router enlaces: router.get( '/:url',
// enlacesController: la forma de obtener la direccion y el parametro url es con req.params porque es algo que se esta enviando por medio de la url
// postman crear GET api/enlaces/ y agregar un parametro
// En la terminal se obtendrá el resultado

// 503 Detectando cuantas descargas le quedan a un enlace
// obtener campo descargas. if si queda 1 borrar la entrada else restar y guardar.
// Se recomienda no tener los metodos tan cargadas. por lo tanto sacar la logica de eliminar a archivoController -eliminarArchivo. Entonces una vez que haga todo lo que tiene que hacer se pase al sgte Middleware. 
// Esto se realiza llendo a router de enlaces - y importar archivoController-eliminararchivo. entonces se tendrá dos métodos obtener y eliminar. PAra pasar del controlador hacia el otro. Es con next() 

// 504 Eliminando Archivos una vez alcanzamos el limite de descargas
// Creando una variable interna en enlaceControllers req.archivo = nombre. de esta forma en archivoController - eliminarArchivo - console.log( req.archivo); veremos desde eliminarArchivo el nombre archivo. Entonces estamos comunicando una variable del controlador enlaceController a archivoController.
// Eliminar un archivo valido: en la carpeta uploads - copiar el nombre
// y pegarlo en la bd nombre.
// Al ser express un framework de node entonces se tiene acceso a todas las librerías de node. Usar la libreria fs (filesystem de node).
// Permite crear o eliminar archivos
// postman - api/enlace/nombreurl - send - esto eliminará el archivo que se encuentra en uploads
// Sgte eliminar entrada de la bd
// await Enlaces.findOneAndRemove( req.params.url );
// Si borra el mismo entonces dirá un mensaje ese enlace no existe
// En router -archivos - delete ya no se manda llamar directamente, puesto que se manda llamar desde router - enlaces - get
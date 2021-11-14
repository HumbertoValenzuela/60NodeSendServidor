const mongoose = require('mongoose');
require('dotenv').config({ path: '.env'});

const conectarDB = async () => {
  try {
    await mongoose.connect( process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useFindAndModify: false,
      // useCreateIndex: true
    } );
    console.info('DB Conectada');

  } catch (error) {
    console.info('Hubo un error');
    console.log(error);
    // detiene el servidor
    process.exit(1);
  }
}

module.exports = conectarDB;
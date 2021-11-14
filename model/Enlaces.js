const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const enlaceSchema = new Schema( {
  url: {
    // Propiedades de mongoose
    type: String,
    required: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  nombre_original: {
    type: String,
    required: true,
  },
  descargas: {
    type: Number,
    default: 1
  },
  autor: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Usuarios',
    default: null
  },
  password: {
    type: String,
    default: null
  },
  creado: {
    type: Date,
    default: Date.now()
  }

});

module.exports = mongoose.model('Enlaces', enlaceSchema);
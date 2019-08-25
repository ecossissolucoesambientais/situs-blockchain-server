const mongoose = require('../database')

const schema = mongoose.Schema({
  name: {
    type: String,
    required: [true,"O nome da imagem é obrigatório"]
  },
  size: {
    type: Number,
    required: [true,"O tamanho da imagem é obrigatório"]
  },
  key: {
    type: String,
  },
  url: {
    type: String
  },
  createDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  updateDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  createUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updateUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

const Image = mongoose.model('Image', schema)

module.exports = Image


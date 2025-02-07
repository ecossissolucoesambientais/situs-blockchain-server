const mongoose = require('../database')

const schema = mongoose.Schema({
  type: {
    type: String,
    enum: ['Louça','Vidro','Metal','Amostra de carvão','Lítico','Madeira','Osso','Cerâmica','Deriv. de Plástico e Látex','Malacológico','Outros'],
    required: [false,"Tipo de evidência é um campo obrigatório"]
  },
  quantity: {
    type: Number,
    required: [false,"Quantidade é um campo obrigatório"]
  },
  note: {
    type: String,
    required: [false]
  },
  depth: {
    type: String,
    enum: ['Superfície','0-10cm','10-20cm','20-30cm','30-40cm','40-50cm','50-60cm','60-70cm','70-80cm','80-90cm','90-100cm','100-110cm'],
    required: [false,"Profundidade é um campo obrigatório"]
  },
  soilTexture: {
    type: String,
    required: [false]
  },
  soilColor: {
    type: String,
    required: [false]
  },
  soilConsistency: {
    type: String,
    required: [false]
  },
  point: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Point',
    required: true    
  },
  title: {
    type: String,
    required: [true, "Título é um campo obrigatório"]
  },
  note: {
    type: String,
    required: [true, "Descrição é um campo obrigatório"]
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

const Evidence = mongoose.model('Evidence', schema)

module.exports = Evidence
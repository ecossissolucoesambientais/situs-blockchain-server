const mongoose = require('../database')

const schema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true,"Nome é campo obrigatório"]
  },
  costumer: {
    type: String,
    trim: true,
    required: false
  },
  allowNum: {
    type: Number,
    required: [true,"Número de portaria é campo obrigatório"]
  },
  allowDtPUbl: {
    type: Date,
    required: [true,"Data de publicação da portaria é campo obrigatório"]
  },
  allowDtExp: {
    type: Date,
    required: [true,"data de vencimento da portaria é campo obrigatório"]
  },
  staffMainCoord: {
    type: String,
    required: [true,"Coordenador é campo obrigatório"]
  },
  staffFieldCoord: {
    type: String,
    required: [true,"Coordenador de campo é campo obrigatório"]
  },
  staffFieldArch: {
    type: String,
    required: [true,"Arqueólogo de campo é campo obrigatório"]
  },
  state: {
    type: String,
    required: [true,"Estado é campo obrigatório"]
  },
  city: {
    type: String,
    required: [true,"Cidade é campo obrigatório"]
  },
  location: {
    type: String,
    required: false
  },
  activities: {
    type: Array,
    required: [true,"Atividades é campo obrigatório"]
  }
  createDate: {
    type: Date,
    default: Date.now
  }
  updateDate: {
    type: Date,
    default: Date.now
  }
  createUser: {
    type: mongoose.schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
  updateUser: {
    type: mongoose.schema.Types.ObjectId,
    ref: 'User',
    required: true
  }


})

const Project = mongoose.model('Project', schema)

module.exports = Project


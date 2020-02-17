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
  allowDtPubl: {
    type: Date,
    required: [true,"Data de publicação da portaria é campo obrigatório"],
    default: Date.now
  },
  allowDtExp: {
    type: Date,
    required: [true,"data de vencimento da portaria é campo obrigatório"],
    default: Date.now
  },
  staffMainCoord: {
    type: String,
    required: [true,"Coordenador é campo obrigatório"]
  },
  staffFieldCoord: {
    type: String,
    required: [false,"Coordenador de campo é campo obrigatório"]
  },
  staffFieldArch: {
    type: String,
    required: [false,"Arqueólogo de campo é campo obrigatório"]
  },
  state: {
    type: String,
    required: false
  },
  city: {
    type: String,
    required: false
  },
  location: {
    type: String,
    required: false
  },
  activities: {
    type: Array,
    required: [true,"Atividades é campo obrigatório"]
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

const Project = mongoose.model('Project', schema)

module.exports = Project


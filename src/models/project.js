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
    type: String,
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
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
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


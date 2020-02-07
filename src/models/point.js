const mongoose = require('../database')

const schema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true,"Nome é campo obrigatório"]
  },
  location: {
    type: {
      type: String, 
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  locationEffective: {
    type: {
      type: String, 
      enum: ['Point'],
      required: false
    },
    coordinates: {
      type: [Number],
      required: false
    }
  },
  note: {
    type: String,
    required: [false]
  }, 
  relief: {
    type: String,
    required: [false]
  },
  soil: {
    type: String,
    required: [false]
  },
  vegetation: {
    type: String,
    required: [false]
  },
  status: {
    type: String,
    enum: ['Em aberto','Realizado','Cancelado'],
    default: 'Em aberto',
    required: [false]
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true    
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

const Point = mongoose.model('Point', schema)

module.exports = Point


const mongoose = require('../database')
const bcrypt = require('bcryptjs')

const schema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: false
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  isEmailConfirmed: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  },
  createDate: {
    type: Date,
    default: Date.now
  }
})

schema.pre('save', async function(next) {
  const hash = await bcrypt.hash(this.password, 10)
  this.password = hash
  next()
})

const User = mongoose.model('User', schema)

module.exports = User
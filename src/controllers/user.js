const User = require('../models/user')

const emailRegex = /\S+@\S+\.\S+/

// List all users
exports.list = async (req, res) => {
  try {
    const users = await User
      .find()
    return res.status(200).send(users)
  }
  catch (err) {
    return res.status(400).send({ error: 'Error loading users' })
  }
}

// Get user by ID
exports.show = async (req, res) => {
  try {
    const user = await User
      .findById(req.params.id)
      res.status(200).send(user)
  }
  catch (err) {
    return res.status(400).send({ error: 'User not found' })
  }
}

// Update user by ID
exports.update = async (req, res) => {
  try {    
    if (!req.body.email.match(emailRegex)) {
      return res.status(400).send({ error: 'Digite um formato de e-mail válido' })
    }

    const user = await User
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      if (user) {
        res.status(200).send({ message: 'User updated', user })
      } else {
        return res.status(400).send({ error: 'User not found' })
      }
  }
  catch (err) {
    return res.status(400).send({ error: 'Error updating user' })
  }
}

// Remove user by ID
exports.delete = async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id)
      if (user) {
        res.status(200).send({ message: 'User removed', user })
      }
      else {
        return res.status(400).send({ error: 'User not found' })
      }
  }
  catch (err) {
    return res.status(400).send({ error: 'Error deleting user' })
  }
}




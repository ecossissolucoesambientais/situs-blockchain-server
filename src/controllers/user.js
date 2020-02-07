const User = require('../models/user')
const Image = require('../models/image')


const emailRegex = /\S+@\S+\.\S+/

// List all users
exports.list = async (req, res) => {
  try {
    const users = await User
      .find()
    return res.status(200).send(users)
  }
  catch (err) {
    return res.status(400).send({ error: 'Erro ao listar usuários' })
  }
}

// List all images from this point
exports.images = async (req, res) => {
  try {
    const images = await Image
      .find({refModel: 'User', refId: req.params.id})
    return res.status(200).send(images)
  } catch (err) {
    return res.status(400).send({ error: 'Erro ao listar imagens' })
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
    return res.status(400).send({ error: 'Usuário não encontrado' })
  }
}

// Update user by ID
exports.update = async (req, res) => {
  try {    
    if (!req.body.email.match(emailRegex)) {
      return res.status(400).send({ error: 'Formato de e-mail inválido' })
    }

    const user = await User
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      if (user) {
        res.status(200).send({ message: 'Usuário atualizado', user })
      } else {
        return res.status(400).send({ error: 'Usuário não encontrado' })
      }
  }
  catch (err) {
    return res.status(400).send({ error: 'Erro ao atualizar usuário' })
  }
}

// Remove user by ID
exports.delete = async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id)
      if (user) {
        res.status(200).send({ message: 'Usuário removido', user })
      }
      else {
        return res.status(400).send({ error: 'Usuário não encontrado' })
      }
  }
  catch (err) {
    return res.status(400).send({ error: 'Erro ao remover usuário' })
  }
}




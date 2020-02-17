const User = require('../models/user')

const bcrypt = require('bcryptjs')


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

    if(req.body.password) {
      const user = await User
        .findById(req.params.id).select('+password')
      const passwordAux = user.password 
      console.log(passwordAux)
      if(!await bcrypt.compare(req.body.oldPassword,passwordAux)) {
        return res.status(400).send({ error: 'Senha atual não confere' })
      }
      req.body.oldPassword = undefined
      req.body.password = await bcrypt.hash(req.body.password, 10)
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
    return res.status(400).send({ error: err })
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




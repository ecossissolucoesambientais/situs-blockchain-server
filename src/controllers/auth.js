const User = require('../models/user')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
/* const crypto = require('crypto') */
/* const mailer = require('../modules/mailer') */

const emailRegex = /\S+@\S+\.\S+/

function generateToken(params = {}) {
  return jwt.sign(params, process.env.SECRET, {
    expiresIn: 99999999999
  })
}

exports.register = async (req, res) => {
  const { email, password, confirmPassword } = req.body  

  try {
    if (!password)
      return res.status(400).send({ error: 'Senha não fornecida'});

    if (await User.findOne({ email }))
      return res.status(400).send({ error: 'Nome de usuário já utilizado' })
    
    if (!email.match(emailRegex)) {
      return res.status(400).send({ error: 'Digite um formato de e-mail válido' })
    }

    if (password !== confirmPassword)
      return res.status(400).send({ error: 'As senhas digitadas não conferem'})

    const user = await User.create(req.body)
    
    user.password = undefined

    return res.send({ 
      user,
      token: generateToken({ id: user.id })
    })
  } catch (err) {
    return res.status(400).send({ error: 'O registro do usuário falhou' })
  }
}

exports.login = async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email }).select('+password')

  if (!user)
    return res.status(400).send({ error: 'Usuário não encontrado' })

  if (!await bcrypt.compare(password, user.password))
  return res.status(400).send({ error: 'Senha inválida' })

  user.password = undefined  

  res.send({ 
    user, 
    token: generateToken({ id: user.id })
  })
}

/* exports.forgotPassword = async (req, res) => {
  const { email } = req.body

  try {
    const user = await User.findOne({ email })

    if (!user)
      return res.status(400).send({ error: 'User not found' })

    const token = crypto.randomBytes(20).toString('hex')

    const now = new Date()
    now.setHours(now.getHours() + 1)

    await User.findByIdAndUpdate(user.id, {
      '$set': {
        passwordResetToken: token,
        passwordResetExpires: now
      }
    })

    mailer.sendMail({
      to: email,
      from: 'rodrigo@hiel.com.br',
      template: 'auth/forgot_password',
      context: { token }
    }, (err) => {
      if (err)
        return res.status(400).send({ error: 'Cannot send forgot password email' })

        res.status(200).send({ message: 'Email for password recovery was sent'})
    })
    
  } catch (err) {
    res.status(400).send({ error: 'Error on forgot password. Try again '})
  }
}

exports.resetPassword = async (req, res) => {
  const { email, password, token } = req.body

  try {
    const user = await User.findOne({ email })
      .select('+passwordResetToken passwordResetExpires')

    if (!user)
      return res.status(400).send({ error: 'User not found' })

    if (token !== user.passwordResetToken)
      return res.status(400).send({ error: 'Token invalid' })

    const now = new Date()

    if (now > user.passwordResetExpires)
      return res.status(400).send({ error: 'Token expired. Generate a new one' })

    user.password = password
    res.status(200).send({ message: 'Password changed' })

    await user.save()

  } catch (err) {
    res.status(400).send({ error: 'Cannot reset password. Try again' })
  }
} */

exports.validateToken = async (req, res) => {
  const token = req.body.token || ''
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    return res.status(200).send({ valid: !err })
  })
}
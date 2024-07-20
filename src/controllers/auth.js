const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const Mail = require('../config/nodemailer')

const emailRegex = /\S+@\S+\.\S+/

function generateToken(params = {}, expiresIn = '99999d') {
  return jwt.sign(params, process.env.SECRET, { expiresIn })
}

function sendConfirmationEmail(userId, email) {
  emailConfirmationToken = generateToken({ userId }, '1d')

  Mail.sendMail({
    to: email,
    from: '"Situs Arqueologia" <situs@ecoss.is>',
    subject: 'Confirmação de email',
    template: 'confirmEmail',
    context: {
      email,
      confirmationUrl: `${process.env.SERVER_URL}/auth/confirmEmail/${emailConfirmationToken}`,
    }
  })
}

exports.register = async (req, res) => {
  const { email, password, confirmPassword } = req.body  

  try {
    if (!password)
      return res.status(400).send({ error: 'Senha não fornecida'})

    if (await User.findOne({ email }))
      return res.status(400).send({ error: 'Nome de usuário já utilizado' })
    
    if (!email.match(emailRegex))
      return res.status(400).send({ error: 'Digite um formato de e-mail válido' })

    if (password !== confirmPassword)
      return res.status(400).send({ error: 'As senhas digitadas não conferem'})

    const user = await User.create(req.body)
    
    user.password = undefined
    userId = user._id
    token = generateToken({ userId })
    sendConfirmationEmail(userId, email)

    return res.send({ user, token })
  } catch (err) {
    return res.status(400).send({ error: 'O registro do usuário falhou', message: err.message || undefined })
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
  token = generateToken({ userId: user._id })

  res.send({ user, token })
}

exports.forgotPassword = async (req, res) => {
  const { email } = req.body

  try {
    const user = await User.findOne({ email })

    if (!user)
      return res.status(400).send({ error: 'Usuário não encontrado.' })

    const token = crypto.randomBytes(3).toString('hex')

    const now = new Date()
    now.setHours(now.getHours() + 1)

    await User.findByIdAndUpdate(user.id, {
      '$set': {
        passwordResetToken: token,
        passwordResetExpires: now
      }
    })

    await Mail.sendMail({
      to: email,
      from: '"Situs Arqueologia" <situs@ecoss.is>',
      subject: 'Recuperação de senha',
      template: 'forgotPassword',
      context: {
        token,
        firstName: (user.name.split(" "))[0],
      }
    })
    
    return res.status(200).send()
  } catch (err) {
    return res.status(400).send(err)
  }
}

exports.resetPassword = async (req, res) => {
  const { email, password, token } = req.body

  try {
    const user = await User
      .findOne({ email })
      .select('+passwordResetToken passwordResetExpires')

    if (!user)
      return res.status(400).send({ error: 'Usuário não encontrado.' })

    if (token !== user.passwordResetToken)
      return res.status(400).send({ error: 'Token inválido.' })

    if (!password)
      return res.status(400).send({ error: 'Senha não enviada.'})

    const now = new Date()

    if (now > user.passwordResetExpires)
      return res.status(400).send({ error: 'Token expirado.' })

    user.password = password
    await user.save()

    res.status(200).send({ message: 'Senha alterada com sucesso.' })
  } catch (err) {
    res.status(400).send({ error: 'Erro ao atualizar senha.' })
  }
}

exports.validateToken = async (req, res) => {
  const token = req.body.token || ''
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    return res.status(200).send({ valid: !err })
  })
}

exports.confirmEmail = async (req, res) => {
  const { token } = req.params

  try {
    const { userId } = jwt.verify(token, process.env.SECRET)

    await User.findByIdAndUpdate(userId, { isEmailConfirmed: true })

    return res.render('emailConfirmation', { message: 'Email confirmado com sucesso!' })    
  } catch (err) {
    if (err.message === 'invalid signature' || err.message === 'jwt malformed')
      return res.render('emailConfirmation', { message: 'Token inválido!' })

    if (err.message === 'jwt expired')
      return res.render('emailConfirmation', { message: 'Este token expirou!' })

    return res.render('emailConfirmation', { message: err.message || 'Não foi possível validar o email.' })
  }
}

exports.resendEmailConfirmation = async (req, res) => {
  const userId = req.userId

  try {
    const user = await User.findById(userId)

    if (user) {
      if (user.isEmailConfirmed) {
        res.status(400).send('Email já confirmado.')
      } else {
        sendConfirmationEmail(userId, user.email)
        res.status(200).send('Email de confirmação enviado.')
      }
    } else {
      res.status(400).send('Usuário não encontrado.')
    }
  } catch (err) {
    res.status(400).send({ error: err })
  }
}

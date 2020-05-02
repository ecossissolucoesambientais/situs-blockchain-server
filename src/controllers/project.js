const Project = require('../models/project')
const User = require('../models/user')
const Mail = require('../config/nodemailer')
const jwt = require('jsonwebtoken')

function generateToken(params = {}, expiresIn = '7d') {
  return jwt.sign(params, process.env.SECRET, { expiresIn })
}

exports.list = async (req, res) => {
  try {
    const projects = await Project
      .find({
        $or: [
          {
            createUser: req.userId
          },
          {
            "users": {
              _id: req.userId
            }
          }
        ]
      })
      .populate(['users', 'createUser', 'updateUser'])    
    return res.status(200).send(projects)
  } catch (err) {
    return res.status(400).send({ error: 'Erro ao listar projetos', message: err })
  }
}

exports.show = async (req, res) => {
  try {
    const project = await Project
      .find({ createUser: req.userId, _id: req.params.id })
      .populate(['users', 'createUser', 'updateUser'])

    return res.status(200).send(project)
  } catch (err) {
    return res.status(400).send({ error: 'Projeto não encontrado' })
  }
}

exports.new = async (req, res) => {
  try {
    const project = await Project.create(req.body)    
    return res.send({ project })
  } catch (err) {
    return res.status(400).send({ error: err.message })
  }
}

exports.update = async (req, res) => {
  try {    
    const project = await Project
      .findOneAndUpdate({createUser: req.userId, _id: req.params.id}, req.body, { new: true }) // TO DO: filtrar projeto pelo id do coordenador
      if (project) {
        return res.status(200).send({ message: 'Projeto atualizado', project })
      } else {
        return res.status(400).send({ error: 'Projeto não encontrado' })
      }
  }
  catch (err) {
    return res.status(400).send({ error: 'Erro ao atualizar projeto' })
  }
}

exports.delete = async (req, res) => {
  try {
    const project = await Project
      .findOneAndRemove({createUser: req.userId, _id: req.params.id})

    if (project) {
      return res.status(200).send({ message: 'Projeto removido' })
    } else {
      return res.status(400).send({ error: 'Projeto não encontrado' })
    }
  }
  catch (err) {
    return res.status(400).send({ error: 'Erro ao remover projeto' })
  }
}

exports.inviteUser = async (req, res) => {
  try {
    const requesterId = req.userId
    const { projectId, userEmail } = req.params

    const project = await Project
      .findById(projectId)
      .populate(['createUser', 'users'])

    if (project) {
      if (requesterId != project.createUser._id) {
        return res.status(403).send('Sem permissão.')
      }

      const user = await User
        .findOne({ email: userEmail })

      if (user) {
        const filter = project.users.filter(user => user.email === userEmail)
        
        if (userEmail == project.createUser.email || filter.length > 0) {
          return res.status(400).send('Este usuário já faz parte da equipe.')
        }

        token = generateToken({ userId: user._id, projectId, requesterId })
        
        await Mail.sendMail({
          to: userEmail,
          from: '"Situs Arqueologia" <nao-responda@situsarqueologia.com.br>',
          subject: 'Convite para projeto',
          template: 'projectInvite',
          context: {
            projectName: project.name,
            invitedFirstName: (user.name.split(" "))[0],
            requesterName: project.createUser.name,
            confirmationUrl: `${process.env.SERVER_URL}/projects/${projectId}/acceptInvite/${user._id}/${token}`
          },
        })

        return res.status(200).send('Usuário convidado com sucesso.')
      }

      return res.status(400).send('Usuário não encontrado.')
    } 
    
    return res.status(400).send('Projeto não encontrado.')
  } catch (err) {
    console.log(err)
    return res.status(400).send('Erro ao convidar usuário para projeto.')
  }  
}

exports.acceptInvite = async (req, res) => {
  try {
    const { projectId, userId, token } = req.params
    const tokenData = jwt.verify(token, process.env.SECRET)

    if (tokenData.projectId != projectId || tokenData.userId != userId) {
      return res.render('emailConfirmation', { message: 'Token inválido!' })
    }

    const user = await User.findById(userId)

    if (!user) {
      return res.render('emailConfirmation', { message: 'Token inválido!' })
    }

    const project = await Project.findById(projectId)

    const filter = project.users.filter(user => user._id == userId)

    if (userId == project.createUser._id || filter.length > 0) {
      return res.render('emailConfirmation', { message: 'Este usuário já faz parte da equipe.' })
    }

    await Project.findByIdAndUpdate(projectId, { $push: { users: user } })

    return res.render('emailConfirmation', { message: 'Convite aceito com sucesso!' })
  } catch (err) {
    if (err.message === 'invalid signature' || err.message === 'jwt malformed')
      return res.render('emailConfirmation', { message: 'Token inválido!' })

    if (err.message === 'jwt expired')
      return res.render('emailConfirmation', { message: 'Este token expirou!' })

    return res.render('emailConfirmation', { message: err.message || 'Não foi possível aceitar o convite.' })
  }
}

exports.removeUser = async (req, res) => {
  try {
    const requesterId = req.userId
    const { projectId, userId } = req.params    

    const user = await User.findById(userId)

    if (!user) {
      return res.status(400).send({ error: 'Usuário não encontrado.' })
    }

    const project = await Project
      .findById(projectId)
      .populate(['users', 'createUser', 'updateUser'])

    if (!project) {
      return res.status(400).send({ error: 'Projeto não encontrado.' })
    }

    if (project.createUser._id == userId) {
      return res.status(400).send({ error: 'Não é possível remover o coordenador do projeto.' })
    }

    if (requesterId != userId && requesterId != project.createUser._id) {
      return res.status(403).send('Sem permissão.')
    }

    const filter = project.users.filter(user => user._id == userId)

    if (filter.length === 0) {
      return res.status(400).send('Este usuário não faz parte da equipe.')
    }

    await project.users.pull(userId)
    await project.save()

    return res.status(200).send(project)
  } catch (err) {
    return res.status(400).send({ error: 'Erro ao remover usuário da equipe.' })
  }  
}

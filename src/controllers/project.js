const Project = require('../models/project')

// List all projects
exports.list = async (req, res) => {
  try {
    const projects = await Project
      .find({createUser: req.userId}) // TO DO: filtrar pelo id do coordenador.
    return res.status(200).send(projects)
  }
  catch (err) {
    return res.status(400).send({ error: 'Erro ao listar projetos' })
  }
}

// Get project by ID
exports.show = async (req, res) => {
  try {
    const project = await Project
      .find({createUser: req.userId,id: req.params.id}) // TO DO: filtrar projeto pelo id do coordenador
      res.status(200).send(project)
  }
  catch (err) {
    return res.status(400).send({ error: 'Projeto não encontrado' })
  }
}

// Create project
exports.new = async (req, res) => {
  try {
    const project = await Project.create(req.body)
    
    return res.send({ 
      project
    })
  } catch (err) {
    return res.status(400).send({ error: err.message })
  }
}

// Update project by ID
exports.update = async (req, res) => {
  try {    
    const project = await Project
      .find({createUser: req.userId})
      .findByIdAndUpdate(req.params.id, req.body, { new: true }) // TO DO: filtrar projeto pelo id do coordenador
      if (project) {
        res.status(200).send({ message: 'Projeto atualizado', project })
      } else {
        return res.status(400).send({ error: 'Projeto não encontrado' })
      }
  }
  catch (err) {
    return res.status(400).send({ error: 'Erro ao atualizar projeto' })
  }
}

// Remove project by ID
exports.delete = async (req, res) => {
  try {
    const project = await Project.find({createUser: req.userId}).findByIdAndRemove(req.params.id) // TO DO: filtrar projetos pelo id do coordenador
      if (project) {
        res.status(200).send({ message: 'Projeto removido', Project })
      }
      else {
        return res.status(400).send({ error: 'Projeto não encontrado' })
      }
  }
  catch (err) {
    return res.status(400).send({ error: 'Erro ao remover projeto' })
  }
}




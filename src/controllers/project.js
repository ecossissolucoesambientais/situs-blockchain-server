const Project = require('../models/project')

// List all projects
exports.list = async (req, res) => {
  try {
    const projects = await Project
      .find()
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
      .findById(req.params.id)
      res.status(200).send(project)
  }
  catch (err) {
    return res.status(400).send({ error: 'Projeto não encontrado' })
  }
}

// Update project by ID
exports.update = async (req, res) => {
  try {    
    const project = await Project
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
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
    const project = await Project.findByIdAndRemove(req.params.id)
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




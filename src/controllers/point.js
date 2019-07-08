const Point = require('../models/point')

// List all points
exports.list = async (req, res) => {
  try {
    const points = await Point
      .find()
    return res.status(200).send(points)
  }
  catch (err) {
    return res.status(400).send({ error: 'Erro ao listar pontos' })
  }
}

// Get point by ID
exports.show = async (req, res) => {
  try {
    const point = await Point
      .findById(req.params.id)
      res.status(200).send(point)
  }
  catch (err) {
    return res.status(400).send({ error: 'Ponto não encontrado' })
  }
}

// Create point
exports.new = async (req, res) => {

  try {
    const point = await Point.create(req.body)
    
    return res.send({ 
      point
    })
  } catch (err) {
    return res.status(400).send({ error: 'Erro ao criar ponto' })
  }
}

// Update point by ID
exports.update = async (req, res) => {
  try {    
    const point = await Point
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      if (point) {
        res.status(200).send({ message: 'Ponto atualizado', point })
      } else {
        return res.status(400).send({ error: 'Ponto não encontrado' })
      }
  }
  catch (err) {
    return res.status(400).send({ error: 'Erro ao atualizar ponto' })
  }
}

// Remove point by ID
exports.delete = async (req, res) => {
  try {
    const point = await Point.findByIdAndRemove(req.params.id)
      if (point) {
        res.status(200).send({ message: 'Ponto removido', Point })
      }
      else {
        return res.status(400).send({ error: 'Ponto não encontrado' })
      }
  }
  catch (err) {
    return res.status(400).send({ error: 'Erro ao remover ponto' })
  }
}
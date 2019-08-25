//const Point = require('../models/point')

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

/* CREATE POINT ORIGINAL
// Create point
exports.new = async (req, res) => {
  const { projectId, userId, geojson } = req.body
 geojson.features.map(async point => {
  try {    
    var point_create = await Point.create({
      name: point.properties.name, 
      location: {
        type: "Point",
        coordinates: point.geometry.coordinates
      }, 
      project: projectId, 
      createUser: userId,
      updateUser: userId
    }) 
    return res.send({ 
      point_create
    })
  } catch (err) {
    return res.status(400).send({ error: err })
  }
 })

}
*/

exports.new = async (req, res) => {
  const { projectId, userId, geojson } = req.body
  const pointsArray = geojson.features.map(point => {
    return {
    name: point.properties.name, 
    location: {
      type: "Point",
      coordinates: point.geometry.coordinates
    }, 
    project: projectId, 
    createUser: userId,
    updateUser: userId    
    }
  })

  try {
    const points = await Point.insertMany(pointsArray)   
    return res.send({ 
      points
    })
  } catch (err) {
    return res.status(400).send({ error: 'Erro ao criar pontos' })
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
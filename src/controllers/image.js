const Image = require('../models/image')

exports.list = async (req, res) => {
  try {
    const images = await Image
      .find()
    return res.status(200).send(images)
  }
  catch (err) {
    return res.status(400).send({ error: 'Erro ao listar imagens' })
  }
}

// Get image by ID
exports.show = async (req, res) => {
  try {
    const image = await Image
      .findById(req.params.id)
      res.status(200).send(image)
  }
  catch (err) {
    return res.status(400).send({ error: 'Imagem não encontrada' })
  }
}

// Remove image by ID
exports.delete = async (req, res) => {
  try {
    const image = await Image.findByIdAndRemove(req.params.id)
      if (image) {
        res.status(200).send({ message: 'Imagem removida', Image })
      }
      else {
        return res.status(400).send({ error: 'Imagem não encontrada' })
      }
  }
  catch (err) {
    return res.status(400).send({ error: 'Erro ao remover imagem' })
  }
}

// Upload image associated with object refId in model refModel
exports.upload = async (req, res) => {
  try {
    const { originalname: name, size, key, location: url = ''} = req.file
    const image = await Image.create({
        name, 
        size,
        key,
        url,
        refId: req.body.refId,
        refModel: req.body.refModel,
        createUser: req.userId,
        updateUser: req.userId
    })
    return res.status(200).send(image)
  }
  catch (err) {
    return res.status(400).send({ error: 'Erro ao criar imagem.' })  }
}
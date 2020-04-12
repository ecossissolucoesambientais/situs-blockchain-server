const Evidence = require('../models/evidence')
const Image = require('../models/image')

// List all evidences
exports.list = async (req, res) => {
  try {
    const evidences = await Evidence
      .find()
    return res.status(200).send(evidences)
  } catch (err) {
    return res.status(400).send({ error: 'Erro ao listar evidências' })
  }
}

// List all images from this evidence
exports.images = async (req, res) => {
  try {
    const images = await Image
      .find({refModel: 'Evidence', refId: req.params.id})
    return res.status(200).send(images)
  } catch (err) {
    return res.status(400).send({ error: 'Erro ao listar imagens' })
  }
}

// Get evidence by ID
exports.show = async (req, res) => {
  try {
    const evidence = await Evidence
      .findById(req.params.id)
      res.status(200).send(evidence)
  } catch (err) {
    return res.status(400).send({ error: 'Evidência não encontrada' })
  }
}


// Create evidence
exports.new = async (req, res) => {
  try {
    const {type,quantity,note,depth,soil,point} = req.body
    const evidence_exists = await Evidence
      .find({type,quantity,note,depth,soil,point})
    if(evidence_exists.length===0) {
      const evidence = await Evidence.create(req.body)
      res.status(200).send(evidence)
    } else
      return res.status(200).send({ error: "Evidência já cadastrada." })

  } catch (err) {
    return res.status(400).send({ error: err })
  }
}


// Update evidence by ID
exports.update = async (req, res) => {
  try {    
    const evidence = await Evidence
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      if (evidence) {
        res.status(200).send({ message: 'Evidência atualizada', evidence })
      } else {
        return res.status(400).send({ error: 'Evidência não encontrada' })
      }
  } catch (err) {
    return res.status(400).send({ error: 'Erro ao atualizar evidência' })
  }
}

// Remove evidence by ID
exports.delete = async (req, res) => {
  try {
    const evidence = await Evidence.findByIdAndRemove(req.params.id)
      if (evidence) {
        res.status(200).send({ message: 'Evidência removida', Evidence })
      }
      else {
        return res.status(400).send({ error: 'Evidência não encontrada' })
      }
  } catch (err) {
    return res.status(400).send({ error: 'Erro ao remover evidência' })
  }
}


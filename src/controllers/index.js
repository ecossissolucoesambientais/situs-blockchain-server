exports.get = (req, res) => {
  res.status(200).send({ 
    title: "situs-server",
    version: "Sei lá..."
  })
}
const ExcelJS = require('exceljs')
const Evidence = require('../models/evidence')
const Point = require('../models/point')


exports.xlsx = async(req,res) => {
/*  
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Situs';
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet("Evidencias");
  worksheet.columns = [
      { header: 'Id', key: '_id', width: 36 },
      { header: 'Status', key: 'status', width: 120 },
      { header: 'Tipo', key: 'type', width: 120 },
      { header: 'Quantidade', key: 'quantity', width: 120 },
      { header: 'Notas', key: 'note', width: 120 },
      { header: 'Profundidade', key: 'depth', width: 120 },
      { header: 'Solo', key: 'soil', width: 120 },
      { header: 'Id do Ponto', key: 'point', width: 120 },
      { header: 'Latitude', key: 'point_lat', width: 120 },
      { header: 'Longitude', key: 'point_lon', width: 120 },
      { header: 'Status do Ponto', key: 'point_status', width: 120 },
      { header: 'Id do Projeto', key: 'project', width: 120 },
      { header: 'Nome do Projeto', key: 'project_name', width: 120 },
      { header: 'Usuário que criou', key: 'createUser', width: 120 },
      { header: 'Usuário que atualizou', key: 'updateUser', width: 120 },
      { header: 'Data de criação', key: 'createDate', width: 120 },
      { header: 'Data de atualização', key: 'updateDate', width: 120 }
  ];
*/
  let evidences_xls = []
  try {
    const points = await Point.find({project:req.params.id})
    points.map(async point => {
      try {    
        //console.log(point)
        const evidences = await Evidence({point: point._id})
        evidences.map(evidence => {
          try {
            evidences_xls.push({ ...evidences, point_lon: point.location.coordinates[1], point_lat: point.location.coordinates[0], point_status: point.status, project: point.project })
          } catch(err) {
            return res.status(400).send({ error: err })
          }
        })
      } catch (err) {
        return res.status(400).send({ error: err })
      }
    })
    res.status(200).send(evidences_xls)
  } catch (err) {
      return res.status(400).send({ error: err })   
  }

/*
  worksheet.addRow({word: 'Olá', def: 'Mundo'});

  workbook.xlsx.writeFile('Project.xlsx')
    .then(function() {
      res.download('Project.xlsx', 'Project.xlsx')
  });
*/
}




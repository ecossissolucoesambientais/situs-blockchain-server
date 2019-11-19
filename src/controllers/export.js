const ExcelJS = require('exceljs')
const Evidence = require('../models/evidence')
const Point = require('../models/point')
const mongoose = require('../database')

var xls = []

function mostra(regs) {
  let regs_xls = []
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Situs';
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet("Evidencias");
  worksheet.columns = [
      { header: 'Id', key: 'id', width: 36 },
      { header: 'Status', key: 'status', width: 50 },
      { header: 'Tipo', key: 'type', width: 50 },
      { header: 'Quantidade', key: 'quantity', width: 50 },
      { header: 'Notas', key: 'note', width: 50 },
      { header: 'Profundidade', key: 'depth', width: 50 },
      { header: 'Solo', key: 'soil', width: 50 },
      { header: 'Id do Ponto', key: 'point', width: 50 },
      { header: 'Longitude', key: 'point_lon', width: 50 },
      { header: 'Latitude', key: 'point_lat', width: 50 },
      { header: 'Status do Ponto', key: 'point_status', width: 50 },
//      { header: 'Id do Projeto', key: 'project', width: 120 },
//      { header: 'Nome do Projeto', key: 'project_name', width: 120 },
      { header: 'Usuário que criou', key: 'createUser', width: 50 },
      { header: 'Usuário que atualizou', key: 'updateUser', width: 50 },
      { header: 'Data de criação', key: 'createDate', width: 50 },
      { header: 'Data de atualização', key: 'updateDate', width: 50 }
  ];

  regs.map(reg => {
    if(reg.evidences) {        
        regs_xls.push({
          id: reg.evidences._id,
          status: reg.evidences.status,
          type: reg.evidences.type,
          quantity: reg.evidences.quantity,
          note: reg.evidences.note,
          depth: reg.evidences.depth,
          soil: reg.evidences.soil,
          point: reg.location.point,
          point_lon: reg.location.coordinates[0],
          point_lat: reg.location.coordinates[1],
          point_status: reg.status,
          createUser: reg.createUser,
          updateUser: reg.updateUser,
          createDate: reg.createDate,
          updateDate: reg.updateDate
        });
    }
  })

  worksheet.addRows(regs_xls)

  workbook.xlsx.writeFile('Project.xlsx')
    .then(function() {
      return 1
  });
}

async function buildExport(project_id) {
    return await Point.aggregate([      
       {
        "$lookup": {
          "from": "evidences",
          "localField": "_id",
          "foreignField": "point",
          "as": "evidences"
        }
       },
       {
          "$unwind": {
            "path": "$evidences",
            "preserveNullAndEmptyArrays": true           
         }
       },
       {
        "$lookup": {
          "from": "images",
          "localField": "evidences._id",
          "foreignField": "refId",
          "as": "images"
        }
       },
       {
          "$unwind": {
            "path": "$images",
            "preserveNullAndEmptyArrays": true           
         }
       },      
       {
            "$match": {
            "project" : mongoose.Types.ObjectId(project_id)
            }       
       }
    ])
    .exec(function (err, res) {
      if (err) return handleError(err);
      mostra(res)
    })
}  


exports.xlsx_old = async(req,res) => {
  
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

  evidences_xls = []
  try {
    const points = await Point.find({project:req.params.id})
    points.map(async point => {
      const evidences = await Evidence.find({point: point._id})     
      evidences.map(async evidence => {     
        evidences_xls.push({ ...evidence, point_lon: point.location.coordinates[1], point_lat: point.location.coordinates[0], point_status: point.status, project: point.project })
      })
      console.log(evidences_xls)
    })
    return res.status(200).send({evidences_xls})
  } catch (err) {
    return res.status(400).send({ error: err })   
  }


  worksheet.addRow({word: 'Olá', def: 'Mundo'});

  workbook.xlsx.writeFile('Project.xlsx')
    .then(function() {
      res.download('Project.xlsx', 'Project.xlsx')
  });

}


exports.xlsx = async (req,res) => {
    buildExport(req.params.id)
    res.download('Project.xlsx', 'Project.xlsx')    
}



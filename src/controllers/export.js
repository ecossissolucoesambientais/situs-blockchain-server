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
      { header: 'Id da Evidência', key: 'id', width: 30 },
      { header: 'Tipo', key: 'type', width: 30 },
      { header: 'Quantidade', key: 'quantity', width: 15 },
      { header: 'Notas', key: 'note', width: 80 },
      { header: 'Profundidade', key: 'depth', width: 30 },
      { header: 'Solo', key: 'soil', width: 30 },
      { header: 'Imagem', key: 'image', width: 120 },     
      { header: 'Id do Ponto', key: 'point', width: 30 },
      { header: 'Nome do Ponto', key: 'point_name', width: 50 },     
      { header: 'Longitude do Ponto', key: 'point_lon', width:30 },
      { header: 'Latitude do Ponto', key: 'point_lat', width: 30 },
      { header: 'Status do Ponto', key: 'point_status', width: 30 },
      { header: 'Id do Projeto', key: 'project', width: 30 },
      { header: 'Nome do Projeto', key: 'project_name', width: 30 },
      { header: 'Usuário que criou', key: 'createUser', width: 30 },
      { header: 'Usuário que atualizou', key: 'updateUser', width: 30 },
      { header: 'Data de criação', key: 'createDate', width: 30 },
      { header: 'Data de atualização', key: 'updateDate', width: 30 }
  ];

  regs.map(reg => {
    if(reg.evidences) {        
        regs_xls.push({
          // antes é necessário testar se reg.evidences._id já existe em regs_xls; caso não exista, pula.
          id: reg.evidences._id,
          type: reg.evidences.type,
          quantity: reg.evidences.quantity,
          note: reg.evidences.note,
          depth: reg.evidences.depth,
          soil: reg.evidences.soil,
          image: reg.images.url, 
          point: reg._id,
          point_name: reg.name,
          point_lon: reg.location.coordinates[0],
          point_lat: reg.location.coordinates[1],
          point_status: reg.status,
          project: reg.project,
          project_name: reg.projects.name,
          createUser: reg.createUser_aux.name,
          updateUser: reg.updateUser_aux.name,
          createDate: reg.createDate,
          updateDate: reg.updateDate
          //
        });
    }
  })

  worksheet.addRows(regs_xls)

  workbook.xlsx.writeFile('Project_' + regs_xls[0].project + '.xlsx')
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
        "$lookup": {
          "from": "projects",
          "localField": "project",
          "foreignField": "_id",
          "as": "projects"
        }
       },
       {
          "$unwind": {
            "path": "$projects",
            "preserveNullAndEmptyArrays": true           
         }
       },      
       {
        "$lookup": {
          "from": "users",
          "localField": "createUser",
          "foreignField": "_id",
          "as": "createUser_aux"
        }
       },
       {
          "$unwind": {
            "path": "$createUser_aux",
            "preserveNullAndEmptyArrays": true           
         }
       },      
       {
        "$lookup": {
          "from": "users",
          "localField": "updateUser",
          "foreignField": "_id",
          "as": "updateUser_aux"
        }
       },
       {
          "$unwind": {
            "path": "$updateUser_aux",
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


exports.xlsx = async (req,res) => {
    buildExport(req.params.id)
    res.download('Project_' + req.params.id + '.xlsx', 'Project_' + req.params.id + '.xlsx')    
}



const ExcelJS = require('exceljs')
const Project = require('../models/project')
const User = require('../models/user')
const Point = require('../models/point')
const mongoose = require('../database')
const moment = require('moment-timezone')
const Mail = require('../config/nodemailer')

exports.xlsx = async (req, res) => {
  const { id } = req.params
  const { email } = req.body

  try {
    const project = await Project.findById(id)
    const user = await User.findById(project.createUser)
    const data = await Point.aggregate([
      {
        "$lookup": {
          "from": "evidences",
          "localField": "_id",
          "foreignField": "point",
          "as": "evidences"
        }
      },
      {
        "$lookup": {
          "from": "images",
          "localField": "_id",
          "foreignField": "refId",
          "as": "pointImages"
        }
      },
      {
        "$lookup": {
          "from": "images",
          "localField": "evidences._id",
          "foreignField": "refId",
          "as": "evidencesImages"
        }
      },
      {
        "$lookup": {
          "from": "users",
          "localField": "createUser",
          "foreignField": "_id",
          "as": "createUser"
        }
      },
      {
        "$lookup": {
          "from": "users",
          "localField": "updateUser",
          "foreignField": "_id",
          "as": "updateUser"
        }
      },
      {
        "$match": {
          "project": mongoose.Types.ObjectId(id)
        }
      }
    ])

    const workbook = new ExcelJS.Workbook()
    workbook.creator = 'Situs Arqueologia'
    const soilSurveysSheet = workbook.addWorksheet('Sondagens')

    soilSurveysSheet.columns = [
      { header: 'Projeto', key: 'projectName', width: 15 },
      { header: 'Ponto', key: 'pointName', width: 15 },
      { header: 'Status', key: 'pointStatus', width: 10 },
      { header: 'Relevo', key: 'pointRelief', width: 15 },
      { header: 'Vegetação', key: 'pointVegetation', width: 15 },
      { header: 'Atualizado por', key: 'updateUser', width: 20 },
      { header: 'Última atualização', key: 'updateDate', width: 20 },
      { header: 'Observações', key: 'pointNotes', width: 12 },
      { header: 'Fotos do entorno', key: 'pointImages', width: 30 },
      { header: 'Evidências', key: 'evidences', width: 10 },
      { header: 'Fotos de evidências', key: 'evidencesImages', width: 30 },
      { header: 'Latitude', key: 'latitude', width: 12 },
      { header: 'Longitude', key: 'longitude', width: 12 },
    ]
    const rows = data && data.length > 0 ? data.map(soilSurvey => {
      let pointImages = ''
      let evidencesImages = ''

      if (soilSurvey.pointImages.length > 0) {
        soilSurvey.pointImages.forEach(image => pointImages += `● ${image.url}\r\n`) 
      }

      if (soilSurvey.evidencesImages.length > 0) {
        soilSurvey.evidencesImages.forEach(image => evidencesImages += `● ${image.url}\r\n`)
      }

      return {
        projectName: project.name,
        pointName: soilSurvey.name,
        pointStatus: soilSurvey.status,
        pointRelief: soilSurvey.relief,
        pointVegetation: soilSurvey.vegetation,
        updateUser: soilSurvey.updateUser.length > 0 ? soilSurvey.updateUser[0].name : 'Usuário removido',
        updateDate: moment(soilSurvey.updateDate).tz('America/Sao_Paulo').format('L LT'),
        pointNotes: soilSurvey.note,
        pointImages,
        evidences: soilSurvey.evidences.length,
        evidencesImages,
        latitude: soilSurvey.location.coordinates[1],
        longitude: soilSurvey.location.coordinates[0]
      }
    }) : []
    soilSurveysSheet.addRows(rows)
    soilSurveysSheet.getRow(1).font = { bold: true }
    
    const content = await workbook.xlsx.writeBuffer()
    const date = moment().tz('America/Sao_Paulo').format('DD-MM-YYYY')
    const hour = moment().tz('America/Sao_Paulo').format('kk')
    const minute = moment().tz('America/Sao_Paulo').format('mm')
    const extension = 'xlsx'
    const filename = `Sondagens_${date}_${hour}h${minute}.${extension}`
    const contentDisposition = 'attachment'
    const contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

    if (email) {
      await Mail.sendMail({
        to: email,
        from: '"Situs Arqueologia" <nao-responda@situsarqueologia.com.br>',
        subject: 'Exportação de dados',
        template: 'soilSurveysExport',
        context: { 
          projectName: project.name,
          firstName: (user.name.split(" "))[0]
        },
        attachments: [
          {
            filename,
            content,
            contentDisposition,
            contentType,
          }
        ]
      })
    }

    res.setHeader('Content-Type', contentType)
    res.setHeader('Content-Disposition', `${contentDisposition}; filename=${filename}`)
    res.status(200).send(content)
  } catch (err) {
    console.log(err)
    res.status(400).send({ err })
  }
}

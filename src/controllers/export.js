const ExcelJS = require('exceljs')

exports.xlsx = async(req,res) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Project';
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet("Definitions");

  worksheet.columns = [
      { header: 'Word', key: 'word', width: 36 },
      { header: 'Definition', key: 'def', width: 120 }
  ];

  worksheet.addRow({word: 'Olá', def: 'Mundo'});

  workbook.xlsx.writeFile('Project.xlsx')
    .then(function() {
      res.download('Project.xlsx', 'Project.xlsx')
  });

}


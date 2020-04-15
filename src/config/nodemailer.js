const nodemailer = require('nodemailer')
const exphbs = require('express-handlebars')
const nodemailerhbs = require('nodemailer-express-handlebars')
const path = require('path')

class Mail {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      },
      secure: true,
    })

    this.configureTemplates()
  }

  configureTemplates() {
    const viewPath = path.resolve(__dirname, '..', 'views', 'mail')

    this.transporter.use(
      'compile',
      nodemailerhbs({
        viewEngine: exphbs.create({
          layoutsDir: path.resolve(viewPath, 'layouts'),
          partialsDir: path.resolve(viewPath, 'layouts'),
          defaultLayout: 'default',
          extname: '.hbs',
        }),
        viewPath,
        extName: '.hbs',
      })
    )
  }

  sendMail(message) {
    return this.transporter.sendMail({
      ...message,
    })
  }
}

module.exports = new Mail()
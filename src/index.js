// Required for the application to read environment variables from .env file
require('dotenv').config()

const PORT = process.env.PORT || 3000
const express = require('express')
const morgan =require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const handlebars = require('express-handlebars')
const moment = require('moment')
require('moment/locale/pt-br')

moment.locale('pt-br')

// Import Routes
const indexRoute = require('./routes/index')
const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')
const projectRoute = require('./routes/project')
const pointRoute = require('./routes/point')
const evidenceRoute = require('./routes/evidence')
const imageRoute = require('./routes/image')
const exportRoute = require('./routes/export')

// Define app as an Express instance
const app = express()

// Body-parser config
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// morgan
app.use(morgan('dev'))

// CORS
app.use(cors())

// Provide Routes
app.use('/', indexRoute)
app.use('/auth', authRoute)
app.use('/users', userRoute)
app.use('/projects', projectRoute)
app.use('/points', pointRoute)
app.use('/evidences', evidenceRoute)
app.use('/images',imageRoute)
app.use('/export',exportRoute)

// Handlebars
app.set('view engine', 'hbs')
app.set('views', 'src/views/pages')
app.engine('hbs', handlebars({
  layoutsDir: 'src/views/pages/layouts',
  partialsDir: 'src/views/pages/layouts',
  extname: 'hbs',
  defaultLayout: 'default',
}))

// Create Server
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

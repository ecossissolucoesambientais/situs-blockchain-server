// Required for the application to read environment variables from .env file
require('dotenv').config()

const PORT = process.env.PORT || 3000
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

// Import Routes
const indexRoute = require('./routes/index')
const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')
const projectRoute = require('./routes/project')
const pointRoute = require('./routes/point')


// Define app as an Express instance
const app = express()

// Body-parser config
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// CORS
app.use(cors())

// Provide Routes
app.use('/', indexRoute)
app.use('/auth', authRoute)
app.use('/users', userRoute)
app.use('/projects', projectRoute)
app.use('/points', pointRoute)


// Create Server
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
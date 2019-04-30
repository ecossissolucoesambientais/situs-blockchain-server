const mongoose = require('mongoose')

// Set up default mongoose connection
mongoose.connect(process.env.MONGODB_URI, { 
  useNewUrlParser: true
})

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise

// Get the default connection
var db = mongoose.connection

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

module.exports = mongoose
const multer = require('multer')
const path = require('path')
const crypto = require('crypto')
const aws = require('aws-sdk')
const multerS3 = require('multer-s3') 

const storageTypes = {
	local: multer.diskStorage({
	  	destination: (req, file, cb) => {
	  		cb(null, process.env.IMAGES_FOLDER)
	  	},
	  	filename: (req, file, cb) => {
	  		crypto.randomBytes(16, (err, hash) => {
	  			if(err) cb(err)

	  			file.key = `${hash.toString('hex')}-${file.originalname}`

	  			cb(null, file.key)
	  		})
	  	}
	}),
	s3: multerS3({
		s3: new aws.S3(),
		bucket: 'situs',
		contentType: multerS3.AUTO_CONTENT_TYPE, 
		acl: 'public-read',
		key: (req, file, cb) => {
	  		crypto.randomBytes(16, (err, hash) => {
	  			if(err) cb(err)

	  			const fileName = `${hash.toString('hex')}-${file.originalname}`

	  			cb(null, fileName)
	  		})			
		}			
	})		
}

module.exports = {
  dest: process.env.IMAGES_FOLDER,
  storage: storageTypes['local'],
  limits: {
  	fileSize: 20*1024*1024
  },
  fileFilter: (req, file, cb) => {
  	const allowedMimes = [
  		'image/jpeg',
  		'image/pjpeg',
  		'image/png',
  		'image/gif'
  	]

  	if (allowedMimes.includes(file.mimetype)) {
  		cb(null, true)
  	} else {
  		cb(new Error("Invalid format."))
  	}
  },
}
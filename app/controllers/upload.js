// 'use strict'

// const multer = require('multer')
// const AWS = require('aws-sdk')

// AWS.config.update({
//     accessKeyId: CONFIG.AWS.S3.ACCESS_KEY,
//     secretAccessKey: CONFIG.AWS.S3.SECRETs
// })

// const s3 = new AWS.S3()

// app.use(multer({
//   dest: './public/uploads/',
//   limits : { fileSize:100000 },
//   rename: function (fieldname, filename) {
//     return filename.replace(/\W+/g, '-').toLowerCase()
//   },
//   onFileUploadData: function (file, data, req, res) {
//     var params = {
//       Bucket: 'makersquest',
//       Key: file.name,
//       Body: data
//     }

//     s3.putObject(params, function (perr, pres) {
//       if (perr) {
//         console.log('Error uploading data: ', perr)
//       } else {
//         console.log('Successfully uploaded data to myBucket/myKey')
//       }
//     })
//   }
// }))
//

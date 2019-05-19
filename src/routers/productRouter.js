const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const uploadDir = path.join(__dirname + '/../uploads/img' )
console.log(__dirname);

const {productControl} = require('../controllers/index')

const imgStorage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, uploadDir)
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + file.fieldname + path.extname(file.originalname))
    }
})

const upImage = multer ({
    storage: imgStorage,
    limits: {
        fileSize: 10000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){ // will be error if the extension name is not one of these
            return cb(new Error('Please upload image file (jpg, jpeg, or png)')) 
        }
        cb(undefined, true)
    }
})
//CREATE PRODUCTS
router.post('/manageproduct/add', upImage.single('image'), productControl.post )
//read
router.get('/manageproduct/list', productControl.read)
// get img
router.get('/manageproduct/list/:photo', productControl.readImg)
//delete
router.delete('/manageproduct/list/delete/:product_id', productControl.delete)
//edit
router.patch('/editproduct/:product_id', upImage.single('image'), productControl.update)

module.exports = router
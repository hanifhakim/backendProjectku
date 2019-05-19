const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const uploadDir = path.join(__dirname + '/../uploads/avatar' )
console.log(__dirname);
const {authControl, userControl} = require('../controllers/index')

const avaStorage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, uploadDir)
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + file.fieldname + path.extname(file.originalname))
    }
})

const upAva = multer ({
    storage: avaStorage,
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

//GET USER by USERNAME
router.get('/users/:username', authControl.getUser )

//CREATE USERS
router.post('/users', authControl.register)

//VERIFY LOGIN
router.get('/verify/:username', authControl.verify)

//Get AVa
router.get(`/editprofile/:user_id/:photo`, userControl.getAva )

//Delete ava
router.delete('/users/deleteAva/:user_id', userControl.deleteAva)

//LOGIN
router.post('/users/login', authControl.login)

//DELETE
router.delete('/users/:userid', userControl.delete)

//EDIT Profile(25/4)
router.patch('/editprofile/:user_id', upAva.single('avatar') ,userControl.edit)

module.exports = router
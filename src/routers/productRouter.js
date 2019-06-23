const router = require('express').Router()
const multer = require('multer')
const path = require('path')
// const fs = require('fs')

const uploadDir = path.join(__dirname + '/../uploads/img' )
// console.log(__dirname);

const {productControl} = require('../controllers/index')

const imgStorage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, uploadDir)
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + file.originalname)
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
//Create Product (add product)
router.post('/manageproduct/add', upImage.single('image'), productControl.create)

//Read Product
router.get('/manageproduct/list', productControl.readManage)
router.get('/product/:cat', productControl.read)

//Read Product Home
router.get('/getproducthome', productControl.readProductHome)

//Read Product With ORDER by name
router.get('/sortnameasc', productControl.readNameAsc)
router.get('/sortnamedesc', productControl.readNameDesc)

//Read Product With ORDER by Date
router.get('/sortdateasc', productControl.readDateAsc)
router.get('/sortdatedesc', productControl.readDateDesc)

//Read Product With ORDER by Price
router.get('/sortpriceasc', productControl.readPriceAsc)
router.get('/sortpricedesc', productControl.readPriceDesc)

//Read Product With CATEGORY & ORDER by name
router.get('/catsortnameasc/:cat', productControl.readCatNameAsc)
router.get('/catsortnamedesc/:cat', productControl.readCatNameDesc)

//Read Product With CATEGORY & ORDER by Date
router.get('/catsortdateasc/:cat', productControl.readCatDateAsc)
router.get('/catsortdatedesc/:cat', productControl.readCatDateDesc)

//Read Product With CATEGORY & ORDER by Price
router.get('/catsortpriceasc/:cat', productControl.readCatPriceAsc)
router.get('/catsortpricedesc/:cat', productControl.readCatPriceDesc)


// router.get('/product/seafood', productControl.readSeafood)
// router.get('/product/freshwater', productControl.readFreshwater)

//Read One Product
router.get('/detailproduct/:product_id', productControl.readOne)

// Get Img product
router.get('/manageproduct/list/:photo', productControl.readImg)

// delete product
router.delete('/manageproduct/list/delete/:product_id', productControl.delete)

//edit product
router.patch('/editproduct/:product_id', upImage.single('image'), productControl.update)

module.exports = router
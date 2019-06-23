const router = require('express').Router()
const multer = require('multer')
const path = require('path')
// const fs = require('fs')

const uploadDir = path.join(__dirname + '/../uploads/payment' )

const {orderControl} = require('../controllers/index')

const paymentStorage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, uploadDir)
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + file.fieldname + path.extname(file.originalname))
    }
})

const upPayment = multer ({
    storage: paymentStorage,
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

//Create Order on table orders
router.post('/order/:user_id', orderControl.createOrder)

//Create order detail from order_id
router.post('/orderdetails/:product_id', orderControl.createOrderDetails)

//Create shipment on table shipment
router.post('/ordershipment', orderControl.createShipment)

//Creare payment on table payment
router.post('/orderpayment', orderControl.createPayment)

//Create INVOICE
router.post('/invoice/:username/:order_id', orderControl.createInvoice)

//Update payment table with image upload
router.patch('/orderpayment/:order_id', upPayment.single('payment_img'), orderControl.createPaymentImg)

//Update status order_status 'paid'
router.patch('/confirmpayment/:order_id', orderControl.updateConfirmPayment)

//Update status order_status 'cancelled'
router.patch('/cancelpayment/:order_id', orderControl.updateCancelPayment)

//Update payment table set img null
router.patch('/deletepaymentimg/:order_id', orderControl.deletePaymentImg)

//Update status order_status 'delivered'
router.patch('/confirmshipment/:order_id', orderControl.updateConfirmShipment)

//Update table stock minus (looping product_id)
router.patch('/minusstock/:product_id', orderControl.updateStock)

//Read Order Details
router.get(`/getorderdetails/:order_id`, orderControl.getOrderDetails)

//Read Stock with product_id
router.get(`/getstock/:product_id`, orderControl.getStock)

//Read Image Payment (link)
router.get(`/manageorders/:photo`, orderControl.getPaymentImg)

//Read all order on admin
router.get('/getallorder', orderControl.getAllOrder)
    //Sort by
    router.get(`/sortorderstatus`, orderControl.sortOrderStatus)
    //Sort by
    router.get(`/sortorderpayment`, orderControl.sortOrderPayment)
    //Sort by
    router.get(`/sortordershipment`, orderControl.sortOrderShipment)
    //Sort by
    router.get(`/sortorderdateasc`, orderControl.sortOrderNew)
    //Sort by
    router.get(`/sortorderdatedesc`, orderControl.sortOrderOld)

//Read order one user
router.get('/getorder/:user_id', orderControl.getOrder)

//Read order one user
router.get('/getallorderuser/:user_id', orderControl.getAllOrderUser)

//Read payment with order_id
router.get('/getpayment/:order_id', orderControl.getPayment)

//Read order one user one id
router.get('/getorder/:user_id/:order_id', orderControl.getOrderWithId)

module.exports = router
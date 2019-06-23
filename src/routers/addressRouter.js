const router = require('express').Router()

const {addressControl} = require('../controllers/index')

//Add address To User
router.post('/address/:user_id', addressControl.create)

//Get address with userid
router.get('/getaddress/:user_id', addressControl.read)

//Delete Address 
router.delete('/address/delete/:user_id/:address_id', addressControl.delete)

//Edit address
router.patch('/editaddress/:user_id/:address_id', addressControl.edit)


module.exports = router
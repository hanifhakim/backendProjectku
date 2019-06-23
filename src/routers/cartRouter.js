const router = require('express').Router()

const {cartControl} = require('../controllers/index')

// Create Cart
router.post('/addCart/:user_id/:product_id', cartControl.createCart)

//Read Cart and Wishlist
router.get('/shop/cart/:user_id', cartControl.readCart)

//Read CartOnly
router.get('/shop/cartOnly/:user_id', cartControl.readCartOnly)

//Delete Cart
router.delete('/cart/delete/:user_id/:product_id', cartControl.deleteCart)

//Update Cart to Wishlist
router.patch('/cart/towishlist/:user_id/:product_id', cartControl.toWishlist)

//Update Wishlist to Cart
router.patch('/cart/tocart/:user_id/:product_id', cartControl.toCart)

//Update Counter Change qty
router.patch('/cart/minqty/:user_id/:product_id', cartControl.minqtyCart)

//Read Wishlist Only
router.get('/shop/wishlist/:user_id', cartControl.readWishlist)
module.exports = router
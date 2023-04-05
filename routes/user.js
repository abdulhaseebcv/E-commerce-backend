const express = require('express');
const router = express.Router();
const userHelpers = require('../Helpers/userHelpers');

//Signup with username,email,password
router.post('/register', (req, res) => {
    console.log('req: ', req.body);
    userHelpers.doSignup(req.body).then((result) => {
        if (!result) {
            res.status(200).json({ code: 400, message: 'User already exist' })
        } else {
            res.status(201).json({ code: 200, message: 'success' })
        }
    }).catch((error) => {
        res.status(404).json({ code: 404, message: 'Error in signup' })
    })
})

//Login with email and password
router.post('/login', (req, res) => {
    console.log('req: ', req.body);
    userHelpers.doLogin(req.body).then((result) => {
        if (result.status) {
            res.status(200).json({ code: 200, message: 'login success', user: result.user })
        } else {
            res.status(200).json({ code: 400, message: 'Invalid email or password' })
        }
    }).catch((err) => {
        res.status(400).json({ code: 400, message: err })
    })
})

//Add to cart
router.post('/add-to-cart', (req, res) => {
    console.log('req.cartid: ', req.body);
    userHelpers.addToCart(req.body).then((result) => {
        res.status(200).json({ message: 'product added to cart successfully' })
    }).catch((error) => {
        res.status(404).json({ code: 404, message: 'error in adding to cart' })
    })
})

//Get cart products
router.get('/get-cart-products/:id', (req, res) => {
    console.log('req: ', req.params.id);
    userHelpers.getCartProducts(req.params.id).then((result) => {
        console.log('result: ', result);
        res.status(200).json(result)
    }).catch((err) => res.status(400).json({ message: 'Unauthorized' }))
})

// Delete cart product
router.post('/delete-cart-product', (req, res) => {
    const userId = req.body.userId
    const productId = req.body.productId
    userHelpers.deleteCartProduct(userId, productId).then((result) => {
        console.log('result: ', result);
        res.status(200).json(result)
    }).catch()
})


//Get current user
router.get('/user/:id', (req, res) => {
    const userId = req.params.id
    userHelpers.getCurrentUser(userId).then((result) => {
        res.status(200).json(result)
    }).catch((err => res.status(400).json({ message: 'Unauthorized' })))
})

module.exports = router
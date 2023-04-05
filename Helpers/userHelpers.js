const db = require('../connection')
const collection = require('../config/collection')
const bcrypt = require('bcrypt')
const { ObjectId } = require('mongodb')

module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.password = await bcrypt.hash(userData.password, 10)
            const user = await db.get().collection(collection.userCollection).findOne({ email: userData.email })
            if (user) {
                resolve(false)
            } else {
                db.get().collection(collection.userCollection).insertOne(userData).then((result) => {
                    resolve(true)
                }).catch((error) => reject(error))
            }
        })
    },

    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let response = {}
            const user = await db.get().collection(collection.userCollection).findOne({ email: userData.email })
            console.log('user: ', user);
            if (user) {
                bcrypt.compare(userData.password, user.password).then((result) => {
                    if (result) {
                        response.status = true
                        const { _id } = user
                        response.user = _id
                        resolve(response)
                    } else {
                        response.status = false
                        resolve(response.status)
                    }
                })
            } else {
                reject('User not found')
            }

        })
    },

    getCurrentUser: (userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.userCollection).findOne({ _id: new ObjectId(userId) }).then((result) => {
                const { password, ...userDetails } = result
                resolve(userDetails)
            }).catch((err) => reject('Invalid data'))
        })
    },

    addToCart: (data) => {
        const { userId, product } = data
        return new Promise(async (resolve, reject) => {
            const userCart = await db.get().collection(collection.cartCollection).findOne({ user: new ObjectId(userId) })
            if (userCart) {
                !userCart.products.find(item => item.id === product.id) && db.get().collection(collection.cartCollection).updateOne({ user: new ObjectId(userId) }, {
                    $push: {
                        products: product
                    }
                }).then((result) => resolve(result)).catch((error) => reject(error))
            } else {
                let cartObject = {
                    user: new ObjectId(userId),
                    products: [product]
                }
                db.get().collection(collection.cartCollection).insertOne(cartObject).then((result) => resolve(result)).catch((error) => reject(error))
            }
        })
    },

    getCartProducts: (userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.cartCollection).findOne({ user: new ObjectId(userId) }).then((result) => resolve(result)).catch((err) => reject(err))
        })
    },

    deleteCartProduct: (userId, productId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.cartCollection).updateOne(
                { user: new ObjectId(userId) },
                { $pull: { products: { id: productId } } }
            ).then(result => resolve(result)).catch((err) => reject(err))
        })
    }
}
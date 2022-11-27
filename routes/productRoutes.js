const express = require('express')
const productRouter = express.Router()

const rateLimiter = require('express-rate-limit')
const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    msg: 'Too many requests from this IP, please try again after 15 minutes'
  }
})

const { createProduct, getAllProducts } = require('../controllers/productController')
const { uploadProductImage } = require('../controllers/uploadsController')

productRouter.route('/').get(getAllProducts).post(apiLimiter, createProduct)
productRouter.route('/uploads').post(apiLimiter, uploadProductImage)

module.exports = productRouter

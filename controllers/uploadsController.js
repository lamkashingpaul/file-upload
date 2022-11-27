const path = require('path')
const fs = require('fs')

const cloudinary = require('cloudinary').v2

const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')

const uploadProductImageLocal = async (req, res) => {
  if (!req.files) {
    throw new CustomError.BadRequestError('No file Uploaded')
  }

  const productImage = req.files.image

  if (!productImage.mimetype.startsWith('image')) {
    throw new CustomError.BadRequestError('Please Upload Image')
  }

  const maxSize = 1024 * 1024

  if (productImage.size > maxSize) {
    throw new CustomError.BadRequestError('Please upload image smaller than 1KB')
  }

  await productImage.mv(path.resolve(__dirname, `../public/uploads/${productImage.name}`))

  return res.status(StatusCodes.OK).json({ image: { src: `/uploads/${productImage.name}` } })
}

const uploadProductImage = async (req, res) => {
  const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, { use_filename: true, folder: 'file-upload' })
  fs.unlinkSync(req.files.image.tempFilePath)
  return res.status(StatusCodes.OK).json({ image: { src: result.secure_url } })
}

module.exports = {
  uploadProductImageLocal,
  uploadProductImage
}

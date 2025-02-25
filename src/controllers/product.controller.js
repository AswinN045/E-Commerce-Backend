const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { productService } = require('../services');
const { cloudinary } = require('../utils/storage')

const uploadImage = catchAsync(async (req, res,) => {
  if (!req.file) {
    res.status(500).json({ message: 'No image file provided' });
  }
  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'products',
        allowed_formats: ['jpg', 'png', 'gif'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(req.file.buffer);
  });

  res.status(200).json({ message: 'Image uploaded successfully', imageUrl: result.secure_url });
});


const insertProduct = catchAsync(async (req, res) => {
  const data = await productService.insertProduct(req.body);
  if (data.statusValue === 0) {
    res.status(500).json(data);
  } else {
    res.status(201).json(data);
  }

});

const updateProduct = catchAsync(async (req, res) => {
  const data = await productService.updateProduct(req.params.id, req.body);
  if (data.statusValue === 0) {
    res.status(500).json(data);
  } else {
    res.status(200).json(data);
  }

});
const deleteProduct = catchAsync(async (req, res) => {
  const data = await productService.deleteProduct(req.params.id);
  if (data.statusValue === 0) {
    res.status(500).json(data);
  } else {
    res.status(200).json(data);
  }

});
const listProduct = catchAsync(async (req, res) => {
  const data = await productService.listProducts();
  if (data.statusValue === 0) {
    res.status(500).json(data);
  } else {
    res.status(200).json(data);
  }

});

module.exports = {
  uploadImage,
  insertProduct,
  updateProduct,
  deleteProduct,
  listProduct
}
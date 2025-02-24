const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { productService } = require('../services');

const insertProduct = catchAsync(async (req, res) => {
  const userData = await productService.createProduct(req.body);
  
});

module.exports = {
  insertProduct
}
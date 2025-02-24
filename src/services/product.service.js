const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Products } = require('../models')

const createProduct = async (product) => {
    const data = await Products.create(product);
    console.log(data);

};

module.exports = {
    createProduct
}
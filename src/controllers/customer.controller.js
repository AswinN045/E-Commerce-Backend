const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { customerService } = require('../services');

const listProducts = catchAsync(async (req, res) => {
    const data = await customerService.listProducts(req.query);
    if (data.statusValue === 0) {
        res.status(500).json(data);
    } else {
        res.status(200).json(data);
    }

});

const addToCart = catchAsync(async (req, res) => {
    const details = {
        userId: req.user.sub,
        ...req.body
    }
    const data = await customerService.addToCart(details);
    if (data.statusValue === 0) {
        res.status(500).json(data);
    } else {
        res.status(200).json(data);
    }

});

module.exports = {
    listProducts,
    addToCart
}
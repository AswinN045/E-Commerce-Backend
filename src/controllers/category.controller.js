const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { categoryService } = require('../services');

const insertCategory = catchAsync(async (req, res) => {
    const data = await categoryService.insertCategory(req.body);
    if (data.statusValue === 0) {
        res.status(500).json(data);
    } else {
        res.status(201).json(data);
    }

});

const updateCategory = catchAsync(async (req, res) => {
    const data = await categoryService.updateCategory(req.params.id, req.body);
    if (data.statusValue === 0) {
        res.status(500).json(data);
    } else {
        res.status(200).json(data);
    }

});

const deleteCategory = catchAsync(async (req, res) => {
    const data = await categoryService.deleteCategory(req.params.id);
    if (data.statusValue === 0) {
        res.status(500).json(data);
    } else {
        res.status(200).json(data);
    }

});

const listCategories = catchAsync(async (req, res) => {
    const data = await categoryService.listCategories();
    if (data.statusValue === 0) {
        res.status(500).json(data);
    } else {
        res.status(200).json(data);
    }

});

module.exports = {
    insertCategory,
    updateCategory,
    deleteCategory,
    listCategories
}
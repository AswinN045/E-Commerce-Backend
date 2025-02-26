const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Categories } = require('../models')

const insertCategory = async (category) => {
    try {
        const data = await Categories.create(category);
        return { statusValue: 1, statusText: "Category inserted successfully", data };
    } catch (e) {
        return { statusValue: 0, statusText: "Category insertion failed" }
    }

};

const updateCategory = async (id, category) => {
    try {
        const data = await Categories.update({
            name: category.name,
            description: category.description
        },
            {
                where: {
                    id: id
                }
            });
        if (data[0] === 0) {
            return { statusValue: 0, statusText: "Category updation failed" }
        }
        return { statusValue: 1, statusText: "Category updated successfully", data };
    } catch (e) {
        return { statusValue: 0, statusText: "Category updation failed" }
    }

};

const deleteCategory = async (id) => {
    try {
        const data = await Categories.destroy(
            {
                where: {
                    id: id
                }
            });
        return { statusValue: 1, statusText: "Category deleted successfully", data };
    } catch (e) {
        return { statusValue: 0, statusText: "Category deletion failed" }
    }

};

const listCategories = async () => {
    try {
        const data = await Categories.findAll();
        return { data };
    } catch (e) {
        return { statusValue: 0, statusText: "Failed to fetch details" }
    }

};

module.exports = {
    insertCategory,
    updateCategory,
    deleteCategory,
    listCategories
}
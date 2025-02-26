const { Products } = require('../models')


const insertProduct = async (product) => {
    try {
        const data = await Products.create(product);
        return { statusValue: 1, statusText: "Product inserted successfully", data };
    } catch (e) {
        return { statusValue: 0, statusText: "Product insertion failed" }
    }
};

const updateProduct = async (id, product) => {
    try {

        const data = await Products.update(product, {
            where: { id: id },
        });
        if (data[0] === 0) {
            return { statusValue: 0, statusText: "Product updation failed" }
        }
        return { statusValue: 1, statusText: "Product updated successfully", data };
    } catch (e) {
        return { statusValue: 0, statusText: "Product updation failed" }
    }
};

const deleteProduct = async (id) => {
    try {
        const data = await Products.destroy({ where: { id: id } });
        return { statusValue: 1, statusText: "Product deleted successfully", data };
    } catch (e) {
        return { statusValue: 0, statusText: "Product deletion failed" }
    }
};

const listProducts = async () => {
    try {
        const data = await Products.findAll();
        return { statusValue: 1, statusText: "Product details fetched successfully", data };
    } catch (e) {
        return { statusValue: 0, statusText: "Failed to fetch details" }
    }
};

module.exports = {
    insertProduct,
    updateProduct,
    deleteProduct,
    listProducts
}
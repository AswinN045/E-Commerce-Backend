const { Products, Categories, Cart } = require('../models');
const { Op } = require('sequelize');

const listProducts = async (details) => {
    try {
        const { priceMin, priceMax, categoryName, search, page, limit } = details;

        const pageNum = Math.max(1, parseInt(page, 10) || 1);
        const limitNum = Math.max(1, parseInt(limit, 10) || 10);
        const offset = (pageNum - 1) * limitNum;

        const where = {};
        const include = [];
        if (priceMin !== undefined || priceMax !== undefined) {
            where.price = {};
            if (priceMin !== undefined) where.price[Op.gte] = parseFloat(priceMin);
            if (priceMax !== undefined) where.price[Op.lte] = parseFloat(priceMax);
        }

        const categoryInclude = {
            model: Categories,
            as: 'category',
            attributes: ['id', 'name']
        };

        if (categoryName && typeof categoryName === 'string') {
            categoryInclude.where = {
                name: { [Op.like]: `%${categoryName.replace(/%/g, '\\%')}%` }
            };
        }
        include.push(categoryInclude);

        if (search && typeof search === 'string') {
            where.name = { [Op.like]: `%${search.replace(/%/g, '\\%')}%` };
        }

        const { count, rows } = await Products.findAndCountAll({
            where,
            include,
            offset,
            limit: limitNum,
            order: [['name', 'ASC']],
            attributes: ['id', 'name', 'price', 'imageUrl', 'stock', 'categoryId'],
        });

        const totalPages = Math.ceil(count / limitNum);

        return {
            statusValue: 1,
            statusText: 'Products retrieved successfully',
            data: {
                products: rows,
                pagination: {
                    currentPage: pageNum,
                    totalPages,
                    totalItems: count,
                    itemsPerPage: limitNum,
                },
            },
        }
    } catch (e) {
        return { statusValue: 0, statusText: "Failed to fetch details" }
    }
};

const addToCart = async (details) => {
    try {
        const product = await Products.findByPk(details.productId);
        details.price = product.price
        const data = await Cart.create(details);
        return { statusValue: 1, statusText: 'item added to the cart', data }
    } catch (e) {
        return { statusValue: 0, statusText: "Failed to add item to the cart" }
    }
};

module.exports = {
    listProducts,
    addToCart
}

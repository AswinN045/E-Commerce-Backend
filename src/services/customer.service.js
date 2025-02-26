const { Products, Categories, Cart, Orders, OrderItems } = require('../models');
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
    } catch (error) {
        return { statusValue: 0, statusText: `Failed to fetch details ${error.message}` }
    }
};

const addToCart = async (details) => {
    try {
        const product = await Products.findByPk(details.productId);
        if (!product) {
            return { statusValue: 0, statusText: 'Product not found' }
        }
        if (product.quantity < details.quantity) {
            return { statusValue: 0, statusText: 'There is limit in the quantity' }
        }
        const updatedDetails = { ...details, price: product.price };
        const cartData = await Cart.create(updatedDetails)

        return { statusValue: 1, statusText: 'item added to the cart', data: cartData }

    } catch (error) {
        return { statusValue: 0, statusText: `Failed to add item to the cart ${error.message}` }
    }
};

const removeFromCart = async (id, userId) => {
    try {
        const details = await Cart.findByPk(id);
        if (!details) {
            return { statusValue: 0, statusText: 'Cart item not found' };
        }

        const deleteResult = await Cart.destroy({ where: { id: id, userId: userId } })

        return { statusValue: 1, statusText: 'Cart item removed', data: deleteResult };

    } catch (error) {
        return { statusValue: 0, statusText: `Failed to rermove item from the cart: ${error.message}` }
    }
};

const viewCart = async (userId) => {
    try {
        const details = await Cart.findAll({ where: { userId: userId } })
        return { statusValue: 1, statusText: 'Cart item removed', data: details };
    } catch (error) {
        return { statusValue: 0, statusText: `Failed to fetch items from the cart: ${error.message}` }
    }
};

const placeOrders = async (userId) => {
    try {
        const cartItems = await Cart.findAll({
            where: { userId },
            include: [{ model: Products, as: 'product' }],
        });

        if (!cartItems.length) {
            return { statusValue: 0, statusText: 'Cart is empty' };
        }

        const orderItemsData = cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price
        }));
        const total = orderItemsData.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const order = await Orders.create(
            { userId, total, status: 'pending' },
        );

        await Promise.all([
            OrderItems.bulkCreate(
                orderItemsData.map(item => ({
                    ...item,
                    orderId: order.id
                })),
            ),
            ...cartItems.map(item =>
                Products.increment('stock', {
                    by: -item.quantity,
                    where: { id: item.productId }
                })
            )
        ]);

        await Cart.destroy({ where: { userId } });

        return {
            statusValue: 1,
            statusText: 'Order placed successfully',
            data: { orderId: order.id, total, itemCount: orderItemsData.length }
        };
    } catch (error) {
        return { statusValue: 0, statusText: `Failed to place the order ${error.message}` }
    }
};

async function viewOrderHistory(userId) {
    try {
        const orders = await Orders.findAll({
            where: { userId },
            include: [
                {
                    model: OrderItems,
                    as: 'items',
                    include: [{ model: Products, as: 'product' }]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        if (!orders.length) {
            return { statusValue: 0, statusText: 'No order history found' };
        }

        const orderHistory = orders.map(order => ({
            orderId: order.id,
            total: order.total,
            status: order.status,
            createdAt: order.createdAt,
            items: order.items.map(item => ({
                productId: item.productId,
                name: item.product.name,
                quantity: item.quantity,
                price: item.price
            }))
        }));

        return {
            statusValue: 1, statusText: 'Order history retrieved', data: orderHistory
        };
    } catch (error) {
        return {
            statusValue: 0, statusText: `Failed to retrieve order history: ${error.message}`
        };
    }
}


module.exports = {
    listProducts,
    addToCart,
    removeFromCart,
    viewCart,
    placeOrders,
    viewOrderHistory
}

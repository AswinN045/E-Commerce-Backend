const listProducts = {
    query: {
        priceMin: {
            optional: true,
            isFloat: { min: 0 },
            errorMessage: 'Minimum price must be a positive number',
        },
        priceMax: {
            optional: true,
            isFloat: { min: 0 },
            errorMessage: 'Maximum price must be a positive number',
        },
        categoryName: {
            optional: true,
            isString: true,
            errorMessage: 'Category ID must be a valid positive integer',
        },
        search: {
            optional: true,
            isLength: { min: 1, max: 100 },
            errorMessage: 'Search term must be between 1 and 100 characters',
        },
        page: {
            optional: true,
            isInt: { min: 1 },
            default: 1,
            errorMessage: 'Page must be a positive integer',
        },
        limit: {
            optional: true,
            isInt: { min: 1, max: 100 },
            default: 10,
            errorMessage: 'Limit must be between 1 and 100',
        },
    },
};

const addToCart = {
    body: {
        productId: {
            notEmpty: true,
            isInt: true,
            errorMessage: 'Product id is required'
        },
        quantity: {
            notEmpty: true,
            isInt: true,
            errorMessage: 'Qantity is required'
        }
    },
};

const removeFromCart = {
    params: {
        id: {
            notEmpty: true,
            isInt: true,
            errorMessage: 'id is required'
        }
    },
};

const viewCart = {
};

const placeOrders = {
};

const viewOrderHistory = {
};

module.exports = {
    listProducts,
    addToCart,
    removeFromCart,
    viewCart,
    placeOrders,
    viewOrderHistory
}
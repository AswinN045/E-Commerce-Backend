const insertProduct = {
    body: {
        name: {
            notEmpty: true,
            isString: true,
            errorMessage: 'Name is required',
        },
        description: {
            notEmpty: false,
            isString: true
        },
        price: {
            notEmpty: true,
            isNumeric: true,
            errorMessage: 'Price is required'
        },
        stock: {
            notEmpty: true,
            isNumeric: true,
            errorMessage: 'Role must be a string if provided',
        },
        categoryId: {
            notEmpty: true,
            isNumeric: true,
            errorMessage: 'categoryId is required'
        },
        imageUrl: {
            notEmpty: true,
            isString: true,
            errorMessage: 'Image is required'
        }
    },
};

const updateProduct = {
    params: {
        id: {
            exists: true,
            notEmpty: true,
            errorMessage: 'id must be a valid id and cannot be empty',
        },
    },
    body: {
        name: {
            optional: true,
            isString: true,
            errorMessage: 'Name is required',
        },
        description: {
            optional: true,
            isString: true
        },
        price: {
            optional: true,
            isNumeric: true,
            errorMessage: 'Price is required'
        },
        stock: {
            optional: true,
            isNumeric: true,
        },
        categoryId: {
            optional: true,
            isNumeric: true,
        },
        imageUrl: {
            optional: true,
            isString: true,
        }
    },
};

const deleteProduct = {
    params: {
        id: {
            exists: true,
            notEmpty: true,
            errorMessage: 'id must be a valid id and cannot be empty',
        },
    },
};

const listProducts = {};



module.exports = {
    insertProduct,
    updateProduct,
    deleteProduct,
    listProducts
};


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
            isString: true,
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



module.exports = {
    insertProduct
};

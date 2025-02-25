
const insertCategory = {
    body: {
        name: {
            notEmpty: true,
            isString: true,
            errorMessage: 'name is required',
        },
        description: {
            optional: true,
            isString: true
        }
    },
};

const updateCategory = {
    body: {
        id: {
            notEmpty: true,
            isNumeric: true,
            errorMessage: "catgory id is required"
        },
        name: {
            optional: true,
            isString: true,
        },
        description: {
            optional: true,
            isString: true
        }
    },
};

const deleteCategory = {
    params: {
        id: {
            exists: true,
            notEmpty: true,
            errorMessage: 'id must be a valid id and cannot be empty',
        },
    },
};

const listCategories = {
};


module.exports = {
    insertCategory,
    updateCategory,
    deleteCategory,
    listCategories
};

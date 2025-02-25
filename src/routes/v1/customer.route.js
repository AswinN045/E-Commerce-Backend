const express = require('express');
const validate = require('../../middlewares/validate');
const jwtAuthMiddleware = require('../../middlewares/auth');
const authorizeRole = require('../../middlewares/role');
const customerValidation = require('../../validations/customer.validation');
const customerController = require('../../controllers/customer.controller');

const router = express.Router();

router.get('/list-products', jwtAuthMiddleware, authorizeRole(['Customer']), validate(customerValidation.listProducts), customerController.listProducts);
router.post('/add-to-cart', jwtAuthMiddleware, authorizeRole(['Customer']), validate(customerValidation.addToCart), customerController.addToCart);


module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Customer
 *   description: Product retreival and orders management. Authorize using access token from the **auth/login** endpoint.
 */

/**
 * @swagger
 * /customer/list-products:
 *   get:
 *     summary: List products with filters (Customer)
 *     tags: [Customer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: priceMin
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: priceMax
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: categoryName
 *         schema:
 *           type: string
 *         description: Filter by category name
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by product name
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page (max 100)
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/products'   
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /customer/add-to-cart:
 *   post:
 *     summary: items add to the cart
 *     tags: [Customer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: number
 *               quantity:
 *                 type: number
 *               price:
 *                 type: float
 *             example:
 *               productId: 2
 *               quantity: 4
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/products'   
 *       500:
 *         description: Internal server error
 */

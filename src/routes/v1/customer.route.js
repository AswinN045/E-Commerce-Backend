const express = require('express');
const validate = require('../../middlewares/validate');
const jwtAuthMiddleware = require('../../middlewares/auth');
const authorizeRole = require('../../middlewares/role');
const customerValidation = require('../../validations/customer.validation');
const customerController = require('../../controllers/customer.controller');

const router = express.Router();

router.get('/list-products', jwtAuthMiddleware, authorizeRole(['Customer']), validate(customerValidation.listProducts), customerController.listProducts);
router.post('/add-to-cart', jwtAuthMiddleware, authorizeRole(['Customer']), validate(customerValidation.addToCart), customerController.addToCart);
router.delete('/remove-from-cart/:id', jwtAuthMiddleware, authorizeRole(['Customer']), validate(customerValidation.removeFromCart), customerController.removeFromCart);
router.get('/view-cart', jwtAuthMiddleware, authorizeRole(['Customer']), validate(customerValidation.viewCart), customerController.viewCart);
router.post('/place-orders', jwtAuthMiddleware, authorizeRole(['Customer']), validate(customerValidation.placeOrders), customerController.placeOrders);
router.get('/view-order-history', jwtAuthMiddleware, authorizeRole(['Customer']), validate(customerValidation.viewOrderHistory), customerController.viewOrderHistory);




module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Customer
 *   description: The `Product` retreival, `Cart` and `Orders` management. Authorize using access token from the **auth/login** endpoint. Only the cstomers have the access to this endpoints.
 */

/**
 * @swagger
 * /customer/list-products:
 *   get:
 *     summary: List products with filters (Customer).
 *     description: Filter incldes minimum price - maximum price, category name, product name.
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
 *     summary: Items add to the cart.
 *     description: You will get the `productId` from the **customer/list-products** end poiint.
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
 *               $ref: '#/components/schemas/responseSchema'   
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /customer/remove-from-cart/{id}:
 *   delete:
 *     summary: Remove items from the cart. 
 *     description: You can view your cart details using the **customer/view-cart** endpoint, where you’ll retrieve the id needed for removal.
 *     tags: [Customer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: cart item id
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/responseSchema'   
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /customer/view-cart:
 *   get:
 *     summary: View the entire cart.
 *     tags: [Customer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/responseSchema'   
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /customer/place-orders:
 *   post:
 *     summary: Users can place an order for the items in their cart.
 *     tags: [Customer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/responseSchema'   
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /customer/view-order-history:
 *   get:
 *     summary: View the entire history of the orders.
 *     tags: [Customer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/responseSchema'   
 *       500:
 *         description: Internal server error
 */

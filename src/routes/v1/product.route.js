const express = require('express');
const validate = require('../../middlewares/validate');
const jwtAuthMiddleware = require('../../middlewares/auth');
const authorizeRole = require('../../middlewares/role');
const productValidation = require('../../validations/product.validation');
const productController = require('../../controllers/product.controller');
const { upload } = require('../../utils/storage')

const router = express.Router();

router.post('/insert-product', jwtAuthMiddleware, authorizeRole(['Admin']), validate(productValidation.insertProduct), productController.insertProduct);
router.patch('/update-product/:id', jwtAuthMiddleware, authorizeRole(['Admin']), validate(productValidation.updateProduct), productController.updateProduct);
router.delete('/delete-product/:id', jwtAuthMiddleware, authorizeRole(['Admin']), validate(productValidation.deleteProduct), productController.deleteProduct);
router.get('/list-products', jwtAuthMiddleware, authorizeRole(['Admin']), validate(productValidation.listProducts), productController.listProduct);

router.post('/upload-image', jwtAuthMiddleware, authorizeRole(['Admin']), upload.single('image'), productController.uploadImage)

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Category management and retrieval. Authorize using access token from the **auth/login** endpoint.
 */

/**
 * @swagger
 * tags:
 *   name: Uploads
 *   description: upload images. Authorize using access token from the **auth/login** endpoint. Only admins have access to the products
 */

/**
 * @swagger
 * /product/insert-product:
 *   post:
 *     summary: Create a product
 *     description: The `categoryId` is obtained from the **category/list-categories** endpoint; use the `id` from the response corresponding to each category. The `imageUrl` is retrieved from the **Upload** tag, specifically from the `imageUrl` in the response of the **product/upload-image** endpoint.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - stock
 *               - categoryId
 *               - imageUrl
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: float
 *               stock:
 *                 type: integer
 *               categoryId:
 *                 type: integer
 *               imageUrl:
 *                 type: string
 *             example:
 *               name: Redmi note 8 pro
 *               description: mobile
 *               price: 12999.99
 *               stock: 2
 *               categoryId: 2
 *               imageUrl: https://res.cloudinary.com/dstdfumjd/image/upload/v1740501309/products/drgrehrehnertnrtyhtry.jpg
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/responseSchema'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /product/update-product/{id}:
 *   patch:
 *     summary: Update a product
 *     description: Only admins can update products. The product `id` will get from the **product/list-prodcts** end poin. The `categoryId` is obtained from the **category/list-categories** endpoint; use the `id` from the response corresponding to each category. The `imageUrl` is retrieved from the **Upload** tag, specifically from the `imageUrl` in the response of the **product/upload-image** endpoint.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: product id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: float
 *               stock:
 *                 type: integer
 *               categoryId:
 *                 type: integer
 *               imageUrl:
 *                 type: string
 *             example:
 *               name: Redmi note 8 pro
 *               description: mobile
 *               price: 12999.99
 *               stock: 2
 *               categoryId: 2
 *               imageUrl: https://res.cloudinary.com/dstdfumjd/image/upload/v1740501309/products/drgrehrehnertnrtyhtry.jpg
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/responseSchema'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /product/delete-product/{id}:
 *   delete:
 *     summary: Delete a product
 *     description: Logged in admin can only delete the product.The corresponding product `id` will get from the **product/list-products** end point.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: product id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/responseSchema'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /product/list-products:
 *   get:
 *     summary: List all the products
 *     description: Admin an lists the enire prodcts thats created.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/responseSchema'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */


/**
 * @swagger
 * /product/upload-image:
 *   post:
 *     summary: Upload an image to Cloudinary. Only admin can pload product images
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file (JPEG, PNG, GIF; max 10MB)
 *             required:
 *               - image
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 imageUrl:
 *                   type: string
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
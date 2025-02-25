const express = require('express');
const validate = require('../../middlewares/validate');
const jwtAuthMiddleware = require('../../middlewares/auth');
const authorizeRole = require('../../middlewares/role');
const categoryValidation = require('../../validations/category.validation');
const categoryController = require('../../controllers/category.controller');

const router = express.Router();

router.post('/insert-category', jwtAuthMiddleware, authorizeRole(['Admin']), validate(categoryValidation.insertCategory), categoryController.insertCategory);
router.patch('/update-category', jwtAuthMiddleware, authorizeRole(['Admin']), validate(categoryValidation.updateCategory), categoryController.updateCategory);
router.delete('/delete-category/:id', jwtAuthMiddleware, authorizeRole(['Admin']), validate(categoryValidation.deleteCategory), categoryController.deleteCategory);
router.get('/list-categories', jwtAuthMiddleware, authorizeRole(['Admin']), validate(categoryValidation.listCategories), categoryController.listCategories);


module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management and retrieval. Authorize withaccess token from the **auth/login** endpoint.
 */

/**
 * @swagger
 * /category/insert-category:
 *   post:
 *     summary: Create a category
 *     description: Only admins can create categories.
 *     tags: [Categories]
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *             example:
 *               name: Electronics
 *               description: Electronic categories
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
 * /category/update-category:
 *   patch:
 *     summary: Update a category
 *     description: Logged in admin can only update the category.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: number
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *             example:
 *               id: 2
 *               name: Clothings
 *               description: Clothing details
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
 * /category/delete-category/{id}:
 *   delete:
 *     summary: Delete a category
 *     description: Logged in admin can only delete the category.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
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
 * /category/list-categories:
 *   get:
 *     summary: List all the categories
 *     description: Logged in admin can only view the categories.
 *     tags: [Categories]
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

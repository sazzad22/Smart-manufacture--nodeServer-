const express = require('express');
const productController = require('../../controllers/products.controller');
const limiter = require('../../middleware/limiter');
const viewCount = require('../../middleware/viewCount');

const router = express.Router();

/**
 * @api {get} /product  All products
 * @apiDescription Get all the products
 * @apiPermission admin
 * 
 * @apiHeader {String} Authorization  User's access token
 * @apiParam {Number{1-}}      [page=1]    List page
 * @apiParam {Number{1-100}}   [limit=10]  User's per page
 * 
 * @apiSuccess {Object[]}  all the tools
 * 
 * @apiError {Unauthorized 400}  Unauthorized  Only authorized users can access the data
 * @apiError {Forbidden 401}     Forbidden     Only admins can access the data
*/



router
    .route('/')
    /**
 * @api {get} /product  All products
 * @apiDescription Get all the products
 * @apiPermission admin
 * 
 * @apiHeader {String} Authorization  User's access token
 * @apiParam {Number{1-}}      [page=1]    List page
 * @apiParam {Number{1-100}}   [limit=10]  User's per page
 * 
 * @apiSuccess {Object[]}  all the tools
 * 
 * @apiError {Unauthorized 400}  Unauthorized  Only authorized users can access the data
 * @apiError {Forbidden 401}     Forbidden     Only admins can access the data
*/
    .get(productController.getAllProducts)

    /**
 * @api {Post} /product  All products
 * @apiDescription Adds one the products
 * @apiPermission admin
 * 
 * @apiHeader {String} Authorization  User's access token
 * @apiParam {Number{1-}}      [page=1]    List page
 * @apiParam {Number{1-100}}   [limit=10]  User's per page
 * 
 * @apiSuccess {Object[]}  all the tools
 * 
 * @apiError {Unauthorized 400}  Unauthorized  Only authorized users can access the data
 * @apiError {Forbidden 401}     Forbidden     Only admins can access the data
*/
    .post(productController.addAProduct);

/**
 * @api {GET} /:id Gets one product 
 */ 
router.route('/:id')
    .get(viewCount, limiter, productController.getOneProductDetails)
    .patch(productController.updateOrAddAProduct)
    .put(productController.updateOrAddAProduct)
    .delete(productController.deleteAProduct)
router.route('/test')
    .get(productController.getTest)
    .post(productController.postTest)
module.exports = router;

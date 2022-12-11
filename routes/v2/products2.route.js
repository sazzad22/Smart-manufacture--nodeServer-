const express = require("express");
const productController2 = require("../../controllers/products2.controller");

const router = express.Router();


//routes
//default route is "api/v2/product" which is represented here as "/"
router
    .route("/")
    /**
     * @api {get} /product  All products
     * @apiDescription Get all the products
     * @apiPermission admin & user
     *
     * @apiHeader {String} Authorization  User's access token
     * @apiParam 
     * @apiParam 
     *
     * @apiSuccess {Object[]}  all the tools
     *
     * @apiError {Unauthorized 400}  Unauthorized  Only authorized users can access the data
     * @apiError {Forbidden 401}     Forbidden     Only admins can access the data
     */
    .get(productController2.getAllProducts2);

router.route('/:id')
/**
 * @api {get} /product/:id  one product
 * @apiDescription Get one the products
 * @apiPermission admin & user
 *
 * @apiHeader {String} Authorization  User's access token
 * @apiParam 
 * @apiParam 
 *
 * @apiSuccess {Object[]}  
 *
 * @apiError { 400}  invalid product id
 * @apiError {Forbidden 401}     Forbidden     Only admins can access the data
 */
    .get(productController2.getOneProductDetails2)
    /**
 * @api {get} /product/:id  updates one product
 * @apiDescription update one of the products via id
 * @apiPermission admin 
 *
 * @apiHeader {String} Authorization  User's access token
 * @apiParam 
 * @apiParam 
 *
 * @apiSuccess {Object[]}  
 *
 * @apiError {Unauthorized 400}  invalid product id
 * @apiError {Forbidden 401}     Forbidden     Only admins can access the data
 */
    .patch(productController2.updateOrAddAProduct2)
/**
 * @api {get} /product/:id  deletes one product
 * @apiDescription update one of the products via id
 * @apiPermission admin  
 * */
    .delete(productController2.deleteAProduct2)




module.exports = router;

const express = require("express");
const orderController = require('../../controllers/order.controller');

const router = express.Router();


router
    .route('/')
    .get(orderController.getAllOrders)
    .post(orderController.addOneOrder)

router
    .route('/:id')
    .get(orderController.getOneOrder)
    .delete(orderController.deleteOneOrder);

module.exports = router;
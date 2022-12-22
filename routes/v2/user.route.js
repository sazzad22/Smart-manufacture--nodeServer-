const express = require("express");
const userController = require('../../controllers/user.controller');

const router = express.Router();


router
    .route('/')
    .get(userController.getAllUser)

router
    .route('/:email')
    .get(userController.getOneUser)
    .put(userController.updateOneUser);

router
    .route('/admin/:email')
    .put(userController.updateRoleToAdmin);

router
    .route('/check/admin/:email')
    .get(userController.loadUserAndCheckIfAdmin);

module.exports = router;
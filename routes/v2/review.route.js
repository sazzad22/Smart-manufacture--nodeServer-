const express = require("express");
const reviewController = require('../../controllers/reveiw.controller');

const router = express.Router();


router
    .route('/')
    .get(reviewController.getAllReviews)
    .post(reviewController.addOneReview);

module.exports = router;
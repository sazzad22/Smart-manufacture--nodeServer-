const { ObjectId } = require("mongodb");
const { getDb } = require("../utils/dbConnect");

//gets all products from db : controller
const getAllReviews = async (req, res, next) => {
  try {
    const db = getDb();
    const reviewCollection = db.collection("reveiw");
    const reviews = await reviewCollection.find().toArray();
    res.send(reviews);
  } catch (error) {
    next(error);
  }
};
const addOneReview = async (req, res, next) => {
  try {
    const db = getDb();
    const reviewCollection = db.collection("reveiw");

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllReviews,
  addOneReview
};

const { ObjectId } = require("mongodb");
const { getDb } = require("../utils/dbConnect");

let allProducts = [
  { id: 1, name: "Hammer1" },
  { id: 2, name: "Hammer2" },
  { id: 3, name: "Hammer3" },
  { id: 4, name: "Hammer4" },
  { id: 5, name: "Hammer5" },
];
const getAllProducts = async (req, res, next) => {
  try {
    const { limit, page } = req.query;
    const db = getDb();
    const productCollection = db.collection("products");
    const result = await productCollection
      .find({})
      .project()
      .skip(+page, limit)
      .limit(+limit)
      .toArray();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const addAProduct = async (req, res, next) => {
  try {
    const db = getDb();
    const productCollection = db.collection("products");
    const product = req.body;
    const result = await productCollection.insertOne(product);
    if (!result.insertedId) {
      res.status(500).send("Something went wrong");
    }
    if (result.insertedId) {
      res.send(`Add product successfull . InsertId = ${result.insertedId}`);
    }
  } catch (error) {
    next(error); //error goes to global error handler
  }
};

const getOneProductDetails = async (req, res, next) => {
  try {
    const db = getDb();
    const { id } = req.params;
    //checking the received id if it's valid before procceeding further
    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, error: "Not a valid Product ID" });
    }
    const oneProductDetails = await db
      .collection("products")
      .findOne({ _id: ObjectId(id) });
    //handle error if the id is valid but no product exists for that id
    if (!oneProductDetails) {
      return res
        .status(400)
        .json({
          success: false,
          error: "Couldn't find a product with this id",
        });
    }

    res.status(200).json({ success: true, data: oneProductDetails });
  } catch (error) {
    next(error);
  }
};
const updateOrAddAProduct = async (req, res, next) => {
  try {
    const db = getDb();
    const { id } = req.params;
    //checking the received id if it's valid before procceeding further
    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, error: "Not a valid Product ID" });
    }
    const resultFromUpdateOperation = await db
      .collection("products")
      .updateOne({ _id: ObjectId(id) }, { $set: req.body });
    //handle error if the id is valid but no product exists for that id
    if (!resultFromUpdateOperation.modifiedCount) {
      return res
        .status(400)
        .json({ success: false, error: "Product details are not updated" });
    }

    res.status(200).json({ success: true, data: resultFromUpdateOperation });
  } catch (error) {
    next(error);
  }
};
//Delete product controller
const deleteAProduct = async (req, res, next) => {
  try {
    const db = getDb();
    const { id } = req.params;
    //checking the received id if it's valid before procceeding further
    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, error: "Not a valid Product ID" });
    }
    const resultFromDeleteOperation = await db
      .collection("products")
      .deleteOne({ _id: ObjectId(id) });
    //handle error if the id is valid but no product exists for that id
    if (!resultFromDeleteOperation.deletedCount) {
      return res
        .status(400)
        .json({ success: false, error: "Product details are not DELETED" });
    }

    res.status(200).json({ success: true, data: resultFromDeleteOperation });
  } catch (error) {
    next(error);
  }
};

//todo Test controller
const postTest = async (req, res, next) => {
  for (let index = 0; index <= 100000; index++) {
    const db = getDb();
    db.collection("test").insertOne({ name: `Name-${index}`, age: index });
  }
};
const getTest = async (req, res, next) => {
  const db = getDb();
  const result= await db.collection('test').find({age:100000})
};

module.exports = {
  getAllProducts,
  addAProduct,
  getOneProductDetails,
  updateOrAddAProduct,
  deleteAProduct,
  getTest,
  postTest
};

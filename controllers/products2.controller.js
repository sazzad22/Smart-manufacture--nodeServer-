const { ObjectId } = require("mongodb");
const { getDb } = require("../utils/dbConnect");

//gets all products from db : controller
const getAllProducts2 = async (req, res, next) => {
  try {
    const db = getDb();
    const productCollection = db.collection("products");
    const result = await productCollection.find({}).toArray();
    res.send(result);
  } catch (error) {
    next(error);
  }
};
//gets one product's details
const getOneProductDetails2 = async (req, res, next) => {
  try {
    const db = getDb();
    const id = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "Not a valid product ID",
      });
    }

    const oneProductDetails = await db
      .collection("products")
      .findOne({ _id: ObjectId(id) });

    res.status(200).send(oneProductDetails);
  } catch (error) {
    next(error);
  }
};

//update one product
const updateOrAddAProduct2 = async (req, res, next) => {
  try {
    const db = getDb();
    const { id } = req.params;
    //checking if the received id is valid or not
    if (!ObjectId.isValid()) {
      return res.status(400).json({
        success: false,
        error: "Not a valid Product id",
      });
    }
    const resultFromUpdateOperation = await db
      .collection("products")
      .updateOne({ _id: ObjectId(id) }, { $set: req.body });

    //handle error if not updated
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

const deleteAProduct2 = async (req, res, next) => {
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

module.exports = {
  getAllProducts2,
  getOneProductDetails2,
  updateOrAddAProduct2,
  deleteAProduct2,
};

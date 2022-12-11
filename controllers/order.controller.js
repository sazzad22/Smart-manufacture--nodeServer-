const { ObjectId } = require("mongodb");
const { getDb } = require("../utils/dbConnect");

//* oder controllers
//get all order
const getAllOrders = async (req, res, next) => {
  try {
    const db = getDb();
    const orderCollection = db.collection("order");

    /*   const email = req.query.email;
    const decodedEmail = req.decoded.email;
    if (email === decodedEmail) {
      const query = { email: email };
      const orders = await orderCollection.find(query).toArray();
      return res.send(orders);
    } */
    const orders = await orderCollection.find().toArray();
    res.send(orders);
  } catch (error) {
    next(error);
  }
};

//get one order by id
const getOneOrder = async (req, res, next) => {
  try {
    const db = getDb();
    const orderCollection = db.collection("order");

    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const order = await orderCollection.findOne(query);
    res.send(order);
  } catch (error) {
    next(error);
  }
};

//add one order
const addOneOrder = async (req, res, next) => {
    try {
      
        const db = getDb();
    const orderCollection = db.collection("order");

    const order = req.body;
    const result = await orderCollection.insertOne(order);
    res.send(result);
  } catch (error) {
    next(error);
  }
};
const deleteOneOrder = async (req, res, next) => {
    try {
      
        const db = getDb();
    const orderCollection = db.collection("order");

    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await orderCollection.deleteOne(query);
    res.send(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllOrders,
  addOneOrder,
  deleteOneOrder,
  getOneOrder,
};

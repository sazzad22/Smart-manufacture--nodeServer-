const { ObjectId } = require("mongodb");
const { getDb } = require("../utils/dbConnect");

//get all user
const getAllUser = async (req, res, next) => {
  try {
    const db = getDb();
    const userCollection = db.collection("user");

    const users = await userCollection.find().toArray();
    res.send(users);
  } catch (error) {
    next(error);
  }
};

//get one user
const getOneUser = async (req, res, next) => {
  try {
    const db = getDb();
    const userCollection = db.collection("user");
    const email = req.params.email;
    const query = { email: email };
    const client = await userCollection.findOne(query);
    res.send(client);
  } catch (error) {
    next(error);
  }
};
//update one user
const updateOneUser = async (req, res, next) => {
  try {
    const db = getDb();
    const userCollection = db.collection("user");
    const email = req.params.email;
    const updatedClient = req.body;
    const filter = { email: email };
    const options = { upsert: true };

    const updateDoc = {
      $set: {
        education: updatedClient.education,
        location: updatedClient.location,
        phone: updatedClient.phone,
        profileLine: updatedClient.location,
      },
    };
    const result = await userCollection.updateOne(filter, updateDoc, options);
    res.send(result);
  } catch (error) {
    next(error);
  }
};
//get the email that has role as admin and send true or false
const loadUserAndCheckIfAdmin = async (req, res, next) => {
  try {
    const db = getDb();
    const userCollection = db.collection("user");
    const email = req.params.email;
    const query = { email: email };
    const user = await userCollection.findOne({ email: email });
    const isAdmin = user.role === "admin";
    res.send({ admin: isAdmin });
  } catch (error) {
    next(error);
  }
};

//make admin
const updateRoleToAdmin = async (req, res, next) => {
  try {
    const db = getDb();
    const userCollection = db.collection("user");

    const email = req.params.email;
    const filter = { email: email };
    const updateDoc = {
      $set: { role: "admin" },
    };
    const result = await userCollection.updateOne(filter, updateDoc);
    res.send(result);
  } catch (error) {
    next(error);
  }
};

//*genrateing jwt token and add user

const addOneUser = async (req, res, next) => {
  try {
    const db = getDb();
    const userCollection = db.collection("user");
    const email = req.params.email;
    const user = req.body;
    const filter = { email: email };
    const options = { upsert: true };
    const updateDoc = {
      $set: user,
    };
    const result = await userCollection.updateOne(filter, updateDoc, options);

    const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "5d",
    });
    res.send({ result, token });
  } catch (error) {
    next(error);
  }
};

module.exports = {
    getAllUser,
    getOneUser,
    addOneUser,
    updateOneUser,
    loadUserAndCheckIfAdmin,
    updateRoleToAdmin
}

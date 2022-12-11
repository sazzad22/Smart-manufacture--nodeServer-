const { getDb } = require("../utils/dbConnect");

exports.verifyAdmin = async (req, res, next) => {
  const db = getDb();
  const userCollection = db.collection("user");

  const requester = req.decoded.email;
  const requesterAccount = await userCollection.findOne({ email: requester });
  if (requesterAccount.role === "admin") {
    next();
  } else {
    res.status(403).send({ message: "forbidden" });
  }
};

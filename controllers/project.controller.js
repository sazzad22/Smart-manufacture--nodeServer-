const { ObjectId } = require("mongodb");
const { getDb } = require("../utils/dbConnect");

//get all user
const getProjects = async (req, res, next) => {
  try {
    const db = getDb();
    const projectCollection = db.collection("project");

    const projects = await projectCollection.find().toArray();
    res.send(projects);
  } catch (error) {
    next(error);
  }
};

const getOneProject = async (req, res, next) => {
  try {
    const db = getDb();
    const projectCollection = db.collection("project");
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const project = await projectCollection.findOne(query);
    res.send(project);
  } catch (error) {
    next(error);
  }
};

module.exports = {
    getProjects,
    getOneProject
}

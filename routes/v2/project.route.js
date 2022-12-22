const express = require("express");
const projectController = require("../../controllers/project.controller");

const router = express.Router();

router
    .route("/")
    .get(projectController.getProjects);

router
    .route("/:id")
    .get(projectController.getOneProject);

module.exports = router;
const express = require("express");
const router = express.Router();
const docs = require("../models/docdata.js");

// get all documents
router.get("/", (req, res) => docs.getAllDocs(res, req));

// get specific document by id
router.get("/:id", (req, res) => docs.getOneDoc(res, req.params.id));

module.exports = router;

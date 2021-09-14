const express = require("express");
const router = express.Router();
const docs = require("../models/docdata.js");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

// get all documents
router.get("/", (req, res) => docs.getAllDocs(res, req));

// get specific document by id
router.get("/:id", (req, res) => docs.getOneDoc(res, req.params.id));

// create a new document
router.post("/", jsonParser, (req, res) => docs.createDoc(res, req));

// update existing document
router.put("/", jsonParser, (req, res) => docs.updateDoc(res, req));

// delete existing document
router.delete("/:id", jsonParser, (req, res) => docs.deleteDoc(res, req));

module.exports = router;

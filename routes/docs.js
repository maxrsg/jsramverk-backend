const express = require("express");
const router = express.Router();
const docs = require("../models/docdata.js");
const auth = require("../models/auth.js");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

// get all documents
router.get(
  "/",
  (req, res, next) => auth.checkToken(req, res, next),
  (req, res) => docs.getAllDocs(res, req)
  // (req, res) => docs.getSharedDocs(res, req)
);

// get specific document by id
router.get(
  "/:id",
  (req, res, next) => auth.checkToken(req, res, next),
  (req, res) => docs.getOneDoc(res, req)
);

// get specific document by id and creator
router.get(
  "/:id/:creator",
  (req, res, next) => auth.checkToken(req, res, next),
  (req, res) => docs.getDocFromCreator(res, req)
);

// create a new document
router.post(
  "/",
  jsonParser,
  (req, res, next) => auth.checkToken(req, res, next),
  (req, res) => docs.createDoc(res, req)
);

// update existing document
router.put(
  "/",
  jsonParser,
  (req, res, next) => auth.checkToken(req, res, next),
  (req, res) => docs.updateDoc(res, req)
);

// delete existing document
router.delete(
  "/:id",
  jsonParser,
  (req, res, next) => auth.checkToken(req, res, next),
  (req, res) => docs.deleteDoc(res, req)
);

module.exports = router;

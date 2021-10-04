const express = require("express");
const router = express.Router();
const auth = require("../models/auth.js");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

// register new user
router.post("/register", jsonParser, (req, res) => auth.registerUser(res, req));

// login user
router.post("/login", jsonParser, (req, res) => auth.loginUser(res, req));

module.exports = router;

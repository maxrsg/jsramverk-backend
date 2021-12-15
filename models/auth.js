const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const database = require("../db/database.js");
const saltRounds = 10;

let config;

try {
  config = require("../db/config.json");
} catch (e) {
  console.error(e);
}

const jwtSecret = process.env.JWT_SECRET || config.secret;

const auth = {
  registerUser: async function (res, req) {
    console.log(req.body);
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
      return res.status(401).json({
        errors: {
          status: 401,
          source: "/register",
          title: "Email or password missing",
          detail: "Email or password missing in request",
        },
      });
    }

    bcrypt.hash(password, saltRounds, async function (err, hash) {
      if (err) {
        return res.status(500).json({
          errors: {
            status: 500,
            source: "/register",
            title: "bcrypt error",
            detail: "bcrypt error",
          },
        });
      }
      let db;
      try {
        db = await database.getDb();
        const user = {
          email: email,
          password: hash,
          docs: [],
        };

        await db.collection.insertOne(user);

        return res.status(200).json({
          message: "User registered successfully",
        });
      } catch (e) {
        return res.status(500).json({
          errors: {
            status: 500,
            source: "/register",
            title: "Database error",
            detail: e.message,
          },
        });
      } finally {
        await db.client.close();
      }
    });
  },

  loginUser: async function (res, req) {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
      return res.status(401).json({
        errors: {
          status: 401,
          source: "/login",
          title: "Email or password missing",
          detail: "Email or password missing in request",
        },
      });
    }

    let db;

    try {
      db = await database.getDb();
      const user = await db.collection.findOne({ email: email });

      if (user) {
        return auth.comparePasswords(res, password, user);
      } else {
        return res.status(401).json({
          errors: {
            status: 401,
            source: "/login",
            title: "User not found",
            detail: "User with provided email not found.",
          },
        });
      }
    } catch (e) {
      return res.status(500).json({
        errors: {
          status: 500,
          source: "/login",
          title: "Database error",
          detail: e.message,
        },
      });
    } finally {
      await db.client.close();
    }
  },

  comparePasswords: function (res, password, user) {
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return res.status(500).json({
          errors: {
            status: 500,
            source: "/login",
            title: "bcrypt error",
            detail: "bcrypt error",
          },
        });
      }

      if (result) {
        let payload = { email: user.email };
        let jwtToken = jwt.sign(payload, jwtSecret, { expiresIn: "24h" });

        return res.json({
          data: {
            type: "success",
            message: "User logged in",
            user: payload,
            token: jwtToken,
          },
        });
      }

      return res.status(401).json({
        errors: {
          status: 401,
          source: "/login",
          title: "Wrong password",
          detail: "Password is incorrect.",
        },
      });
    });
  },

  checkToken: function (req, res, next) {
    const token = req.headers["x-access-token"];

    if (token) {
      jwt.verify(token, jwtSecret, function (err, decoded) {
        if (err) {
          return res.status(500).json({
            errors: {
              status: 500,
              source: req.path,
              title: "Failed authentication",
              detail: err.message,
            },
          });
        }

        req.user = {};
        req.user.email = decoded.email;
        req.user._id = decoded._id;
        console.log(decoded);

        return next();
      });
    } else {
      return res.status(401).json({
        errors: {
          status: 401,
          source: req.path,
          title: "No token",
          detail: "No token provided in request headers",
        },
      });
    }
  },
};

module.exports = auth;

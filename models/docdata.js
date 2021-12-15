const database = require("../db/database.js");
const ObjectId = require("mongodb").ObjectId;

const docs = {
  getAllDocs: async function (res, req) {
    let db;

    try {
      db = await database.getDb();
      const userEmail = req.user.email;
      const resultSet = await db.collection.findOne({ email: userEmail });

      const shared = await db.collection
        .find({ docs: { $elemMatch: { allowedUsers: userEmail } } })
        .toArray();

      let sharedDocs = [];
      shared.forEach((user) => {
        let docs = user.docs;
        docs.forEach((doc) => {
          if (doc.allowedUsers.includes(userEmail)) {
            doc.creator = user.email;
            sharedDocs.push(doc);
          }
        });
      });

      return res.status(200).json({
        data: resultSet.docs,
        shared: sharedDocs,
      });
    } catch (e) {
      return res.status(500).json({
        error: {
          status: 500,
          path: "/docs",
          title: "Database error",
          message: e.message,
        },
      });
    } finally {
      await db.client.close();
    }
  },

  getOneDoc: async function (res, req) {
    if (req.params.id) {
      let db;

      try {
        const userEmail = req.user.email;
        let userFilter = {
          email: userEmail,
        };
        let _id = req.params.id;
        db = await database.getDb();
        const user = await db.collection.findOne(userFilter);
        const doc = user.docs.find((document) => document._id == _id);

        return res.status(200).json({
          data: doc,
        });
      } catch (e) {
        return res.status(500).json({
          error: {
            status: 500,
            path: "/docs/one",
            title: "Database error",
            message: e.message,
          },
        });
      } finally {
        await db.client.close();
      }
    } else {
      return res.status(500).json({
        error: {
          status: 500,
          path: "/docs/one no id",
          title: "No id",
          message: "No data id provided",
        },
      });
    }
  },

  getDocFromCreator: async function (res, req) {
    if (req.params.id && req.params.creator) {
      let db;

      try {
        const userEmail = req.user.email;
        const creatorEmail = req.params.creator;
        const _id = req.params.id;

        let creatorFilter = {
          email: creatorEmail,
        };

        db = await database.getDb();
        const user = await db.collection.findOne(creatorFilter);
        const doc = user.docs.find((document) => document._id == _id);
        if (doc.allowedUsers.includes(userEmail)) {
          return res.status(200).json({
            data: doc,
          });
        }
      } catch (e) {
        return res.status(500).json({
          error: {
            status: 500,
            path: "/docs/one",
            title: "Database error",
            message: e.message,
          },
        });
      } finally {
        await db.client.close();
      }
    } else {
      return res.status(500).json({
        error: {
          status: 500,
          path: "/docs/one no id",
          title: "No id",
          message: "No data id provided",
        },
      });
    }
    console.log("heeeej");
    console.log(req.params);
  },

  createDoc: async function (res, req) {
    let db;

    try {
      db = await database.getDb();
      const userEmail = req.user.email;
      let filter = {
        email: userEmail,
      };
      let user = await db.collection.findOne(filter);
      const doc = {
        _id: ObjectId(),
        title: req.body.title,
        data: req.body.data,
        allowedUsers: req.body.allowedUsers,
      };

      user.docs.push(doc);
      await db.collection.updateOne(filter, {
        $set: user,
      });

      return res.status(201).json({ id: doc._id });
    } catch (e) {
      return res.status(500).json({
        error: {
          status: 500,
          path: "POST /docs",
          title: "Database error",
          message: e.message,
        },
      });
    } finally {
      await db.client.close();
    }
  },

  updateDoc: async function (res, req) {
    if (req.body.id) {
      let db;
      try {
        let _id = req.body.id;
        let userEmail = req.user.email;
        console.log(req.body);
        if (req.body.creator) {
          userEmail = req.body.creator;
        }

        let userFilter = {
          email: userEmail,
        };

        db = await database.getDb();
        const user = await db.collection.findOne(userFilter);

        let doc = user.docs.find((document) => document._id == _id);
        const docIndex = user.docs.indexOf(doc);
        const updateDoc = {
          _id: _id,
          title: req.body.title,
          data: req.body.data,
          allowedUsers: user.docs[docIndex].allowedUsers.concat(
            req.body.allowedUsers
          ),
        };

        user.docs[docIndex] = updateDoc;
        await db.collection.updateOne(userFilter, {
          $set: user,
        });

        return res.status(200).send();
      } catch (e) {
        return res.status(500).json({
          error: {
            status: 500,
            path: "PUT /docs",
            title: "Database error",
            message: e.message,
          },
        });
      } finally {
        await db.client.close();
      }
    } else {
      return res.status(500).json({
        error: {
          status: 500,
          path: "PUT /docs no id",
          title: "No id",
          message: "No data id provided",
        },
      });
    }
  },

  updateDirectly: async function (id, title, data) {
    let db;
    try {
      let filter = {
        _id: ObjectId(id),
      };

      db = await database.getDb();
      const updateDoc = {
        title: title,
        data: data,
      };
      await db.collection.updateOne(filter, {
        $set: updateDoc,
      });
    } catch (e) {
      console.log(e);
    }
  },

  deleteDoc: async function (res, req) {
    if (req.params.id) {
      try {
        let _id = req.params.id;
        let filter = {
          _id: ObjectId(_id),
        };
        let db;

        db = await database.getDb();
        await db.collection.deleteOne(filter);

        return res.status(200).send();
      } catch (e) {
        return res.status(500).json({
          error: {
            status: 500,
            path: "DELETE /docs",
            title: "Database error",
            message: e.message,
          },
        });
      } finally {
        await db.client.close();
      }
    } else {
      return res.status(500).json({
        error: {
          status: 500,
          path: "DELETE /docs no id",
          title: "No id",
          message: "No data id provided",
        },
      });
    }
  },
};

module.exports = docs;

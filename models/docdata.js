const database = require("../db/database.js");
const ObjectId = require("mongodb").ObjectId;

const docs = {
  getAllDocs: async function (res, req) {
    let db;

    try {
      db = await database.getDb();
      const resultSet = await db.collection.find({}).toArray();

      return res.status(200).json({
        data: resultSet,
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

  getOneDoc: async function (res, id) {
    if (id) {
      let db;

      try {
        let _id = id;
        let filter = {
          _id: ObjectId(_id),
        };

        db = await database.getDb();
        const object = await db.collection.findOne(filter);

        return res.status(200).json({
          data: object,
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
  createDoc: async function (res, req) {
    let db;

    try {
      db = await database.getDb();
      const doc = {
        title: req.body.title,
        data: req.body.data,
      };
      const result = await db.collection.insertOne(doc);

      return res.status(201).json({ id: result.insertedId });
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
      try {
        let _id = req.body.id;
        let filter = {
          _id: ObjectId(_id),
        };
        let db;

        db = await database.getDb();
        const updateDoc = {
          title: req.body.title,
          data: req.body.data,
        };
        await db.collection.updateOne(filter, {
          $set: updateDoc,
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

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
      let _id = id;
      let filter = {
        _id: ObjectId(_id),
      };
      let db;
      try {
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
};

module.exports = docs;

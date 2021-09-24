process.env.NODE_ENV = "test";

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../app.js");
const database = require("../../db/database");
const collectionName = "editor";

chai.should();
chai.use(chaiHttp);

let _id = "";

describe("docs", () => {
  before(() => {
    return new Promise(async (resolve) => {
      const db = await database.getDb();

      db.db
        .listCollections({ name: collectionName })
        .next()
        .then(async function (info) {
          if (info) {
            await db.collection.drop();
          }
        })
        .catch(function (err) {
          console.error(err);
        })
        .finally(async function () {
          await db.client.close();
          resolve();
        });
    });
  });

  describe("GET /docs when no documents exists", () => {
    it("all docs should get status 200", (done) => {
      chai
        .request(server)
        .get("/docs")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("object");
          done();
        });
    });

    it("specific doc with invalid id should get status 500", (done) => {
      chai
        .request(server)
        .get("/docs/invalidid")
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });
  });

  describe("POST /docs", () => {
    it("status 201 on create", (done) => {
      const document = {
        title: "post test",
        data: "post test",
      };

      chai
        .request(server)
        .post("/docs")
        .send(document)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.id.should.be.an("string");
          _id = res.body.id;

          done();
        });
    });
  });

  describe("GET /docs when documents exists", () => {
    it("all docs should get status 200", (done) => {
      chai
        .request(server)
        .get("/docs")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("object");
          done();
        });
    });

    it("specific doc should get status 200", (done) => {
      chai
        .request(server)
        .get(`/docs/${_id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("object");
          done();
        });
    });
  });

  describe("PUT /docs", () => {
    it("valid input data should get status 200", (done) => {
      const document = {
        id: _id,
        title: "put test",
        data: "put test",
      };

      chai
        .request(server)
        .put("/docs")
        .send(document)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    it("input data without id should get status 500", (done) => {
      const document = {
        title: "put test",
        data: "put test",
      };

      chai
        .request(server)
        .put("/docs")
        .send(document)
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });
  });

  describe("DELETE /docs/:id", () => {
    it("should get status 200", (done) => {
      chai
        .request(server)
        .delete(`/docs/${_id}`)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    it("invalid id should get status 500", (done) => {
      chai
        .request(server)
        .delete(`/docs/invalidid`)
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });
  });
});

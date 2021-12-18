const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
} = require("graphql");
const DocumentType = require("./document");
const UserType = require("./user");
const docs = require("../models/docdata");

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    users: {
      type: new GraphQLList(UserType),
      description: "List of all users",
      resolve: async function () {
        return await docs.getAllUsers();
      },
    },
    user: {
      type: new GraphQLList(UserType),
      description: "A specific user",
      args: {
        email: { type: GraphQLString },
      },
      resolve: async function () {
        return await docs.getAllUsers();
      },
    },
  }),
});

module.exports = RootQueryType;

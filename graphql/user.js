const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
} = require("graphql");
const DocumentType = require("./document");

const UserType = new GraphQLObjectType({
  name: "User",
  description: "User",
  fields: () => ({
    _id: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLString) },
    docs: { type: GraphQLList(DocumentType) },
  }),
});

module.exports = UserType;

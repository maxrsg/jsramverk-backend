const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
} = require("graphql");

const DocumentType = new GraphQLObjectType({
  name: "Document",
  description: "document",
  fields: () => ({
    _id: { type: GraphQLNonNull(GraphQLString) },
    title: { type: GraphQLNonNull(GraphQLString) },
    data: { type: GraphQLNonNull(GraphQLString) },
    alowedUsers: { type: GraphQLList(GraphQLString) },
  }),
});

module.exports = DocumentType;

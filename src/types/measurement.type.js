const { GraphQLObjectType, GraphQLInt } = require('graphql');


module.exports = new GraphQLObjectType({
  name: 'Measurement',
  fields: () => ({
    id: { type: GraphQLInt },
    date_measured: { type: GraphQLInt },
    weight: { type: GraphQLInt },
    happiness: { type: GraphQLInt }
  })
});
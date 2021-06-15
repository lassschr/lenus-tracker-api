require('dotenv').config()
const express = require('express');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLInt, GraphQLList } = require('graphql');
const { MeasurementType } = require('./types/types.export');
const { createMeasurement, deleteMeasurement, updateMeasurement } = require('./resolvers/mutations/mutations.export');
const { MeasurementQuery, MeasurementsQuery } = require('./resolvers/queries/queries.export');




// init express app
const app = express();



// create root of GraphQL queries
const QueryRoot = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      measurements: {
        type: new GraphQLList(MeasurementType),
        resolve: MeasurementsQuery
      },
      measurement: {
        type: MeasurementType,
        args: {
          id: { type: GraphQLInt }
        },
        resolve: MeasurementQuery
      }   
    })
});

// create root of GraphQL mutations
const MutationRoot = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createMeasurement: {
      type: MeasurementType,
      args: {
        date_measured: { type: GraphQLInt },
        weight: { type: GraphQLInt },
        happiness: { type: GraphQLInt }
      },
      resolve: createMeasurement
    },
    updateMeasurement: {
      type: MeasurementType,
      args: {
        id: { type: GraphQLInt },
        date_measured: { type: GraphQLInt },
        weight: { type: GraphQLInt },
        happiness: { type: GraphQLInt }
      },
      resolve: updateMeasurement
    },
    deleteMeasurement: {
      type: MeasurementType,
      args: {
        id: { type: GraphQLInt }
      },
      resolve: deleteMeasurement
    }      
  })
});

// create schema from query- and mutationroot
const schema = new GraphQLSchema({ query: QueryRoot, mutation: MutationRoot });


// middlewares
app.use(cors());
app.use(express.json());
app.use('/graphql', graphqlHTTP({ schema: schema, graphiql: true }));


// start listening 
const port = process.env.NODE_PORT || 3030;
app.listen(port, () => console.log(`Server now listening to: ${port}`));
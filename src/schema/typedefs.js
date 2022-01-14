const gql = require('graphql-tag');

const typeDefs = gql`
        type User {
            id: Int!
            email: String!
            token: String!
        }

        input UserInput {
            email: String!
            password: String!
        }

        input AddUserInput {
            email: String!
            name: String!
            password: String!
        }

        type Query {
            me: User!
            login(input: UserInput!): User!
        }

        type Mutation {
            signup(input: AddUserInput!): User!
        }

    `;


module.exports = {typeDefs};
const gql = require('graphql-tag');

const typeDefs = gql`

        """
        User data with the following fields:
        All logged in users can query for their own data
        """
        type User {
            id: String!
            email: String!
            name: String!
            token: String!
        }

        """
        User input required for login
        """
        input UserInput {
            email: String!
            password: String!
        }

        """
        User input required for signup
        """
        input AddUserInput {
            email: String!
            name: String!
            password: String!
        }

        type Query {
            """
            Returns a logged in user
            """
            me: User!

            """
            Login endpoint
            """
            login(input: UserInput!): User!
        }

        type Mutation {
            """
            Signup endpoint
            """
            signup(input: AddUserInput!): User!
        }

    `;


module.exports = {typeDefs};
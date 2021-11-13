import { gql } from 'apollo-server-express'


export default gql`
    input LoginInput {
        email: String!
        password: String!
    }

    input SignUpInput {
        email: String!
        password: String!
        firstName: String!
        lastName: String!
    }

    input VerifyEmailInput {
        _id: String!
        otp: String!
    }

    type LoginResponse {
        token: String!
        firstName: String!
        lastName: String!
    }

    type LogoutResponse {
        done: Boolean!
    }

    type SignUpResponse {
        _id: String!
    }

    type VerifyEmailResponse {
        token: String!
    }

    type SearchedUser {
        _id: String!
        email: String!
        firstName: String!
        lastName: String!
    }

    type Query {
        login(loginInput: LoginInput): LoginResponse!
        logout: Boolean
        searchEmails(email: String!): [SearchedUser]
    }

    type Mutation {
        signUp(signUpInput: SignUpInput): SignUpResponse!
        verifyEmail(verifyEmailInput: VerifyEmailInput): VerifyEmailResponse!
    }
`
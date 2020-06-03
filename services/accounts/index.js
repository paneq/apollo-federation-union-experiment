const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  extend type Query {
    me: User
  }

  interface WithName {
    name: String
  }

  type User implements WithName @key(fields: "id") {
    id: ID!
    name: String
    username: String
  }
  
  type Looser implements WithName @key(fields: "id")  {
    id: ID!
    name: String
  }
  
  union UserOrLooser = User | Looser
`;

const resolvers = {
  Query: {
    me() {
      return users[0];
    }
  },
  User: {
    __resolveReference(object) {
      return users.find(user => user.id === object.id);
    }
  },
  Looser: {
    __resolveReference(object) {
      return loosers.find(user => user.id === object.id);
    }
  },
  UserOrLooser: {
    // __resolveType(obj, context, info){
    //   return "Looser";
    // },
    __resolveReference(object) {
      return loosers.find(user => user.id === object.id);
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ])
});

server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

const users = [
  {
    id: "1",
    name: "Ada Lovelace",
    birthDate: "1815-12-10",
    username: "@ada"
  },
  {
    id: "2",
    name: "Alan Turing",
    birthDate: "1912-06-23",
    username: "@complete"
  }
];

const loosers = [
  {
    id: "1",
    name: "Ada Lovelace",
  },
  {
    id: "2",
    name: "Alan Turing",
  }
];

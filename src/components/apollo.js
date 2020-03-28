import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from "apollo-cache-inmemory";

import ActionCable from 'actioncable'
import ActionCableLink from 'graphql-ruby-client/dist/subscriptions/ActionCableLink'
import { ApolloLink } from 'apollo-link'

// CLOUD
// const uri = `https://gqlteste.herokuapp.com`
// const socketUri = `ws://gqlteste.herokuapp.com`

// CLOUD
const uri = `http://localhost:3000`
const socketUri = `ws://localhost:3000`

const cable = ActionCable.createConsumer(`${socketUri}/cable`)

const hasSubscriptionOperation = ({ query: { definitions } }) => {
  return definitions.some(
    ({ kind, operation }) => kind === 'OperationDefinition' && operation === 'subscription',
  )
}

const link = ApolloLink.split(
  hasSubscriptionOperation,
  new ActionCableLink({ cable }),
  link
)

const httplink = new HttpLink({
  // headers:{
  //   "X-CSRF-Token": token
  // },
  uri: `${uri}/graphql`
});

const client = new ApolloClient({

  link: httplink,
  cache: new InMemoryCache()
});

export default client;
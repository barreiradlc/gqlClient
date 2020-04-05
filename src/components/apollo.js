import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from "apollo-cache-inmemory";

import ActionCable from 'actioncable'
import ActionCableLink from 'graphql-ruby-client/dist/subscriptions/ActionCableLink'
import { ApolloLink } from 'apollo-link'
import { setContext } from 'apollo-link-context';

import AsyncStorage from '@react-native-community/async-storage';

const authLink = setContext(async (_, { headers }) => {
  

  const token = await AsyncStorage.getItem('@token');
  return await {
    headers: {
      ...headers,
      credentials: 'include',
      authorization: token || 'nada de token'
    }
  }
});

// CLOUD
// const uri = `https://gqlteste.herokuapp.com`
// const socketUri = `ws://gqlteste.herokuapp.com`

// LOCAL
// const uri = `http://localhost:3000`
// const socketUri = `ws://localhost:3000`

// const uri = `https://0.0.0.0:3000` 
// const socketUri = `ws://0.0.0.0:3000`

const uri = `http://192.168.0.18:3000`
const socketUri = `ws://192.168.0.18:3000`

// SUBSCRIPTIONS
// const cable = ActionCable.createConsumer(`${socketUri}/cable`)
// const hasSubscriptionOperation = ({ query: { definitions } }) => {
//   return definitions.some(
//     ({ kind, operation }) => kind === 'OperationDefinition' && operation === 'subscription',
//   )
// }
// const link = ApolloLink.split(
//   hasSubscriptionOperation,
//   new ActionCableLink({ cable }),
//   link
// )
// SUBSCRIPTIONS


// SUBSCRIPTIONS v2
// const getCableUrl = async() => {
// };

export const createCache = () => {
  return new InMemoryCache();
};


const createActionCableLink = async () => {
  let dominio = 'https:'
  
  const protocol = dominio === 'https:' ? 'wss:' : 'ws:';
  const host = uri;
  const port =  '3000';
  const authToken = await AsyncStorage.getItem('@token');
  let url = `${protocol}//${host}:${port}/cable?token=${authToken}`;

  const cable = ActionCable.createConsumer(url);
  return new ActionCableLink({ cable });
};

const hasSubscriptionOperation = ({ query: { definitions } }) =>
  definitions.some(
    ({ kind, operation }) =>
      kind === 'OperationDefinition' && operation === 'subscription'
  );
// SUBSCRIPTIONS v2


const httplink = new HttpLink({
  uri: `${uri}/graphql`
});


//duvidoso
export const createClient = (cache, requestLink) => {

  requestLink = requestLink || ''

  return new ApolloClient({  
    link: ApolloLink.from([
      ApolloLink.split(
        authLink.concat(httplink),
        hasSubscriptionOperation,
        createActionCableLink(),
        )
      ]),
      cache: cache,
  });
}
//duvidoso

// export const createClient = (cache, requestLink) => {
//   return new ApolloClient({
//     link: ApolloLink.from([
//       createErrorLink(),
//       createLinkWithToken(),
//       createHttpLink(),
//     ]),
//     cache,
//   });
// };

  
  // funcional
  const client = new ApolloClient({
    link: authLink.concat(httplink),
    cache: new InMemoryCache()
  });
  // funcional
    
export default client;
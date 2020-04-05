import React, {useEffect} from 'react';
import Home from './src/Home';

import { ApolloProvider } from 'react-apollo';
// import { createClient, createCache } from './src/components/apollo';
import client from './src/components/apollo';
import { InMemoryCache } from "apollo-cache-inmemory";


function App(){
  
  useEffect(() => {
    
  }, [])


  const cache = new InMemoryCache()

  return (
    <ApolloProvider client={client}>
    {/* <ApolloProvider client={createClient(createCache())}> */}
      <Home />
    </ApolloProvider>
  );
}

export default App;
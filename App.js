import React, {useEffect} from 'react';
import Home from './src/Home';

import { ApolloProvider } from 'react-apollo';
import apolloClient from './src/components/apollo';

function App(){
  
  useEffect(() => {
  }, [])

  return (
    <ApolloProvider client={apolloClient}>
      <Home />
    </ApolloProvider>
  );
}

export default App;
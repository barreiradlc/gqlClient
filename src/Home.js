import React from 'react'
import { ScrollView ,View, Text } from 'react-native'

import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo'

const FETCH = gql`
    query{
        links {
            id
            description
            url
        }
    }
`;

const NEW_LINKS = gql`
  subscription {
    newLink {
      id
      url
      description
    }
    linkUpdated {
        id
        url
        description
    }
  }
`


function App(props) {

    function _subscribeToNewLinks (subscribeToMore){
        subscribeToMore({
            document: NEW_LINKS,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev

                const newLink = subscriptionData.data.newLink || data.links

                console.debug('New subscription')
                console.debug(newLink)
                console.debug('New subscription')

                return Object.assign({}, prev, {
                    links: [newLink, ...prev.links],
                    __typename: prev.links.__typename
                })
            }
        })
    }

    console.log('props: ', props)

    const { data, error, loading, subscribeToMore } = useQuery(
        FETCH,
    );

    if (!data) return null;

    _subscribeToNewLinks(subscribeToMore)

    console.debug('data', data)
    console.debug('error', error)
    console.debug('loading', loading)

    return (
        <ScrollView style={{ alignContent: 'center' }}>

            {data.links.map((link) =>
                <View style={{ marginTop: 20 }}>
                    <Text> {link.description} </Text>
                    <Text> {link.url} </Text>
                </View>
            )}

        </ScrollView>
    )
}

export default App
import gql from 'graphql-tag';
import React, { useState, useEffect } from 'react';
import { ScrollView, Text, TextInput, Button } from 'react-native';
import { useMutation, useQuery } from '@apollo/react-hooks';
import AsyncStorage from '@react-native-community/async-storage';


const FETCH = gql`
    query items{
        items {
            id
            description
            imageUrl
            title
        }
    }
`;

const AUTH = gql`
    mutation setCredentials($attributes: CredentialsInput!) {
        signIn(attributes: $attributes) {
            token
            user {
                id
                fullName
                email
            }
        }
    }
`

const ADD = gql`
    mutation addItem($attributes: ItemInput!){
        addItem(attributes: $attributes ),
        {
            item {
                id
                imageUrl
                description
                title
            }
        }
    }
`

const ME = gql`
    query me{
        me {
            id
            email
            fullName    
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

function List(){

}


function App(props) {

    // function _subscribeToNewLinks (subscribeToMore){
    //     subscribeToMore({
    //         document: NEW_LINKS,
    //         updateQuery: (prev, { subscriptionData }) => {
    //             if (!subscriptionData.data) return prev

    //             const newLink = subscriptionData.data.newLink || data.links

    //             console.debug('New subscription')
    //             console.debug(newLink)
    //             console.debug('New subscription')

    //             return Object.assign({}, prev, {
    //                 links: [newLink, ...prev.links],
    //                 __typename: prev.links.__typename
    //             })
    //         }
    //     })
    // }

    const [ credentials ,setCredentials ] = useState({
        "email":"user@123.co",
        "password":"pass123"	
    })

    const [ values ,setValues ] = useState({
            "title": "Doom",
            "description": "A group of Marines is sent to the red planet via an ancient. Martian portal called the Ark to deal with an outbreak of a mutagenic virus",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/en/5/57/Doom_cover_art.jpg"
    })

    // const [auth, { data, error, loading }] = useMutation(AUTH);
    const [add, { data, error, loading }] = useMutation(ADD);
    // const { data, error, loading, subscribeToMore } = useQuery(
    //     ME,
    // );
    // const { data, error, loading } = useQuery(
    //     FETCH,
    // );
    
    useEffect(() => {
        // auth({ variables: { attributes: credentials } });
        // me()
    }, [credentials])
    
    useEffect(() => {

        if(data){
            console.log('data.signIn.token')
            console.log(data)
            console.log('data.signIn.token')

            if(data.signIn){
                if(data.signIn.token){
                    let token = data.signIn.token
                    console.log(`JWT:  ${token}`)
                    AsyncStorage.setItem('@token', token)
                }
            }
        }

    }, [data])
    
    function handleAuth(value){
        setCredentials({ email: value, password: credentials.password })

        console.log(credentials)

    }
    
    function handleAdd(){
        let attributes = {
            title: values.title,
            description: values.description,
            imageUrl: values.imageUrl
        }
           
        add({ variables: { attributes: values } })
        
    }

    console.debug('data', data)
    console.debug('error', error)
    console.debug('loading', loading)
    
    // if (!data) return null;

    // _subscribeToNewLinks(subscribeToMore)


    return (
        <ScrollView style={{ alignContent: 'center' }}>

            <TextInput 
                value={credentials.email}
                autoFocus={true}
                onChange={( value ) =>  handleAuth(value.nativeEvent.text) }
            />

            <Text>{JSON.stringify(data)}</Text>

            <Button 
                title='Enviar'
                onPress={handleAdd}
            />

        </ScrollView>
    )
}

export default App
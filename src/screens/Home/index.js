import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { styles } from './styles'



export default function Home({navigation}){

    const [location, setLocation] = useState(null);
    const [permissionDenied, setPermissionDenied] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    

    return(
        <View style={styles.container}>
            <Text style={styles.title}>Home</Text>
        </View>
    )
}
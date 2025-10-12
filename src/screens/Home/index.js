import { View, Text } from 'react-native'
import React from 'react'
import { styles } from './styles'



export default function Home(){
    return(
        <View style={styles.container}>
            <Text style={styles.title}>Home</Text>
        </View>
    )
}
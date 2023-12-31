import { StyleSheet, Text, View, Button } from 'react-native'
import React from 'react'

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Home Screens</Text>

            <Button
                title="Chat Ekranı"
                onPress={() => navigation.navigate('ChatEkrani')}
            />

        </View>
  )
}

const styles = StyleSheet.create({})

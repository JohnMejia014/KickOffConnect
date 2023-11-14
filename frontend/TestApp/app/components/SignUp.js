import Text, {SafeAreaView, StyleSheet, TextInput, View} from "react-native";
import React from 'react';
import {RectButton} from "react-native-gesture-handler";
import axios from 'axios';
import {router} from "expo-router";
import Button from "./Button";
import {Alert} from "react-native";

export default function Page() {

    const [userId, setUserId] = React.useState('');
    const [password, setPassword] = React.useState('');



    return (
        <View>
            <SafeAreaView>
                <TextInput
                    onChangeText = {setUserId}
                    placeholder = "username"
                    value ={userId}

                />
                <TextInput
                    onChangeText = {setPassword}
                    value = {password}
                    placeholder = "password"
                />
            </SafeAreaView>
            <View>
                <Button onPress={() => console.log("button pressed")}>
                    Sign up
                </Button>

            </View>
        </View>



    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        padding: 24,
    },
    main: {
        flex: 1,
        justifyContent: "center",
        marginHorizontal: "auto",
    },
    title: {
        fontSize: 64,
        fontWeight: "bold",
    },
    subtitle: {
        fontSize: 36,
        color: "#38434D",
    },
    profile:{
        textAlign: "right",
        fontSize: 64,

    },
});
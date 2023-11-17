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
    const [email, setEmail] = React.useState('');


    const handleSubmit = (event) => {
        console.log(userId)
        console.log(password)
        console.log(email)


        axios.post('http://192.168.1.15:5000/signup', {
            userId: userId,
            password: password,
            email: email
        }).then(response => {
            console.log(response.data);
            if (response.data.success === true) {
                router.push({pathname:'/components/profile',
                params: {userId: userId}});
            }else{
                console.log(response.data)
            }

        }).catch(error => {
            console.error(error);
        })

    }


    return (
        <SafeAreaView>
            <TextInput
                id="email"
                onChangeText={setEmail}
                placeholder= "email"
                value = {email}
            />
            <TextInput
                id="username"
                onChangeText = {setUserId}
                placeholder = "username"
                value ={userId}

            />
            <TextInput
                id="password"
                onChangeText = {setPassword}
                value = {password}
                placeholder = "password"
            />


            <Button label={"Sign up"} onPress={() => handleSubmit()}/>
        </SafeAreaView>

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
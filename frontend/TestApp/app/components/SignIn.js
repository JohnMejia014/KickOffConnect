import {Alert, SafeAreaView, TextInput} from "react-native";
import Text from "react-native";
import React from 'react';
import Button from "./Button";
import {RectButton} from "react-native-gesture-handler";
import axios from 'axios';
import {router} from "expo-router";


export default function Page() {



    const [userId, setUserId] = React.useState('Username');
    const [password, setPassword] = React.useState('');


    const handleSubmit = (event) => {
        console.log(userId)
        console.log(password)


        axios.post('http://192.168.1.248:5000/login', {
            userId: userId,
            password: password
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
            <SafeAreaView >
                <TextInput
                    id="username"
                    multiline
                    numberOfLines={2}
                    onChangeText={setUserId}
                    value={userId}
                />
                <TextInput
                    id="password"
                    caretHidden={true}
                    onChangeText={setPassword}
                    value={password}
                    placeholder="password"
                />

                <Button label={"Sign in"} onPress={() => handleSubmit()}/>

            </SafeAreaView>

    );
}



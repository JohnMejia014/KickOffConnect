import { Text, View } from 'react-native';
import Button from "./Button";
import route from 'expo-router';
import {useLocation} from "react-router-dom";

import {useState} from "react";


export default function Page() {

    const location = window.location.search
    const userId = location.substring(8)
    console.log(userId)

    return(
        <View>
            <Text>
                Profile page
                {userId}
            </Text>
        </View>
    );
}
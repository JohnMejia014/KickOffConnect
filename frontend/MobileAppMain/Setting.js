import React from 'react'
import {TouchableOpacity, Text} from "react-native";
import { Actions } from 'react-native-router-flux';

const Setting = () => {
    const goToWelcome = () => {
        Actions.Welcome()
    }
    return(
        <TouchableOpacity style = {{ margin: 128}} onPress = {goToWelcome}>

            <Text>Settings</Text>

        </TouchableOpacity>
    )
}
export default Setting
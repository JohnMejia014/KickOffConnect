import React from 'react'
import { TouchableOpacity, Text} from "react-native";
import { Actions } from 'react-native-router-flux';

const Welcome = () => {
    const goToSettings = () => {
        Actions.Settings()
    }
    return(
        <TouchableOpacity style = {{ margin: 128}} onPress ={ goToSettings}>

            <Text>Home</Text>

        </TouchableOpacity>
    )
}
export default Welcome
import React from 'react';
import {View, Text, TouchableOpacity, TextInput, StyleSheet} from 'react-native';
import Button from "../../components/Button";
import navigation from "../Navigation";
import ImageUpload from './ImageUpload.js';






const PostObject=()=>{


    return(

        <View style={styles.container}>
            <ImageUpload/>
            <TextInput>Thoughts... </TextInput>
        </View>

    );
}

export default PostObject;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
    },
    video: {
        alignSelf: 'center',
        width: 400,
        height: 400,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
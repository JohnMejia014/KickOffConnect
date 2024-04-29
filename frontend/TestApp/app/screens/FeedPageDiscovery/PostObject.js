import React, {useState} from 'react';
import {View, Text, TouchableOpacity, TextInput, StyleSheet, Button} from 'react-native';
import ImageUpload from './ImageUpload.js';
import axios from 'axios';



const PostObject=({navigation, route})=>{

    const [image, setImage] = useState(null)
    const [text, setText] = useState(null)
    const [postTitle, setTitle] = useState(null)
    const [file, setFile] = useState(null)
    const [base, setBase] = useState(null)
    const [type, setType] = useState(null)
    const [user, setUser] = useState(route.params.source)
    const baseUrl = 'http://10.155.229.89:5000';// Define your base URL here




    console.log(user)
    console.log(type)
    const step = "image change"
    const imageChange = (event) => {

        setFile(event["file"])
        setBase(event["base"])
        setType(event["type"])

    }




    const post = () => {



        axios.post(`${baseUrl}/S3Uploader`, {
            image: base,
            text: text,
            postTitle: postTitle,
            path: file,
            type: type,
            user: user,

        }).then(res => {
            console.log(res.data);
            navigation.navigate('Root');

        }).catch(error => {
            console.log(error);
        })

    }



    return(

        <View style={styles.container}>
            <TextInput onChangeText={setTitle} >Subject</TextInput>
            <ImageUpload func={imageChange}/>
            <TextInput onChangeText={setText}>Thoughts... </TextInput>
            <Button title={"Upload post"} onPress={post} />

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

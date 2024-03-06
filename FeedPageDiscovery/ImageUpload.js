import { StatusBar } from "expo-status-bar";
import { StyleSheet, View} from "react-native";
import React, { useState, useEffect } from 'react';
import { Button, Image, Platform } from 'react-native';
import ImageViewer from '../../components/ImageViewer';
const PlaceholderImage = require("../../../assets/images/background-image.png");


import * as ImagePicker from 'expo-image-picker';
import CircleButton from "../../components/CircleButton";
import IconButton from "../../components/IconButton";
import EmojiPicker from "../../components/EmojiPicker";
import {saveToLibraryAsync} from "expo-media-library";

export default function ImageUpload() {


    const [showAppOptions, setShowAppOptions] = useState(false);
    const [image, setImage] = useState(null);

    const takeVid = async () => {
        let result = await  ImagePicker.launchCameraAsync({
            allowsEditing: true,
            videoMaxDuration: 15,
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,

        })

        console.log(result);


        if (!result.canceled) {
            set(result.assets[0].uri);
        }
    }

    const takePic = async () => {
        let result = await  ImagePicker.launchCameraAsync({
            allowsEditing: false,
            mediaTypes: ImagePicker.MediaTypeOptions.All,

        })

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 1,

        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

            {image && <Image source={{ uri: image }} style={{ width: 400, height: 400 }} />}
            <Button title="Pick from camera roll" onPress={pickImage} />
            <Button title="Take an Video from camera" onPress={takeVid} />
            <Button title="Take a Picture from camera" onPress={takePic} />
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        alignItems: 'center',
    },
    imageContainer: {
        flex: 1,
        paddingTop: 58,
    },
    footerContainer: {
        flex: 1 / 3,
        alignItems: 'center',
    },
    optionsContainer: {
        position: 'absolute',
        bottom: 80,
    },
    optionsRow: {
        alignItems: 'center',
        flexDirection: 'row',
    },

});


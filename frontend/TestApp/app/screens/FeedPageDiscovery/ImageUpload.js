import {Button, Image, StyleSheet, View, ToastAndroid} from "react-native";
import React, {useState} from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

export default function ImageUpload(props) {


    const [showAppOptions, setShowAppOptions] = useState(false);
    const [file, setFile] = useState(null);
    const [path, setPath] = useState(null)
    const [base, setBase] = useState(null)
    const [type, setType] = useState(null)
    const [time, setTime] = useState(null)
    const baseUrl = 'http://192.168.1.119:5000'; // Define your base URL here






    const takeVid = async () => {
        let result = await  ImagePicker.launchCameraAsync({
            allowsEditing: true,
            videoMaxDuration: 15,
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,

        })

        console.log(result);
        if (!result.canceled) {
            setFile(result.assets[0].uri);
        }
    }

    const takePic = async () => {

        let result = await  ImagePicker.launchCameraAsync({
            allowsEditing: false,
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            base64: true,

        })


        console.log(result);

        if (!result.canceled) {
            setPath(result.assets[0].uri);
            setBase(result.assets[0].base64);
            setType(result.assets[0].type)
        }
    }

    const uriToBase64 = async (uri) => {
        return await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
        });
    };

    const toServer = async (mediaFile) => {
        let type = mediaFile.type;
        let schema = "http://";
        let host = "http://10.155.229.89:5000";
        let route = "";
        let port = "5000";
        let url = "";
        let content_type = "";
        type === "image"
            ? ((route = "/image"), (content_type = "image/jpeg"))
            : ((route = "/VidDownload"), (content_type = "video/mp4"));
        url = schema + host + ":" + port + route;

        let response = await FileSystem.uploadAsync(url, mediaFile.uri, {
            headers: {
                "content-type": content_type,
            },
            httpMethod: "POST",
            uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
        });

       // console.log(response.headers);
        //console.log(response.body);
    };





    const pickImage = async () => {
        // No permissions request is necessary for launching the image library

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
            base64: true,
            aspect: [4, 3],
            quality: 1,

        });


        if (!result.canceled) {
            console.log(result.assets[0].uri);
            setPath(result.assets[0].uri);

            setBase(result.assets[0].base64);
            setType(result.assets[0].type)



            if (result.assets[0].type === "image") {
                await toServer({
                    type: result.assets[0].type,
                    base64: result.assets[0].base64,
                    uri: result.assets[0].uri,
                });
            } else {

                if (result.assets[0].duration < 20000) {

                    let base64 = await uriToBase64(path);
                    await toServer({
                        type: type,
                        base64: base64,
                        uri: path
                    })
                } else {
                    ToastAndroid.show("Video File too long", ToastAndroid.SHORT)
                }
            }
        }
    };


    props.func({base, file, type})

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {<Image source={{ uri: path }} style={{ width: 400, height: 400 }} />}
            <Button title="Pick from camera roll" onPress={pickImage} />
        </View>
    );

}


// <Button title="Take an Video from camera" onPress={takeVid} />
// <Button title="Take a Picture from camera" onPress={takePic} />

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
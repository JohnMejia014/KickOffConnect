import React from 'react';
import {View,StyleSheet,Button, Text, TouchableOpacity} from 'react-native';
import navigation from "../Navigation";
import ReactPlayer from 'react-player';
import {Video, ResizeMode} from "expo-av";
import vid from "./lab.mp4";
import WebView from "react-native-webview";






const VideoPlayer=()=> {
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});
        return (
            <View style={styles.container}>

                <Video
                    ref={video}
                    style={styles.video}
                    source={vid}
                    useNativeControls
                    resizeMode={ResizeMode.CONTAIN}
                    isLooping
                    onPlaybackStatusUpdate={status => setStatus(() => status)}
                />
                <View>
                    <Button
                        title={status.isPlaying ? 'Pause' : 'Play'}
                        onPress={() =>
                            status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
                        }
                    />
                </View>
            </View>
        );

}

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


export default VideoPlayer;
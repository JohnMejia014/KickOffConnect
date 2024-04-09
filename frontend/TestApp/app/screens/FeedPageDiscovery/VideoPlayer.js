import React from 'react';
import {View,StyleSheet,Button, Text, TouchableOpacity} from 'react-native';
import {Video, ResizeMode} from "expo-av";





const VideoPlayer = ({navigation, route}) => {



    const video = React.useRef(null);
    console.log(route.params.source)



    const [status, setStatus] = React.useState({});

    return (
        <View style={styles.container}>
            <View style={styles.exit}>
                <Button title={"X"} onPress={() => navigation.navigate('Root')} />
            </View>
            <Video
                ref={video}
                style={styles.video}
                source={{ uri: route.params.source}}
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
        marginBottom: 200,
        marginStart: 0,
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
    exit: {
        justifyContent : "flex-start",
        flexWrap: 'wrap',

    }
});


export default VideoPlayer;
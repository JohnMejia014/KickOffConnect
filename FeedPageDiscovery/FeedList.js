import React, {useEffect, useRef, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Image, Button} from 'react-native';
import {NavigationContainer, useScrollToTop} from "@react-navigation/native";
import {Link} from "expo-router";
import StackNavigator from "@react-navigation/stack/src/navigators/createStackNavigator";
import {ScreenStack} from "react-native-screens";
import {createNativeStackNavigator} from "react-native-screens/native-stack";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import stack from "expo-router/src/layouts/Stack";
import pic from "./Posts/post1.jpg";
import {StyleSheet} from "react-native";
import axios from 'axios';



const sample = {
    "response": [
        {
            "post_id": 16,
            "instagram_link": "https://www.instagram.com/fcbarcelona/p/C3n2fYgraau/",
            "post_title": "Team",
            "post_user": "FC Barcelona",
            "user_photo": "",
            "cover_photo": "",
            "video_url": ""
        },

    ]
}



const FeedList = ({navigation}) => {

    const [searchQuery, setSearchQuery] = useState('');
    const [feed, setFeed] = useState([]);
    const [length, setLength] = useState(0)
    const ref = useRef(null);
    useScrollToTop(ref)


    useEffect(() => {

        axios.post('http://192.168.1.253:5000/S3List')
            .then((response) => {
                setFeed(response.data.list);
                setLength(response.data.length);
                console.log(response.data.list);
                console.log(response.data.list);

            })


    }, []);

    var ImageList = [
        require('./Posts/post1.jpg'),
        require('./Posts/post2.jpg'),
    ]





    return(
        <View>

            <TouchableOpacity>
                <Button title={"load feed"} onPress={() => useEffect} />
            </TouchableOpacity>

            <TouchableOpacity>
                <Button title={"Sample Video"} onPress={() => navigation.navigate("Video")} />
            </TouchableOpacity>

            <TouchableOpacity>
                <Button title={"Post Creation"} onPress={() => navigation.navigate("Create")} />
            </TouchableOpacity>

            <Text>Feed Screen</Text>
            <View>
                <TextInput value={searchQuery} onChangeText={(val) => setSearchQuery(val)} placeholder={"Enter user or hashtag"}/>
            </View>

            <View style={styles.mainPostView}>
                {length < 1?
                    <ActivityIndicator size={"large"}/>
                    :
                    <FlatList
                        data = {feed}
                        ref = {ref}
                        renderItem={({item, index})=>(
                            <View style = {styles.postView}>
                                <View style={styles.postTitle}>
                                    <View style={styles.imageView}>
                                        <Image style={styles.imageView} source={ImageList[index]} />
                                        <View style={styles.titleView}>
                                            <Text>{item}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}
                    />
                }

            </View>





        </View>

    )
};

export default FeedList;


const styles = StyleSheet.create({





    Heading:{
        fontSize:32,
        marginTop:60,
        marginLeft:15,
        fontWeight:'bold',
    },
    TextInput:{
        height:40,
        width:"90%",
        backgroundColor: '#EBEBEB',
        borderRadius:20,
        paddingLeft:15,
        marginTop:20
    },
    mainPostView: {
        width: "100%"
    },
    titleView:{
        marginLeft:15,
    },
    postTitle:{
        width:"90%",
        display:'flex',
        justifyContent:'space-between',
        flexDirection:'row'
    },
    postView:{
        width:'100%',
        alignItems: "center",
        marginTop: 10,
    },
    userPhoto:{
        width: 50,
        height: 50
    },
    imageView:{
        display:"flex",
        flexDirection:"row",
        width: 300,
        height: 900,
    }

})
import React, {useEffect, useRef, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Image, Button} from 'react-native';
import { useScrollToTop} from "@react-navigation/native";
import {StyleSheet} from "react-native";
import axios from 'axios';
import {Video} from "expo-av";
import { LinearGradient } from 'expo-linear-gradient';

const FeedList = ({navigation, route}) => {
    const baseUrl = 'http://192.168.1.119:5000'; // Define your base URL here
    const [searchQuery, setSearchQuery] = useState('');
    const [feed, setFeed] = useState([]);
    const [imageL, setImageL] = useState([]);
    const [length, setLength] = useState(0)
    const [desc, setDesc] = useState([]);
    const [type, setType] = useState([]);
    const [load, setLoad] = useState(0);
    const [more, setMore] = useState(0);
    const [friendL, setFriend] = useState([]);
    const [userInfo, setUserInfo] = useState(route.params);
    const [time, setTime] = useState([]);




    const user = userInfo.params.userID

    const ref = useRef(null);
    useScrollToTop(ref)

    const Increment = () => {

        setLoad(load + 1)

    }


    useEffect(() => {

        axios.post(`${baseUrl}/S3FriendList`, {
            user: user
        })
            .then((response) => {

                setFeed(response.data.list);
                setLength(response.data.size);
                setDesc(response.data.text);
                setImageL(response.data.image);
                setType(response.data.type);
                setFriend(response.data.friend);
                setTime(response.data.time);
                console.log(response.data.friend)
                console.log(response.data.time)

            })
    }, [load]);


    const FindUsers = () => {

        axios.post(`${baseUrl}/SearchUsers`, {
            query: searchQuery

        }).then(

        )
    }

    return(
        <LinearGradient colors={['#0d47a1', '#1565c0']} style={styles.gradientContainer}>

        <View>


            <Button title={"load feed"} onPress={Increment} />

            <View style={styles.search}>
                <TextInput value={searchQuery} onChangeText={(val) => setSearchQuery(val)}
                           placeholder={"Enter user or hashtag"} style={styles.TextInput}/>
                {searchQuery === ''?
                    <TouchableOpacity style={styles.searchButton} onPress={FindUsers}>
                        <Text style={styles.queryText}>Search</Text>
                    </TouchableOpacity>
                    :
                    <View style={styles.searchButton}>
                        <TouchableOpacity  onPress={() => setSearchQuery('')}>
                            <Text style={styles.clearText} selectionColor={"white"} >X</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={FindUsers}>
                            <Text style={styles.queryText}>Search</Text>
                        </TouchableOpacity>

                    </View>
                }


            </View>


            <View style={styles.mainPostView}>
                {length < 1?
                    <ActivityIndicator size={"large"}/>
                    :
                    <View>
                        <FlatList
                            data={feed}
                            ref={ref}
                            renderItem={({ item, index }) => (
                                <View style={styles.postView}>
                                <View style={styles.postTitle}>
                                    <TouchableOpacity onPress={() => navigation.navigate("Video", { source: imageL[index] })}>
                                    <Image style={styles.imageView} source={{ uri: imageL[index] }} />
                                    </TouchableOpacity>
                                    <View style={styles.postContent}>
                                    <View style={styles.postHeader}>
                                        <Text style={styles.friendName}>{friendL[index]}</Text>
                                        <Text style={styles.postTime}>{time[index]}</Text>
                                    </View>
                                    <Text style={styles.postDescription}>{desc[index]}</Text>
                                    </View>
                                </View>
                                </View>
                            )}
                            />
            <Button title={"Post Creation"} onPress={() => navigation.navigate("Create", {source: user})} />

                        {/* <Button title={"load more"} load more/> */}
                    </View>

                }

            </View>


        </View>

            </LinearGradient>

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
        width:"85%",
        backgroundColor: '#EBEBEB',
        borderRadius:20,
        paddingLeft:15,
        marginTop:20
    },
    mainPostView: {
        width: "100%",
        marginBottom:500,

    },
    titleView:{
        marginLeft:15,
    },
    postTitle:{
        width:"90%",
        display:'flex',
        justifyContent:'space-between',
        flexDirection:'row',
        borderStyle: "solid",
        borderWidth: 10,
        borderColor: "black",
    },
    postView:{
        width:'100%',
        alignItems: "center",
        marginTop: 10,
        maxHeight: 300,

    },
    postFormat:{
      width: "100%",
    },
    userPhoto:{
        width: 50,
        height: 50
    },
    imageView:{
        display: "flex",
        flexDirection: "row",
        maxWidth: "100%",
        height: 200,
        resizeMode: "contain"

    },
    search: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",

    },
    searchButton: {

        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        width: "15%",
        textAlign: "auto",
        paddingVertical: 10,



    },
    queryText: {

        fontSize: 14,
        backgroundColor: "#2196F3",
        borderRadius: 2,
        color: 'white',
        fontWeight: '200',
        elevation: 4,
        marginVertical: 10,
        textAlignVertical: "center",
        paddingHorizontal: 5,
        paddingVertical: 10

    },
    clearText: {

        elevation: 4,
        fontSize: 14,
        backgroundColor: "red",
        borderRadius: 2,
        color: 'white',
        fontWeight: '200',
        marginVertical: 10,
        textAlignVertical: "center",
        paddingHorizontal: 5,
        paddingVertical: 10


    },
    postTitle: {
        width: "100%",
        flexDirection: 'column',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
      },
      postView: {
        width: '100%',
        alignItems: "center",
        marginTop: 10,
        paddingBottom: 10,
      },
      imageView: {
        width: "100%",
        height: 300,
        resizeMode: "cover",
        marginBottom: 10,
      },
      postContent: {
        paddingHorizontal: 10,
        marginBottom: 10,
      },
      postHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
      },
      friendName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 10,
      },
      postTime: {
        fontSize: 12,
        color: "#888",
      },
      postDescription: {
        fontSize: 14,
        lineHeight: 20,
      },

})
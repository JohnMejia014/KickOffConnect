import React, {useEffect, useRef, useState} from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Image,
    Button,
    TouchableWithoutFeedback
} from 'react-native';
import { useScrollToTop} from "@react-navigation/native";
import {StyleSheet} from "react-native";
import axios from 'axios';
import {Video} from "expo-av";


const FeedList = ({navigation, route}) => {
    const baseUrl = 'http://192.168.1.253:5000'; // Define your base URL here
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
    const [queryResponse, setQueryResponse] = useState(false);
    const [profile, setProfile] = useState(null);
    const [stranger, setStranger] = useState(null);




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
            query: searchQuery,
            user: user

        }).then((response) => {

            console.log(response.data)
            setQueryResponse(response.data.success)
            setProfile(response.data.profile)
            setStranger(response.data.friend)
        })
    }

    return(
        <View>

            <Button title={"load feed"} onPress={Increment} />
            <Button title={"Post Creation"} onPress={() => navigation.navigate("Create", {source: user})} />
            <TouchableWithoutFeedback onPress={() => setQueryResponse(false)}>

                <View>
                    <View style={styles.mainSearch}>
                        <View style={styles.search}>
                            <TextInput value={searchQuery} onChangeText={(val) => setSearchQuery(val)}
                                       placeholder={"Enter user or hashtag"} style={styles.TextInput}/>
                            {searchQuery === ''?
                                <TouchableOpacity style={styles.searchButton} onPress={FindUsers}>
                                    <Text style={styles.queryText}>Search</Text>
                                </TouchableOpacity>
                                :
                                <View style={styles.searchButton}>
                                    <TouchableOpacity  onPress={() => {setSearchQuery(''), setQueryResponse(false)}}>
                                        <Text style={styles.clearText} selectionColor={"white"} >X</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={FindUsers}>
                                        <Text style={styles.queryText}>Search</Text>
                                    </TouchableOpacity>

                                </View>
                            }
                        </View>
                        {queryResponse === true?
                            <View style={styles.searchResponse}>

                                    <View style={styles.searchView}>
                                        <Image style={styles.userPhoto} source={{uri: profile}}/>
                                        {!stranger &&
                                        <TouchableOpacity >
                                            <Text style={styles.searchResults}> Add </Text>
                                        </TouchableOpacity> }
                                        <TouchableOpacity >
                                            <Text style={styles.searchResults}>View Profile</Text>
                                        </TouchableOpacity>
                                    </View>
                            </View>
                            :
                            <View>

                            </View>

                        }
                    </View>

                    <View style={styles.mainPostView}>
                        {length < 1?
                            <ActivityIndicator size={"large"}/>
                            :
                            <View style={{height: "85%"}}>
                                <FlatList
                                    data = {feed}
                                    ref = {ref}
                                    renderItem={({item, index})=>(
                                        <View style = {styles.postView}>
                                            <View style={styles.postTitle}>

                                                <View style={styles.postFormat}>

                                                    {type[index] === "mp4" ?
                                                        <TouchableOpacity onPress={() => navigation.navigate("Video", {source: imageL[index]})}>
                                                            <Video style={styles.imageView} source={{uri: imageL[index]}}/>
                                                        </TouchableOpacity>
                                                        :
                                                        <Image style={styles.imageView} source={{uri: imageL[index]}}/>
                                                    }
                                                    <Text>by {friendL[index]} at {time[index]}</Text>
                                                    <Text>{desc[index]}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    )}
                                />
                                <Button title={"load more"} load more/>
                            </View>

                        }
                    </View>

                </View>

            </TouchableWithoutFeedback>
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
        width:"85%",
        backgroundColor: '#EBEBEB',
        borderRadius:20,
        paddingLeft:15,
        marginTop:20
    },
    mainPostView: {
        width: "100%",
        zIndex: 1,
    },
    mainSearch: {
        zIndex: 2,
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
        zIndex: 2,

    },
    searchResponse: {
        width: "90%",
        zIndex: 2,
    },
    searchView: {
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-evenly",
        zIndex: 2,

    },
    searchResults: {
        display: "flex",
        justifyContent:"space-evenly",
        flexDirection: "row",
        textAlign:"center",
        zIndex: 2,
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

})
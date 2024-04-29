import React, {useEffect, useRef, useState} from 'react';
import {
    ActivityIndicator,
    Button,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import {useScrollToTop} from "@react-navigation/native";
import axios from 'axios';
import {Video} from "expo-av";
import {LinearGradient} from 'expo-linear-gradient';
import {max, min} from "lodash";


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
    const [friendID, setFriendID] = useState(null);
    const [fRequest, setRequest] = useState(false);

    const [comments, setComments] = useState([]);
    const [commentRender, setCommentRender] = useState([]);
    const [friendInfo, setFriendInfo] = useState(null);
    const [noFriend, setNoFriend] = useState(true);
    const [,forceRender] = useState(undefined);
    const [y, setY] = useState(null);
    const [userComment, setComment] = useState(null);
    const [editComment,setEdit] = useState(false);

    let list = []
    const user = userInfo.params.userID

    const ref = useRef(null);

    useScrollToTop(ref)

    const Increment = () => {

        setLoad(load + 1)

    }


    useEffect(() => {

        axios.post(`${baseUrl}/S3FriendList`, {
            user: user,
            friends: userInfo.params.friends,

        })
            .then((response) => {

                setFeed(response.data.list);
                setLength(response.data.size);
                setDesc(response.data.text);
                setImageL(response.data.image);
                setType(response.data.type);
                setFriend(response.data.friend);
                setTime(response.data.time);
                setComments(response.data.comment)
                setNoFriend(response.data.empty)
                console.log(response)

            })
    }, [load]);


    const FindUsers = () => {

        axios.post(`${baseUrl}/SearchUsers`, {
            query: searchQuery,
            user: user

        }).then((response) => {

            setQueryResponse(response.data.success)
            setProfile(response.data.profile)
            setStranger(response.data.friend)
            setFriendID(response.data.friendID)
            setFriendInfo(response.data.friendInfo)
        })
    }

    const FriendRequest = () => {

        axios.post(`${baseUrl}/sendFriendRequest`, {
            userID: user,
            friendID: friendID


        }).then((response) => {

            setQueryResponse(response.data.success)
            setProfile(response.data.profile)
            setStranger(response.data.friend)
            setRequest(true)
        })

    }









    return(
        <LinearGradient colors={['#0d47a1', '#1565c0']} style={styles.gradientContainer}>

        <View>

            {//<Button title={"load feed"} onPress={Increment} />
            }
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
                                        <TouchableOpacity onPress={FriendRequest}>
                                            <Text style={styles.searchResults}> Add </Text>
                                        </TouchableOpacity> }
                                        {fRequest && <Text style={styles.searchResults}> Sent </Text>}
                                        <TouchableOpacity onPress={() => navigation.navigate("AppScreen",{ screen: 'Profile', source: {userInfo: userInfo.params, friendStatus: true, friendInfo:friendInfo.Items[0]}})}>
                                            <Text style={styles.searchResults}>View Profile</Text>
                                        </TouchableOpacity>
                                    </View>
                            </View>
                            :
                            <View></View>

                        }
                    </View>
                    <View style={styles.mainPostView}>
                        {(length < 1)?
                            <ActivityIndicator collapsable={true} size={"large"}/>
                            :
                            <View style={{maxHeight: "100%"}}>
                                <FlatList
                                    data = {feed}
                                    ref = {ref}

                                    onRefresh={() => Increment}
                                    refreshing={false}
                                    extraData={commentRender}

                                    renderItem={({item, index})=>(
                                        <TouchableWithoutFeedback>
                                            <View style = {styles.postView}>
                                                <View style={styles.postTitle}>

                                                    {type[index] === "mp4" ?
                                                        <TouchableOpacity onPress={() => navigation.navigate("Video", {source: imageL[index]})}>
                                                            <Video style={styles.imageView} source={{uri: imageL[index]}}/>
                                                        </TouchableOpacity>
                                                        :
                                                        <TouchableOpacity onPress={() => navigation.navigate("Comment", {source: imageL[index],user: user,desc:desc[index],time: time[index], comment: comments[index], feed: feed[index],friend: friendL[index]})}>
                                                            <Image style={styles.imageView} source={{uri: imageL[index]}}/>
                                                        </TouchableOpacity>
                                                    }
                                                    <Text>by {friendL[index]} at {time[index]}</Text>
                                                    <Text>{desc[index]}</Text>
                                                </View>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    )}
                                />
                            </View>

                        }
                    </View>

                </View>

            </TouchableWithoutFeedback>
        </View>

            </LinearGradient>

    )
};

export default FeedList;


//<Button title={"load more"} load more/>
//<Button title={"view y"} onPress={() => handleScroll()}/>
//for expandable try doing slicing for loading more of data flatlist is pulling

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
        borderStyle: "solid",
        borderWidth: 10,
        borderColor: "black",
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
        maxWidth: "100%",
        height: 200,
        resizeMode: "contain",
        zIndex: 3
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


    },commentLayout:{
        flexDirection: "row",


    },
    // postTitle: {
    //     width: "100%",
    //     flexDirection: 'column',
    //     padding: 10,
    //     borderBottomWidth: 1,
    //     borderBottomColor: "#ccc",
    //   },
    //   postView: {
    //     width: '100%',
    //     alignItems: "center",
    //     marginTop: 10,
    //     paddingBottom: 10,
    //   },
    //   imageView: {
    //     width: "100%",
    //     height: 300,
    //     resizeMode: "cover",
    //     marginBottom: 10,
    //   },
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
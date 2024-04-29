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
    const baseUrl = 'http://10.155.229.89:5000'; // Define your base URL here
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
                                        <TouchableOpacity onPress={() => navigation.navigate("ProfileView",{params: {userInfo: userInfo.params, friendStatus: true, friendInfo:friendInfo.Items[0]}})}>
                                            <Text style={styles.searchResults}>View Profile</Text>
                                        </TouchableOpacity>
                                    </View>
                            </View>
                            :
                            <View></View>

                        }
                    </View>
                    <View style={styles.postView}>
                        {(length < 1)?
                            <ActivityIndicator collapsable={true} size={"large"}/>
                            :
                            <View style={{maxHeight: "90%"}}>
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
                                                   <View style={styles.postTitle}>
                                                    <Text style={styles.postMeta}>
                                                        by <Text style={styles.friendName}>{friendL[index]}</Text> at <Text style={styles.postTime}>{time[index]}</Text>
                                                    </Text>
                                                    <Text style={styles.postDescription}>{desc[index]}</Text>
                                                </View>

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
    gradientContainer: {
        flex: 1,
    },
    mainSearch: {
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 5,
        backgroundColor: '#aed9e0', // Light blue background for search bar
        borderBottomWidth: 1,
        borderBottomColor: '#7fadb5',
    },
    search: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#d6eaf8', // Lighter blue background for search input area
        borderRadius: 20,
        paddingHorizontal: 10,
    },
    TextInput: {
        flex: 1,
        height: 40,
        marginLeft: 10,
        color: '#3498db', // Dark blue text color for search input
    },
    searchButton: {
        paddingHorizontal: 10,
    },
    queryText: {
        fontSize: 14,
        color: '#fff',
        backgroundColor: '#3498db', // Dark blue background for search button
        borderRadius: 2,
        paddingVertical: 8,
        paddingHorizontal: 12,
        fontWeight: 'bold', // Bold text for search button
    },
    clearText: {
        fontSize: 14,
        color: '#fff',
        backgroundColor: '#2980b9', // Slightly lighter blue background for clear button
        borderRadius: 2,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginLeft: 5,
    },
    postView: {
        backgroundColor: '#aed9e0', // Light gray-blue background for posts
        marginVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#bdc3c7', // Lighter gray-blue border color
        overflow: 'hidden',
    },
    imageView: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    userPhoto: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
   
    postTitle: {
        paddingHorizontal: 15,
        paddingTop: 10,
    },
    friendName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#3498db', // Dark blue color for friend name
    },
    postTime: {
        fontSize: 12,
        color: '#2980b9', // Slightly lighter blue color for post times
        marginBottom: 5,
    },
    postDescription: {
        fontSize: 14,
        lineHeight: 20,
        color: '#154360', // Deep blue color for post descriptions
    },
    postMeta: {
        marginBottom: 5,
    },
});

import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Button, Text, TouchableOpacity, FlatList, Image, TextInput} from 'react-native';
import {Video, ResizeMode} from "expo-av";
import {max, min} from "lodash";
import axios from "axios";





const CommentView = ({navigation, route}) => {



    const baseUrl = 'http://10.155.229.89:5000'; // Define your base URL here



    const comm = JSON.parse(route.params.comment)
    const [load, setLoad] = useState(0);
    const [comments, setComments] = useState([]);
    const [commentRender, setCommentRender] = useState([]);
    const [,forceRender] = useState(undefined);
    const [y, setY] = useState(null);
    const [userComment, setComment] = useState(null);
    const [editComment,setEdit] = useState(false);
    const [commList, setCommList] = useState((JSON.parse(route.params.comment))["Comments"]);


    console.log(commList)

    const commentPost = () => {

        setEdit(true)

    }

    const viewComment = (index) => {
        console.log(comments)
        console.log(commentRender)
        commentRender[index] = true
        console.log(commentRender)
    }

    const moreComment = () => {
        setCommentRender(commentRender + 5);
    }

    const hideComment = (index) => {

        console.log(comments)
        console.log(commentRender)
        commentRender[index] = false
        console.log(commentRender)
    }

    const Increment = () => {

        setLoad(load + 1)

    }


    const uploadComment = () => {


        axios.post(`${baseUrl}/uploadComment`, {
            userID: route.params.user,
            friendID: route.params.friend,
            post: route.params.feed,
            comment: userComment,


        }).then((response) => {
            Increment()
            setEdit(false)
            setComment('');

        })

        let list = commList.length
        commList[list] = {comment: userComment, userID: route.params.user}

    }

    const handleRender = () => {

        forceRender((prev) => !prev)
        console.log(imageL)

    }

    const scrollToIndex = (index) => {

        ref?.current?.scrollToIndex({

            index: index,
            animated: true,
            viewPosition: 0,

        })
        console.log("scroll")

    }

    const scrollToEnd = (index) => {

        ref?.current?.scrollToIndex({

            index: index,
            animated: true,
            viewPosition: 1,

        })
        console.log("scroll")


    }

    const handleScroll = () => {

        console.log(y)

    }



    return (

        <View style={styles.container}>
            <View style={styles.exit}>
                <Button title={"X"} color='black' onPress={() => navigation.navigate('Root')} />
            </View>
            <View style={styles.postView}>
                <Image style={styles.imageView} source={{ uri: route.params.source}} />
                <Text style={styles.postInfo}>by {route.params.friend} at {route.params.time}</Text>
                <Text style={styles.postDescription}>{route.params.desc}</Text>
                <TouchableOpacity style={styles.buttonContainer} onPress={commentPost}>
                    <Text style={styles.buttonText}>Comment</Text>
                </TouchableOpacity>             
                    {editComment &&
                    <View>
                    <View style={styles.commentInput}>
                        <TextInput
                            value={userComment}
                            onChangeText={setComment}
                            placeholder="Add a comment..."
                            placeholderTextColor="#888"
                        />
                    </View>                       
                    <View style={styles.commentActions}>
                    <TouchableOpacity style={styles.buttonContainer} onPress={() => { setEdit(false); setComment(''); }}>
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonContainer} onPress={uploadComment}>
                        <Text style={styles.buttonText}>Post</Text>
                    </TouchableOpacity>
                    </View>
                    </View>}
                <View style={{ maxHeight:"30%"}}>
                    <FlatList
                        data={commList}
                        extraData={load}
                        style={styles.commentList}
                        renderItem={({item, index2}) => (
                            <View style={styles.commentItem}>
                                 <Text>{item.userID}: {item.comment}</Text>
                            </View>
                            
                        )}
                        
                        />
                </View>
            </View>
        </View>
    );

}
//ListFooterComponent={() => <TouchableOpacity onPress={() => {hideComment(index), handleRender()}}><Text>Hide Comments</Text></TouchableOpacity}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2193b0',
        padding: 10,
    },

    commentList: {
        borderStyle: "solid",
        borderWidth: 2,
        marginTop: 10,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 5,

    },
    commentItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#2193b0", // Match the background color of the container
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
    lineHeight: 20, // Adjust as needed
},
    postView: {
        marginTop: 10,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderRadius: 10,
        backgroundColor: '#2196F3',

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    imageView: {
        width: '100%',
        height: 300,
        marginBottom: 10,
        resizeMode: 'cover',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    exit: {
        alignSelf: 'flex-end',
        marginBottom: 10,
        color: 'red',
        
    },
    commentInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 8,
        marginBottom: 10,
    },
    commentActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    commentButton: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
    },
    commentButtonText: {
        color: '#2193b0',
        fontWeight: 'bold',
    },
    postInfo: {
        fontSize: 14,
        color: '#777',
        marginBottom: 5,
    },
    postDescription: {
        fontSize: 16,
        lineHeight: 22,
        color: '#333',
    },
    buttonContainer: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#2193b0',
        fontWeight: 'bold',
    },
    
});



export default CommentView;
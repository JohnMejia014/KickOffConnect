import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Button, Text, TouchableOpacity, FlatList, Image, TextInput} from 'react-native';
import {Video, ResizeMode} from "expo-av";
import {max, min} from "lodash";
import axios from "axios";





const CommentView = ({navigation, route}) => {



    const baseUrl = 'http://192.168.1.253:5000'; // Define your base URL here



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
                <Button title={"X"} onPress={() => navigation.navigate('Root')} />
            </View>
            <View style={styles.postView}>
                <Image style={styles.imageView} source={{ uri: route.params.source}} />
                <Text>by {route.params.friend} at {route.params.time}</Text>
                <Text>{route.params.desc}</Text>
                <TouchableOpacity onPress={commentPost} style={{flexDirection:"row",justifyContent: "flex-end"}}><Text>Comment</Text></TouchableOpacity>
                {editComment &&
                    <View>
                        <TextInput value={userComment} onChangeText={setComment}></TextInput>
                        <View style={{flexDirection: "row", justifyContent:"space-evenly"}}>
                            <TouchableOpacity onPress={() => {setEdit(false), setComment('')}}><Text>Cancel</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => uploadComment()} ><Text>Post</Text></TouchableOpacity>
                        </View>
                    </View>}
                <View style={{borderStyle: "solid",borderWidth: 2, maxHeight:"30%"}}>
                    <FlatList
                        data={commList}
                        extraData={load}
                        style={{width: "100%", }}
                        renderItem={({item, index2}) => (
                            <View>
                                <Text>{item.userID}: {item.comment}</Text>
                            </View>
                        )}/>
                </View>
            </View>
        </View>
    );

}
//ListFooterComponent={() => <TouchableOpacity onPress={() => {hideComment(index), handleRender()}}><Text>Hide Comments</Text></TouchableOpacity}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ecf0f1',
        marginStart: 0,
        flexDirection: "column"
    },
    postView:{
        marginTop: 5,
        backgroundColor: '#2196F3'

    },
    imageView:{
        maxWidth: "100%",
        height: "55%",
        marginBottom: 5,
        resizeMode: "contain",
        alignItems: "center",

        borderWidth: 3,
        zIndex: 3
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


export default CommentView;
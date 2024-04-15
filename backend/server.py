from flask import Flask, render_template, request, jsonify, redirect
from pymongo import MongoClient
from flask_cors import CORS
import os, sys
import boto3
from boto3.dynamodb.conditions import Key, Attr

# Set the working directory to the root of the project
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))


app = Flask(__name__)

client = MongoClient('mongodb+srv://marcoflo02:Kickoff@cluster0.qgnjjxr.mongodb.net/?retryWrites=true&w=majority')
db = client['Users']
users_collection = db['Users']

import UserHandler 
import MapHandler 

debugMode = False

userHandler = UserHandler.UserHandler()
mapHandler = MapHandler.MapHandler()

CORS(app)

import base64
import boto3
from flask import Flask, jsonify, request
from flask_cors import CORS
from PIL import Image
from io import BytesIO
import numpy as np
import urllib.parse
import random
from boto3.dynamodb.conditions import Key, Attr


aws_mag_con = boto3.session.Session(profile_name="default")


appPath = __file__
appPath = appPath[0:-16]

bucket = 'kickmediabucket'
s3 = aws_mag_con.client('s3')
s3_resource = aws_mag_con.resource('s3')
container = s3_resource.Bucket(bucket)

dynamo = aws_mag_con.client('dynamodb')
dynamo_resource = aws_mag_con.resource('dynamodb')

@app.route('/retrieve-location', methods=['POST'])
def retrieve_location():
    #userId = "KevinFdz"
    #latitude = 21
    #longitude = 42
    data = request.get_json()
    userId = data.get('userId')
    latitude = data.get('latitude')
    longitude = data.get('longitude')

    if not userId or not latitude or not longitude:
        return jsonify({'error': 'Missing username, latitude, or longitude'}), 400

    userData = db[userId]
    user = userData.find_one({'userId': userId})


    if user:
        userData.update_one(
            {'userId': user['userId']},
            {'$set': {'latitude': latitude, 'longitude': longitude}}
        )
        return jsonify({'message': 'Location updated successfully'})




@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    print(data)
    if 1:
        # Call the signup function from the Database class
        userSignup, user_info, _err = userHandler.signupUser({"username":username, "email":email, "password":password})
        if userSignup == False:
            return jsonify({'message': _err})
        else:


            s3.upload_file(
                'PP sample.jpg',
                bucket,
                username + '/profile/profile.jpg',
                ExtraArgs={'Metadata': {'User': username}}
            )

            return jsonify({'message': 'User successfully created', 'userInfo': user_info})
    else:
        return jsonify({'message': 'Invalid request' })


@app.route('/login', methods=['POST'])
def login():
    #username will be used as input to login, can be username or email
    data = request.get_json()
    username = data.get('email')
    password = data.get('password')
    print(data)
    print(username)
    print(password)
    if username and password:
        validLogin, user_info, _err = userHandler.loginUser({"username": username, "password": password})
        if validLogin:
            return jsonify({'message': 'Login successful', 'userInfo': user_info})
        else:
            return jsonify({'message': _err})
    else:
        return jsonify({'message': 'Invalid request'})
    
@app.route('/addEvent', methods=['POST'])
def addEvent():
    data = request.get_json()
    eventID = data.get("eventID")
    eventName = data.get('eventName')
    eventDescription = data.get('eventDescription')
    eventAddress = data.get('eventAddress')
    eventLat = data.get('eventLat')
    eventLong = data.get('eventLong')
    eventTime = data.get('eventTime')
    eventDate = data.get('eventDate')
    eventSports = data.get('eventSports')
    eventHost = data.get('eventHost')
    eventVisibility = data.get('eventVisibility')
    usersInvited = data.get('usersInvited')
    usersJoined = data.get('usersJoined')
    
    if  eventAddress and eventName and eventSports:
        addedEvent, _err = mapHandler.createEvent({"eventID": eventID, "eventName": eventName,"eventDescription": eventDescription, "eventAddress": eventAddress, "eventLat": eventLat, "eventLong": eventLong, "eventTime": eventTime, "eventDate": eventDate, "eventSports": eventSports, "eventHost": eventHost, "eventVisibility": eventVisibility, "usersInvited": usersInvited, "usersJoined": usersJoined })
        if addedEvent:
            return jsonify({'message': 'Event successfully created'})
        else:
            return jsonify({'message': _err})
    else:
        return jsonify({'message': 'Invalid request'})
    

@app.route('/joinEvent', methods=['POST'])
def joinEvent():
    data = request.get_json()
    userID = data.get('userID')
    eventID = data.get('eventID')

    if userID and eventID:
        success, updated_event, error = mapHandler.joinEvent(userID, eventID)
        if success:
            print("Returning User joined the event successfully to front end")
            return jsonify({'message': 'User joined the event successfully', 'event': updated_event, 'success':success}), 200
        else:
            return jsonify({'error': error}), 400
    else:
        return jsonify({'error': 'Invalid request'}), 400

# New route for leaving an event
@app.route('/leaveEvent', methods=['POST'])
def leave_event():
    data = request.get_json()
    userID = data.get('userID')
    eventID = data.get('eventID')

    if userID and eventID:
        success, updated_event, error = mapHandler.leaveEvent(userID, eventID)

        if success:
            return jsonify({'message': 'User left the event successfully', 'event': updated_event, 'success':success}), 200
        else:
            return jsonify({'error': error}), 400
    else:
        return jsonify({'error': 'Invalid request'}), 400

@app.route('/getEvents', methods=['POST'])
def getEvents():
    data = request.get_json()
    user_lat = data.get('latitude')
    user_long = data.get('longitude')
    filters = data.get('filters')
    places = data.get('places')
    print(filters)
    radius = 1000  # You might want to include a radius in the request data
    if user_lat and user_long and radius:
        # Convert latitude, longitude, and radius to float
        user_lat = float(user_lat)
        user_long = float(user_long)
        radius = float(radius)
        print("getEvents called")

        # Retrieve events within the specified radius
        events, error = mapHandler.get_events_within_radius(user_lat, user_long, radius, filters, places)
        print("Events: ", events)
        if error:
            return jsonify({'error': error}), 500
        else:
            return jsonify({'events': events})  # Assuming events is a dictionary

    return jsonify({'error': 'Invalid request'}), 400
   #route for returning user info 
@app.route('/getUserInfo', methods=['POST'])
def getUserInfo():
    data = request.get_json()
    userID = data.get('userID')
    if userID:
        user_info = userHandler.get_user_info(userID)

        if user_info:
            return jsonify({'userInfo': user_info})
        else:
            return jsonify({'error': 'User not found'}), 404
    else:
        return jsonify({'error': 'Invalid request'}), 400
@app.route('/getEventInfo', methods=['POST'])
def getEventInfo():
    data = request.get_json()
    event_ids = data.get('eventIDs')
    print("eventIDs: ", event_ids)
        # Get the list of event IDs from the request data
        
        # Query the events collection for the events with the given IDs
    events, error = mapHandler.getEventsList(event_ids)
        
    print("events: ", events)
        # Prepare the response JSON
    if error:
        return jsonify({"error":  error})
    else:
        return jsonify({"events":  events})
@app.route('/getFriends', methods=['POST'])
def getFriends():
    data = request.get_json()
    userID = data.get('userID')
    print("userID: ", userID)
        # Get the list of event IDs from the request data
        
        # Query the events collection for the events with the given IDs
    friends, error = userHandler.getFriends(userID)
    print("friends: ", friends)
        # Prepare the response JSON
    if error:
        return jsonify({"error":  error})
    else:
        return jsonify({"friends":  friends})

@app.route('/VidDownload', methods=['POST'])
def VidDownload():
    data = request.get_data()
    with open('input.mp4', 'wb') as f:
        f.write(data)

    response = {
        'success': True,
        'text': "success",
    }

    return jsonify(response)


@app.route('/S3Uploader', methods=['POST'])
def S3Uploader():

    data = request.get_json()
    image = data.get('image')
    text = data.get('text')
    postTitle = data.get('postTitle')
    path = data.get('path')
    type = data.get('type')

    user = data.get('user')

    if text == '':
        text = 'No text'

    try:
        check = s3.list_objects_v2(Bucket=bucket, Prefix='posts/' + user + str(postTitle) + "/")
    except:
        check = None

    if check == None:
        postTitle = postTitle + str(random.randint(0, 100000))

    text_file = open("input.txt", "w")
    text_file.write(text)
    text_file.close()

    if type == 'image':
        image = BytesIO(base64.b64decode(image))
        image_file = Image.open(image)
        image_file.save("image.jpg")

        s3.upload_file(
            'image.jpg',
            bucket,
            user + '/posts/' + str(postTitle) + '/' + str(postTitle) + '.jpg',
            ExtraArgs={'Metadata': {'User': user}}
        )
        s3.upload_file(
            'input.txt',
            bucket,
            user + '/posts/' + str(postTitle) + '/' + str(postTitle) + '.txt',

            ExtraArgs={'Metadata': {'User': user}}
        )

        response = {
            'success': True,
            'text': "success",
        }

        return jsonify(response)
    elif type == 'video':

        s3.upload_file(
            'input.txt',
            bucket,
            user + '/posts/' + str(postTitle) + '/' + str(postTitle) + '.txt',

            ExtraArgs={'Metadata': {'User': user}}
        )

        s3.upload_file(
            "input.mp4",
            bucket,
            user + '/posts/' + str(postTitle) + '/' + str(postTitle) + '.mp4',

            ExtraArgs={'Metadata': {'User': user}}
        )
        response = {
            'success': True,
            'text': "success",
        }

        return jsonify(response)
    else:
        response = {
            'success': False,
            'text': "false",
        }
        return jsonify(response)
    
def S3DownloaderImg(key, count):
    folder = key
    location = appPath + '/Navigation/FeedPageDiscovery/Posts/post' + str(
        count) + '.jpg'

    resp = s3.download_file(
        bucket,
        folder,
        location,
    )


@app.route('/SearchUsers', methods=['POST'])
def SearchUsers():

    data = request.get_json()
    userID = data.get('query')
    user = data.get('user')


    friends = dynamo.get_item(TableName='Users', Key={'userID': {'S': user}})
    friendList = friends['Item']['friends']['L']
    isFriend = False

    for i in friendList:
        if i['S'] == userID:
            isFriend = True



    table = dynamo_resource.Table('Users')

    try:
        resp = table.query(
            KeyConditionExpression=Key('userID').eq(userID),
        )
    except:
        response = {
            'success': False,
            'profile': None,
        }
        return jsonify(response)

    if resp['Items'] == []:
        response = {
            'success': False,
            'profile': None,
        }
        return jsonify(response)

    imgResp = s3.list_objects(
        Bucket=bucket,
        Prefix=userID + "/profile/",
        Marker=userID + "/profile/",
        MaxKeys=1,
    )

    imgResp = imgResp['Contents'][0]

    url = s3.generate_presigned_url('get_object',
                                    Params={'Bucket': bucket, 'Key': imgResp['Key']},
                                    ExpiresIn=3600)


    response = {
        'success': True,
        'profile': url,
        'friend': isFriend
    }

    return jsonify(response)








def S3DownloaderText(key, count):
    folder = key
    location = appPath + '/Navigation/FeedPageDiscovery/Posts/post' + str(
        count) + '.txt'

    resp = s3.download_file(
        bucket,
        folder,
        location,
    )


@app.route('/S3List', methods=['POST'])
def S3List():
    imgResp = s3.list_objects(
        Bucket=bucket,
        Prefix="posts/image",
        Marker='posts/image/',
        MaxKeys=10,
    )
    textResp = s3.list_objects(
        Bucket=bucket,
        Prefix="posts/text",
        Marker='posts/text/',
        MaxKeys=10,
    )

    count1 = 0
    count2 = 0
    feedResponse = []
    TextList = []
    imageList = []
    typeList = []
    for key in imgResp['Contents']:
        count1 += 1

        object = container.Object(key['Key'])
        response = object.get()
        url = s3.generate_presigned_url('get_object',
                                        Params={'Bucket': bucket, 'Key': key['Key']},
                                        ExpiresIn=3600)

        type = key["Key"]
        type = type[type.find('.') + 1:]
        # file_stream = response['Body']
        # img = Image.open(file_stream)

        # img = img.resize((200, 200))
        # img = base64.b64encode(np.array(img))
        # img = img.decode('utf-8')

        typeList.append(type)
        imageList.append(url)
        # S3DownloaderImg(key["Key"], count1)

    for key in textResp['Contents']:

        if key["Key"] == "posts/text/":
            continue
        count2 += 1

        object = container.Object(key['Key'])
        response = object.get()
        file_stream = response['Body']
        text = file_stream.read().decode('utf-8')
        feedResponse.append('post' + str(count2))
        TextList.append(text)
        # S3DownloaderText(key["Key"], count2)

    response = {'list': feedResponse,
                'text': TextList,
                'size': count1,
                'image': imageList,
                'type': typeList,
                }
    return jsonify(response)


@app.route('/S3ProfileList', methods=['POST'])
def S3ProfileList():
    data = request.get_json()
    user = data.get('user')

    total = []
    dirLen = len(str(user + "/posts/"))
    userResp = s3.list_objects(
        Bucket=bucket,
        Prefix=user + "/posts",
        Marker=user + "/posts/",
        MaxKeys=100,
    )
    count1 = 0
    feedResponse = []
    TextList = []
    imageList = []
    typeList = []

    timePost = []
    for key in userResp['Contents']:

        count1 += 1

        object = container.Object(key['Key'])

        index = key["Key"].find("/", dirLen)
        title = key["Key"][dirLen:index]

        time = key["LastModified"]
        time = time.strftime("%Y-%m-%d %H:%M:%S")

        absent = True
        if total == []:
            total.append([title, [], [], time])
        else:
            for k in total:
                if title == k[0]:
                    absent = False
                    break
            if absent:
                total.append([title, [], [], time])

        url = s3.generate_presigned_url('get_object',
                                        Params={'Bucket': bucket, 'Key': key['Key']},
                                        ExpiresIn=3600)

        type = key["Key"]
        type = type[type.find('.') + 1:]
        count2 = 0
        row = 0

        if type == 'jpg' or type == 'mp4':
            for k in total:

                if title == k[0]:
                    row = count2
                    break

                count2 += 1
            total[row][1].append(url)
            total[row][2].append(type)
        elif type == 'txt':

            for k in total:

                if title == k[0]:
                    row = count2
                    break

                count2 += 1

            response = object.get()
            file_stream = response['Body']
            text = file_stream.read().decode('utf-8')
            total[row].append(text)

    for i in range(len(total)):
        feedResponse.append(total[i][0])
        imageList.append(total[i][1][0])
        typeList.append(total[i][2][0])
        timePost.append(total[i][3])
        TextList.append(total[i][4])

    size = len(feedResponse)

    response = {'list': feedResponse,
                'text': TextList,
                'size': size,
                'image': imageList,
                'type': typeList,
                'time': timePost,
                }
    return jsonify(response)


@app.route('/S3FriendList', methods=['POST'])
def S3FriendList():
    data = request.get_json()
    user = data.get('user')

    friends = dynamo.get_item(TableName='Users', Key={'userID': {'S': user}})
    friendList = friends['Item']['friends']['L']
    total = []

    friendPost = []
    timePost = []

    for i in range(len(friendList)):

        friend = friendList[i]['S']
        dirLen = len(str(friend + "/posts/"))
        friendResp = s3.list_objects(
            Bucket=bucket,
            Prefix=friend + "/posts",
            Marker=friend + "/posts/",
            MaxKeys=10,
        )

        count1 = 0
        feedResponse = []
        TextList = []
        imageList = []
        typeList = []
        print(friendResp)

        try:
            friendResp['Contents']
        except:
            continue

        for key in friendResp['Contents']:

            count1 += 1

            object = container.Object(key['Key'])

            index = key["Key"].find("/", dirLen)
            title = key["Key"][dirLen:index]

            time = key["LastModified"]
            time = time.strftime("%m-%d-%Y %H:%M %p")

            absent = True
            if total == []:
                total.append([title, [], [], friend, time])
            else:
                for k in total:
                    if title == k[0]:
                        absent = False
                        break
                if absent:
                    total.append([title, [], [], friend, time])

            url = s3.generate_presigned_url('get_object',
                                            Params={'Bucket': bucket, 'Key': key['Key']},
                                            ExpiresIn=3600)

            type = key["Key"]
            type = type[type.find('.') + 1:]
            count2 = 0
            row = 0

            if type == 'jpg' or type == 'mp4':

                for k in total:
                    if title == k[0]:
                        row = count2
                        break

                    count2 += 1

                total[row][1].append(url)
                total[row][2].append(type)
            elif type == 'txt':

                for k in total:
                    if title == k[0]:
                        row = count2
                        break

                    count2 += 1

                response = object.get()
                file_stream = response['Body']
                text = file_stream.read().decode('utf-8')
                total[row].append(text)

    for i in range(len(total)):
        feedResponse.append(total[i][0])
        imageList.append(total[i][1][0])
        typeList.append(total[i][2])
        friendPost.append(total[i][3])
        timePost.append(total[i][4])
        TextList.append(total[i][5])

    size = len(feedResponse)

    response = {'list': feedResponse,
                'text': TextList,
                'size': size,
                'image': imageList,
                'type': typeList,
                'time': timePost,
                'friend': friendPost,
                }
    return jsonify(response)



# Running app
if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True , port=5000)

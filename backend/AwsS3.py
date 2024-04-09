import base64
import boto3
from flask import Flask, jsonify, request
from flask_cors import CORS
from PIL import Image
from io import BytesIO
import numpy as np
import urllib.parse
import cv2
import random
from boto3.dynamodb.conditions import Key, Attr


aws_mag_con = boto3.session.Session(profile_name="default")

app = Flask(__name__)

appPath = __file__
appPath = appPath[0:-16]

CORS(app)

bucket = 'kickmediabucket'
s3 = aws_mag_con.client('s3')
s3_resource = aws_mag_con.resource('s3')
container = s3_resource.Bucket(bucket)

dynamo = aws_mag_con.client('dynamodb')
dynamo_resource = aws_mag_con.resource('dynamodb')


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

    # user = data.get('user')
    user = "UltJMejia/"

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
            'posts/' + user + str(postTitle) + '/' + str(postTitle) + '.jpg',
            ExtraArgs={'Metadata': {'User': user}}
        )
        s3.upload_file(
            'input.txt',
            bucket,
            'posts/' + user + str(postTitle) + '/' + str(postTitle) + '.txt',

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
            'posts/' + user + str(postTitle) + '/' + str(postTitle) + '.txt',

            ExtraArgs={'Metadata': {'User': user}}
        )

        s3.upload_file(
            "input.mp4",
            bucket,
            'posts/' + user + str(postTitle) + '/' + str(postTitle) + '.mp4',

            ExtraArgs={'Metadata': {'User': user}}
        )
        response = {
            'success': True,
            'text': "success",
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

    #data = request.get_json()
    #userID = data.get('query')

    userID = "1"

    table = dynamo_resource.Table('Users')


    resp = table.query(
        KeyConditionExpression=Key('userID').eq(userID),

    )

    print(resp)


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
    # data = request.get_json()
    # user = data.get('user')
    user = "UltJMejia"

    total = []

    dirLen = len(str("posts/" + user + "/"))
    userResp = s3.list_objects(
        Bucket=bucket,
        Prefix="posts/" + user,
        Marker='posts/' + user + "/",
        MaxKeys=100,
    )
    count1 = 0
    feedResponse = []
    TextList = []
    imageList = []
    typeList = []
    for key in userResp['Contents']:

        count1 += 1

        object = container.Object(key['Key'])

        index = key["Key"].find("/", dirLen)
        title = key["Key"][dirLen:index]

        absent = True
        if total == []:
            total.append([title, [], []])
        else:
            for k in total:
                if title == k[0]:
                    absent = False
                    break
            if absent:
                total.append([title, [], []])

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
        TextList.append(total[i][3])

    size = len(feedResponse)

    response = {'list': feedResponse,
                'text': TextList,
                'size': size,
                'image': imageList,
                'type': typeList,
                }
    return jsonify(response)


@app.route('/S3FriendList', methods=['POST'])
def S3FriendList():
    # data = request.get_json()
    # user = data.get('user')

    user = "1"
    friends = dynamo.get_item(TableName='Users', Key={'userID': {'S': user}})
    friendList = friends['Item']['friends']['L']
    total = []

    for i in range(len(friendList)):

        friend = friendList[i]['S']
        dirLen = len(str("posts/" + friend + "/"))
        friendResp = s3.list_objects(
            Bucket=bucket,
            Prefix="posts/" + friend,
            Marker='posts/' + friend + "/",
            MaxKeys=10,
        )

        count1 = 0
        feedResponse = []
        TextList = []
        imageList = []
        typeList = []
        for key in friendResp['Contents']:

            count1 += 1

            object = container.Object(key['Key'])

            index = key["Key"].find("/", dirLen)
            title = key["Key"][dirLen:index]

            absent = True
            if total == []:
                total.append([title, [], []])
            else:
                for k in total:
                    if title == k[0]:
                        absent = False
                        break
                if absent:
                    total.append([title, [], []])

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
        TextList.append(total[i][3])

    size = len(feedResponse)

    response = {'list': feedResponse,
                'text': TextList,
                'size': size,
                'image': imageList,
                'type': typeList,
                }
    return jsonify(response)


SearchUsers()

#if __name__ == '__main__':
#    app.run(host='0.0.0.0')

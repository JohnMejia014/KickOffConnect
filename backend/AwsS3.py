import boto3
from flask import Flask, jsonify
from flask_cors import CORS

aws_mag_con = boto3.session.Session(profile_name="default")

app = Flask(__name__)

CORS(app)


@app.route('/S3Uploader', methods=['POST'])
def S3Uploader():
    s3 = aws_mag_con.client('s3')

    s3.upload_file(
        'C:/Users/marco/Downloads/nba.jpg',
        'kickmediabucket',
        'posts/image/nba.jpg',
    )


def S3DownloaderImg(key, count):
    s3 = aws_mag_con.client('s3')

    folder =  key
    location = 'C:/Users/marco/OneDrive/Documents/School/EE/EE464D/KickOffConnect/frontend/TestApp/app/Navigation/FeedPageDiscovery/Posts/post' + str(count) + '.jpg'

    resp = s3.download_file(
        'kickmediabucket',
        folder,
        location,
    )


def S3DownloaderText(key, count):
    s3 = aws_mag_con.client('s3')

    folder = key
    location = 'C:/Users/marco/OneDrive/Documents/School/EE/EE464D/KickOffConnect/frontend/TestApp/app/Navigation/FeedPageDiscovery/Posts/post' + str(count) + ".txt"

    resp = s3.download_file(
        'kickmediabucket',
        folder,
        location,
    )


@app.route('/S3List', methods=['POST'])
def S3List():
    s3 = aws_mag_con.client('s3')

    imgResp = s3.list_objects(
        Bucket='kickmediabucket',
        Prefix="posts/image/",
        MaxKeys=10,
    )
    textResp = s3.list_objects(
        Bucket='kickmediabucket',
        Prefix="posts/text/",
        MaxKeys=10,
    )



    count = 0
    feedResponse = []
    for key in imgResp['Contents']:

        count += 1
        S3DownloaderImg(key["Key"], count)
        S3DownloaderText(key["Key"], count)
        feedResponse.append('post' + str(count))

    response = {'list': feedResponse,
                'size': count
                }
    print(response)

    return jsonify(response)


if __name__ == '__main__':
    app.run(host='0.0.0.0')

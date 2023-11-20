from flask import Flask, render_template, request, jsonify, redirect
from pymongo import MongoClient
from flask_cors import CORS



app = Flask(__name__)

client = MongoClient('mongodb+srv://marcoflo02:Kickoff@cluster0.qgnjjxr.mongodb.net/?retryWrites=true&w=majority')
db = client['Users']
users_collection = db['Users']


CORS(app)

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
        return jsonify({'error': 'Missing userId, latitude, or longitude'}), 400

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
    userId = request.json['userId']
    password = request.json['password']
    email = request.json['email']

    userData = db[userId]
    userEmails = db['Emails']


    if userData.find_one({'userId': userId}):
        return jsonify({'error': 'Username already exists'})

    if userEmails.find_one({'userEmails': email}):
        return jsonify({'email': 'Email already associated with another account'})

    userEmails.update_one( {'ref': 40}, {'$push' : {'userEmails': email}}, upsert=True)

    post = {
        "userId": userId,
        "password": password,
        "email": email,
    }

    result = userData.insert_one(post)
    if result.inserted_id:
        return jsonify({'success': True,
                        'userId': userId})
    else:
        return {'success': False}


@app.route('/login', methods=['POST'])
def login():
    userId = request.json['userId']
    password = request.json['password']
    userData = db[userId]

    # find user in the database

    user = userData.find({'userId': userId})

    # check if user exists
    if not user:
        return jsonify({'error': 'User not found'})

    dbpass = None
    for document in user:
        dbpass = document["password"]

    # check if password is correct
    if not password == dbpass:
        return jsonify({'error': 'Incorrect password'})

    response = {'success': True,
                'userId': userId
                }
    return jsonify(response)

@app.route('/addEvent', methods=['POST'])
def addEvent():
    eventName = request.json['eventName']
    eventSport = request.json['eventSport']
    eventDescription = request.json['eventDescription']
    userHostingEvent = request.json['userName']
    eventVisibility = request.json['eventVisibility']
    userData = db[userId]

    # find user in the database

    user = userData.find({'userId': userId})

    # check if user exists
    if not user:
        return jsonify({'error': 'User not found'})

    dbpass = None
    for document in user:
        dbpass = document["password"]

    # check if password is correct
    if not password == dbpass:
        return jsonify({'error': 'Incorrect password'})

    response = {'success': True,
                'userId': userId
                }
    return jsonify(response)



# Running app
if __name__ == '__main__':
    app.run(host='0.0.0.0')
from flask import Flask, render_template, request, jsonify, redirect
from pymongo import MongoClient
from flask_cors import CORS
import os, sys

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
    if username and password and email:
        # Call the signup function from the Database class
        userSignup, user_info, _err = userHandler.signupUser({"username":username, "email":email, "password":password})
        if userSignup == False:
            return jsonify({'message': _err})
        else:
            user_info['_id'] = str(user_info['_id'])
            user_info.pop('password', None)
            return jsonify({'message': 'User successfully created', 'userInfo': user_info})
    else:
        return jsonify({'message': 'Invalid request'})


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
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
    username = data.get('username')
    eventName = data.get('eventName')
    eventDescription = data.get('eventDescription')
    eventAddress = data.get('eventAddress')
    eventLat = data.get('eventLat')
    eventLong = data.get('eventLong')
    eventTime = data.get('eventTime')
    eventDate = data.get('eventDate')
    eventSport = data.get('eventSport')
    eventHost = data.get('eventHost')
    eventVisibility = data.get('eventVisibility')
    usersInvited = data.get('usersInvited')
    
    if username and eventAddress and eventName and eventSport:
        addedEvent, _err = mapHandler.createEvent({"username": username, "eventName": eventName,"eventDescription": eventDescription, "eventAddress": eventAddress, "eventLat": eventLat, "eventLong": eventLong, "eventTime": eventTime, "eventDate": eventDate, "eventSport": eventSport, "eventHost": eventHost, "eventVisibility": eventVisibility, "usersInvited": usersInvited })
        if addedEvent:
            return jsonify({'message': 'Event successfully created'})
        else:
            return jsonify({'message': _err})
    else:
        return jsonify({'message': 'Invalid request'})


# Running app
if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=False, port=5000)  
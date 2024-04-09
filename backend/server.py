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


# Running app
if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=False, port=5000)

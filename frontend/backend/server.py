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
    username = request.json.get('username')
    password = request.json.get('password')
    email = request.json.get('email')

    # Check if userId, password, and email are present in the request
    if not username or not password or not email:
        return jsonify({'error': 'UserId, password, or email is missing'})

    userData = db.get_collection('Users')
    
    # Check if email already exists
    if userData.find_one({'email': email}):
        return jsonify({'error': 'Account with this Email already exists'})

    # Check if username already associated with another account
    if userData.find_one({'userID': username}):
        return jsonify({'error': 'Username already associated with another account'})

    # Update Users collection
    post = {
        "username": username,
        "password": password,
        "email": email,
    }

    result = userData.insert_one(post)

    if result.inserted_id:
        return jsonify({'success': True, 'username': username})
    else:
        return jsonify({'success': False})



@app.route('/login', methods=['POST'])
def login():
    email = request.json.get('email')  # Use .get() to avoid KeyError if 'email' is not in the request.json
    password = request.json.get('password')
    
    # Check if email and password are present in the request
    if not email or not password:
        return jsonify({'error': 'Email or Password is missing'})

    userData = db[email]

    # Find user in the database by email
    user = userData.find_one({'email': email})

    # Check if user exists
    if not user:
        return jsonify({'error': 'Email or Password is incorrect'})

    # Check if password is correct
    dbpass = user.get("password")  # Use .get() to avoid KeyError if 'password' is not in the user document
    if not password == dbpass:
        return jsonify({'error': 'Incorrect password'})

    response = {'success': True, 'email': email}
    return jsonify(response)


@app.route('/addEvent', methods=['POST'])
def addEvent():
    
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
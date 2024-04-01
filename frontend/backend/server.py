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
    data = request.get_json()
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    userId = data.get('userId')

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


@app.route('/update-settings', methods=['POST'])
def update_settings():
    data = request.get_json()
    userId = data.get('userId')
    userData = db[userId]
    userEmails = db['Emails']

    # Check if the user exists
    user = userData.find_one({'userId': userId})
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Update the user email
    new_email = data.get('newEmail')
    if new_email:
        # Check if the new email is already associated with another account
        if userEmails.find_one({'userEmails': new_email}):
            return jsonify({'error': 'Email already associated with another account'}), 400

        # Update the user's email
        userData.update_one({'userId': userId}, {'$set': {'email': new_email}})
        userEmails.update_one({'ref': 40}, {'$push': {'userEmails': new_email}}, upsert=True)

    # Update the user password
    new_password = data.get('newPassword')
    if new_password:
        userData.update_one({'userId': userId}, {'$set': {'password': new_password}})

    # Update other user settings
    new_settings = data.get('newSettings', {})
    userData.update_one({'userId': userId}, {'$set': new_settings})

    return jsonify({'message': 'User settings updated successfully'})


@app.route('/send-friend-request', methods=['POST'])
def send_friend_request():
    data = request.get_json()
    sender_id = data.get('senderId')
    receiver_id = data.get('receiverId')

    # Check if the sender and receiver are different users
    if sender_id == receiver_id:
        return jsonify({'error': 'You cannot send a friend request to yourself.'}), 400

    # Check if a friend request already exists
    existing_request = relationships_collection.find_one({
        '$or': [
            {'sender': sender_id, 'receiver': receiver_id, 'status': 'pending'},
            {'sender': receiver_id, 'receiver': sender_id, 'status': 'pending'}
        ]
    })
    if existing_request:
        return jsonify({'error': 'A friend request already exists between these users.'}), 400

    # Create a new friend request
    new_request = {
        'sender': sender_id,
        'receiver': receiver_id,
        'status': 'pending'
    }
    relationships_collection.insert_one(new_request)

    return jsonify({'message': 'Friend request sent successfully.'}), 200


@app.route('/respond-friend-request', methods=['POST'])
def respond_friend_request():
    data = request.get_json()
    sender_id = data.get('senderId')
    receiver_id = data.get('receiverId')
    action = data.get('action')  # 'accept' or 'reject'

    # Find the friend request
    friend_request = relationships_collection.find_one({
        'sender': sender_id,
        'receiver': receiver_id,
        'status': 'pending'
    })

    if not friend_request:
        return jsonify({'error': 'No pending friend request found.'}), 404

    if action == 'accept':
        # Update the friend request to 'accepted'
        relationships_collection.update_one(
            {'_id': friend_request['_id']},
            {'$set': {'status': 'accepted'}}
        )
        return jsonify({'message': 'Friend request accepted successfully.'}), 200
    elif action == 'reject':
        # Remove the friend request
        relationships_collection.delete_one({'_id': friend_request['_id']})
        return jsonify({'message': 'Friend request rejected.'}), 200
    else:
        return jsonify({'error': 'Invalid action.'}), 400


@app.route('/get-friends', methods=['GET'])
def get_friends():
    user_id = request.args.get('userId')

    # Find accepted friend requests where the user is either the sender or receiver
    friends = list(relationships_collection.find({
        '$or': [
            {'sender': user_id, 'status': 'accepted'},
            {'receiver': user_id, 'status': 'accepted'}
        ]
    }))

    # Extract the friend IDs
    friend_ids = []
    for friend in friends:
        friend_id = friend['sender'] if friend['receiver'] == user_id else friend['receiver']
        friend_ids.append(friend_id)

    return jsonify({'friends': friend_ids}), 200


# Running app
if __name__ == '__main__':
    app.run(host='192.168.1.14')



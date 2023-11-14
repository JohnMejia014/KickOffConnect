from flask import Flask, render_template, request, jsonify, redirect
from pymongo import MongoClient
from flask_cors import CORS



app = Flask(__name__)

client = MongoClient('mongodb+srv://marcoflo02:Kickoff@cluster0.qgnjjxr.mongodb.net/?retryWrites=true&w=majority')
db = client['Users']
users_collection = db['Users']


CORS(app)



@app.route('/signup', methods=['POST'])
def signup():
    userId = request.json['userId']
    password = request.json['password']


    if users_collection.find_one(userId):
        return jsonify({'error': 'User already exists'})


    post = {
        "userID": userId,
        "password": password,
    }
    result = users_collection.insert_one(post)
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




# Running app
if __name__ == '__main__':
    app.run(host='192.168.1.248')



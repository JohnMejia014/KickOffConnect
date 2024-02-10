import sys
import os

from flask import jsonify

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import bcrypt
import DBInit
import ast

class UserHandler:

    def __init__(self, debugMode : bool = True):
        self.__debugMode = debugMode
        self.__mongo = DBInit.InitializeGlobals(self.__debugMode)
        self.__mongo_url = self.__mongo.getMongoURI()  # Default MongoDB connection URL
        self.__database_name = self.__mongo.getDatabase_name()  # Replace with your desired database name

        # Initialize the MongoDB client
        self.__client = self.__mongo.getClient()

        # Create or access the database
        self.__db = self.__mongo.getDatabase()

        self.__users = self.__mongo.getUsers()

    def signupUser(self, criteria: dict):
        userAdded = False
        _err = "User already exists with that username or email"
        # Check if a user already exists with the provided username or email
        result = None
        if not self.findUser({"username": criteria['username']}, {}) or not self.findUser({'email': criteria['email']}, {}):
            # Hash the password before storing it
            password = criteria['password'].encode('utf-8')
            hashed_password = bcrypt.hashpw(password, bcrypt.gensalt())
            userAdded = True
            _err = None
            userDocument = {
                "username": criteria["username"],
                "password": hashed_password,
                "email": criteria['email'],
                "friends": [],  # Initialize with an empty list for friends
                "posts": {},  # Initialize with an empty dictionary for posts
                "eventsJoined": [],  # Initialize with an empty list for events joined
                "privacy": "public",  # Use provided privacy or set a default value
                "totalRatings": 0,  # Initialize with a default rating
                "totalRatingStars": 0  # Initialize with a default rating

            }
            result = self.__users.insert_one(userDocument)
        if userAdded:
            # Retrieve the user information after insertion
            user_info = userHandler.findUser({"username": username}, {})[0]
            return jsonify({'message': 'User successfully created', 'userInfo': user_info})


        return userAdded, None, _err



    def dropUser(self, userID : str):
        self.__users.delete_one( {"userID" : userID})

    def loginUser(self, login: dict):
        attemptedLogin = login['password'].encode('utf-8')
        validLogin: bool = False
        user_info: dict = {}  # Dictionary to store user information
        _err = "Incorrect username or password"
       # Check if the login information contains "userNameEmail"
        if "username" in login:
            username = login["username"]
            loginDicts = [{'username': username}, {'email': username}]
        else:
            return validLogin, user_info, _err  # "userNameEmail" not provided

        # Try both options for login
        for loginDict in loginDicts:
            retrievedDict, exists = self.findUser(loginDict, {'_id': 0})  # Exclude _id from projection
            if exists:
                retrievedPass = retrievedDict.get('password')
                if retrievedPass and bcrypt.checkpw(attemptedLogin, retrievedPass):
                    validLogin = True
                    user_info = retrievedDict  # Assign user information to the user_info dictionary
                    break  # Break out of the loop if login is valid
        return validLogin, user_info, _err


    def findUser(self, criteria : dict, fieldToReturn : dict):
        doesUserExist = False
        value = self.__users.find_one(criteria,fieldToReturn)
        if(value != None):
            doesUserExist = True
        return value, doesUserExist

    def editUser(self, criteria : dict, valuesToUpdate : dict):
        returnVal, doesUserExist = self.findUser(criteria,valuesToUpdate)
        if(doesUserExist == True):
            valuesToUpdate = { "$set": valuesToUpdate}
            self.__users.update_one(criteria, valuesToUpdate)
            returnVal, doesUserExist = self.findUser(criteria,None)
            return returnVal, doesUserExist
        else:
            return None, False


    
    def resetUserCollection(self):
        if(self.__debugMode == True):
            self.__users.delete_many({})
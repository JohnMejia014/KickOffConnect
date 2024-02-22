import sys
import os
import boto3
from boto3.dynamodb.conditions import Key, Attr


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

        #Initialize the DynamoDB client
        self.__dynamoDB_client = boto3.client('dynamodb', region_name= 'us-east-2')
        self.__dynamodb = boto3.resource('dynamodb')
        self.__table = self.__dynamodb.Table('Users')

    def signupUser(self, criteria: dict):
        _err = "User already exists with that username or email"
        usercheck = self.findUser(criteria['username'])
        emailcheck = self.findemail(criteria['email'])

        if usercheck[1] is False and emailcheck[1] is False:
            # Hash the password before storing it
            password = criteria['password']
            #hashed_password = bcrypt.hashpw(password, bcrypt.gensalt())

            userDocument = {
                "userID": {'S':criteria["username"]},
                "password": {'S':password},
                "email": {'S':criteria['email']},
                "friends": {'L':[]},
                #might have to use another database for posts
                #"posts": {},
                "eventsJoined": {'L':[]},
                "privacy": {'S':"public"},
                "totalRatings": {'N':'0'},
                "totalRatingStars": {'N':'0'}
            }

            # add user to the database
            result = self.__dynamoDB_client.put_item(TableName = 'Users', Item = userDocument)

            # Retrieve the user information after insertion
            #user_info = self.findUser({"username": criteria["username"]}, {})[0]
            response = self.__table.query(
                KeyConditionExpression=Key('userID').eq(criteria['username'])
            )
            print(response)
            # Return a tuple with userAdded set to True and user_info
            return True, response, None

        # Return a tuple with userAdded set to False and _err
        return False, None, _err



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


    def findUser(self, criteria : dict):
        doesUserExist = False
        value = self.__table.query(
            KeyConditionExpression=Key('userID').eq(criteria)
        )
        count = value.get('Count')
        if(count > 0):
            doesUserExist = True
        return value, doesUserExist

    def findemail(self, criteria : dict):
        doesUserExist = False
        value = self.__table.scan(
            FilterExpression=Attr('email').eq(criteria)
        )
        count = value.get('Count')
        if (count > 0):
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

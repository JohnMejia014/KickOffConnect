import sys
import os
import boto3
from boto3.dynamodb.conditions import Key, Attr
from boto3.dynamodb.types import TypeDeserializer


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
                "totalRatingStars": {'N':'0'},
                "eventsHosted": {'L':[]},
                "eventsInvited": {'L':[]},
                "profilePic" : {'S': ''},
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
        validLogin: bool = False
        user_info: dict = {}  # Dictionary to store user information
        _err = "Incorrect username, email, or password"

        # Check if the login information contains "userNameEmail"
        if "username" in login:
            username = login["username"]
            loginKeyConditions = [
                Key('userID').eq(username),  # Check by username
                Key('email').eq(username)     # Check by email
            ]
        else:
            return validLogin, user_info, _err  # "userNameEmail" not provided

        # Try both options for login
        for loginKeyCondition in loginKeyConditions:
        # Query DynamoDB to find the user by username or email
            response = self.__table.query(
                KeyConditionExpression=loginKeyCondition
            )

            if response.get('Items'):
                # User with the provided username or email exists
                retrievedDict = response['Items'][0]
                storedPassword = retrievedDict.get('password', '')  # Assuming 'password' is a string in DynamoDB

                # Check if the password is valid
                if storedPassword == login['password']:
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
    def setProfilePic(self, userID, url):
        try: 
            self.__table.update_item(
                Key={'userID': userID},
                UpdateExpression='SET profilePic = :profileUrl',
                ExpressionAttributeValues={
                    ':profileUrl': url,
                },
                ReturnValues='UPDATED_NEW'
            )
            return True, "Profile picture URL updated successfully."
        except Exception as e:
            # Handle any unexpected exceptions
            error_message = f"Error: {str(e)}"
            return False, error_message

    def sendFriendRequest(self, userID: str, friendID: str):
        try:
            # Check if the friendID exists in the database
            friend_response, friend_exists = self.findUser(friendID)
            if friend_exists:
                # Add the userID to the friend requests list of the potential friend (friendID)
                update_response = self.__table.update_item(
                    Key={'userID': friendID},
                    UpdateExpression='SET friendRequests = list_append(if_not_exists(friendRequests, :empty_list), :user_id)',
                    ExpressionAttributeValues={
                        ':user_id': [userID],
                        ':empty_list': []
                    },
                    ReturnValues='UPDATED_NEW'
                )
                if update_response.get('Attributes'):
                    # Friend request sent successfully
                    return True, None
                else:
                    # Error updating friend requests list
                    return False, "Error updating friend requests list"

            else:
                # Friend with friendID not found
                return False, "Error: Friend not found"
        except Exception as e:
            # Handle any unexpected exceptions
            error_message = f"Error: {str(e)}"
            return False, error_message
    def respondFriendRequest(self, userID: str, friendID: str, action: str):
        try:
            # Check if the friend request exists and is pending
            response = self.__table.query(
                KeyConditionExpression=Key('userID').eq(userID)
            )
            responsefriend = self.__table.query(
                KeyConditionExpression=Key('userID').eq(userID)
            )
            items = response['Items']
            if not items:
                return False, "No pending friend request found."
            user_item = response['Items'][0]            
            friend_item = responsefriend['Items'][0]

            friend_requests = user_item.get('friendRequests', [])
            friendList = user_item.get('friends', [])
            friend_friendList = friend_item.get('friends', [])
            print(friend_requests)
           
            # Assuming 'action' is either 'accept' or 'reject'
            if action == 'accept':
                # Remove friendID from friendRequests list
                 # Remove friendID from friend_requests list if it exists
                if friendID in friend_requests:
                    friend_requests.remove(friendID)
                    friendList.append(friendID)
                    friend_friendList.append(userID)
                else:
                    return False, "Friend ID not found in friendRequests list."

                # Update the user item with the modified friendRequests list
                self.__table.update_item(
                    Key={'userID': userID},
                    UpdateExpression='SET friendRequests = :friend_requests',
                    ExpressionAttributeValues={':friend_requests': friend_requests},
                    ReturnValues='UPDATED_NEW'
                )
                print(1)
                # Add friendID to the friends list of userID
                self.__table.update_item(
                    Key={'userID': userID},
                    UpdateExpression='SET friends = :friendList',
                    ExpressionAttributeValues={':friendList': friendList},
                    ReturnValues='UPDATED_NEW'
                )
                print(2)
                # Add userID to the friends list of friendID
                self.__table.update_item(
                    Key={'userID': friendID},
                    UpdateExpression='SET friends = :friend_friendList',
                    ExpressionAttributeValues={':friend_friendList': friend_friendList},
                    ReturnValues='UPDATED_NEW'
                )
                print(3)
                
                return True, "Friend request accepted successfully."
            
            elif action == 'reject':
                # Remove the friend request
                friend_requests.remove(friendID)

                self.__table.update_item(
                    Key={'userID': userID},
                    UpdateExpression='SET friendRequests = :friend_requests',
                    ExpressionAttributeValues={':friend_requests': friend_requests},
                    ReturnValues='UPDATED_NEW'
                )
                print(4)
                return True, "Friend request rejected."
            
            else:
                return False, "Invalid action."

        except Exception as e:
            return False, f"Error: {str(e)}"


    def getFriends(self, userID: str):
        try:
            # Query DynamoDB to get the list of friend IDs associated with the user
            response = self.__table.query(
                KeyConditionExpression=Key('userID').eq(userID)
            )

            friends_list = []
            deserializer = TypeDeserializer()
            
           # print("response: ", response)
            if response.get('Items'):
                # User with the provided userID exists
                retrieved_user = response['Items'][0]
               # print("retrieved user: ", retrieved_user)
                friends_ids =retrieved_user['friends']
                #print("friendsid: ", friends_ids)
                # Fetch information for each friend ID
                for friend_id in friends_ids:
                    friend_info_response = self.__table.query(
                        KeyConditionExpression=Key('userID').eq(friend_id)
                    )

                    if friend_info_response.get('Items'):
                        # Friend information found
                        friend_info = friend_info_response['Items'][0]
                        friends_list.append(friend_info)
                    else:
                        # Friend information not found, handle the error
                        return None, "Error: Friend information not found."

            else:
                # User not found, handle the error
                return None, "Error: User not found."

            return friends_list, None  # Return friends list and no error

        except Exception as e:
            # Handle any unexpected exceptions
            error_message = f"Error: {str(e)}"
            return None, error_message


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
    def get_user_info(self, userID: str):
        """
        Fetch user information based on userID.
        """
        # Assume that you have a DynamoDB table named 'Users' and 'userID' is the primary key
        response = self.__table.query(
            KeyConditionExpression=Key('userID').eq(userID)
        )

        if response.get('Items'):
            # User with the provided userID exists
            retrieved_user = response['Items'][0]
            return retrieved_user
        else:
            # User not found
            return None
    def resetUserCollection(self):
        if(self.__debugMode == True):
            self.__users.delete_many({})

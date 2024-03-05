from flask import Flask, render_template, request, jsonify, redirect
from pymongo import MongoClient
from flask_cors import CORS
import sys
import os
from decimal import Decimal
from boto3.dynamodb.conditions import Key, Attr
import UserHandler 
import MapHandler 
from datetime import datetime
from functools import reduce

userHandler = UserHandler.UserHandler()
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import bcrypt
from math import cos, radians

import backend.DBInit as DBInit
import ast
import boto3

client = MongoClient('mongodb+srv://marcoflo02:Kickoff@cluster0.qgnjjxr.mongodb.net/?retryWrites=true&w=majority')
db = client['Users']
users_collection = db['Users']

class MapHandler:
    def __init__(self, debugMode : bool = True):
        #Initialize the DynamoDB client
        self.__dynamoDB_client = boto3.client('dynamodb', region_name= 'us-east-2')
        self.__dynamodb = boto3.resource('dynamodb')
        self.__table = self.__dynamodb.Table('EventsN')
        self.__tableUsers = self.__dynamodb.Table('Users')
    
    
    def get_events_within_radius(self, user_lat, user_long, radius_meters, filters):
        _err = None
        print("filters: ", filters)
        events_within_radius = {}  # Change to a dictionary
        print("Getting Event within Radius")
        try:
            user_lat_decimal = Decimal(str(user_lat))
            user_long_decimal = Decimal(str(user_long))

            # Start building the filter expression based on latitude and longitude
            filter_expression = (
                Attr("eventLat").between(
                    user_lat_decimal - Decimal(str(radius_meters / 111.32)),
                    user_lat_decimal + Decimal(str(radius_meters / 111.32))
                ) &
                Attr("eventLong").between(
                    user_long_decimal - Decimal(str(radius_meters / (111.32 * cos(radians(user_lat))))),
                    user_long_decimal + Decimal(str(radius_meters / (111.32 * cos(radians(user_lat)))))
                )
            )

            # Check if sports are selected in filters
            if filters and 'selectedSports' in filters and filters['selectedSports']:
                print("Checking Sports Filter")
                selected_sports_conditions = []
                for sport in filters['selectedSports']:
                    selected_sports_conditions.append(Attr("eventSports").contains(sport))
                # Combine conditions using OR operator
                filter_expression &= reduce(lambda x, y: x | y, selected_sports_conditions)
                 # Check date range in filters
            if filters and 'selectedStartDate' in filters and 'selectedEndDate' in filters:
                print('Checking Date filters')
                start_date = filters['selectedStartDate']
                end_date = filters['selectedEndDate']
                filter_expression &= Attr("eventDate").between(start_date, end_date)

            # # Check visibility in filters
            # if filters and 'selectedVisibility' in filters:
            #     visibility = filters['selectedVisibility']
            #     if visibility == 'public':
            #         # Only public events
            #         filter_expression &= Attr("eventVisibility").eq('public')
            #     elif visibility == 'private':
            #         # Only private events where the user is invited
            #         filter_expression &= Attr("eventVisibility").eq('private') & Attr("usersInvited").contains("username")
            #     elif visibility == 'both':
            #         # Both public and private events
            #         filter_expression &= (Attr("eventVisibility").eq('public') | (Attr("eventVisibility").eq('private') & Attr("usersInvited").contains("username")))

            # Use the DynamoDB Table resource with the constructed filter expression
            events = self.__table.scan(FilterExpression=filter_expression)['Items']
        
            # Group events by address
            for event in events:
                event_address = event['eventAddress']
                if event_address not in events_within_radius:
                    events_within_radius[event_address] = []
                events_within_radius[event_address].append(event)
            print("Finish grouping events by addresses")

        except Exception as e:
            print(f"Error fetching events within radius: {e}")
            _err = str(e)

        return events_within_radius, _err
    


    def convert_to_decimal(self, value):
        if isinstance(value, float):
            return Decimal(str(value))
        return value
    def createEvent(self, criteria: dict):
        eventAdded = False
        _err = "Event was not created"
        eventDocument = {
            "eventID": criteria["eventID"],
            "eventName": criteria["eventName"],
            "eventDescription": criteria["eventDescription"],
            "eventTime": criteria['eventTime'],
            "eventDate": criteria["eventDate"],
            "eventAddress": criteria["eventAddress"],
            "eventLat": self.convert_to_decimal(criteria["eventLat"]),
            "eventLong": self.convert_to_decimal(criteria["eventLong"]),
            "eventSports": criteria['eventSports'],
            "eventHost": criteria["eventHost"],
            "eventVisibility": criteria["eventVisibility"],
            "usersInvited": criteria["usersInvited"],
            "usersJoined": criteria["usersJoined"]
        }
        
        try:
            # Use put_item to add the item to DynamoDB table
            self.__table.put_item(Item=eventDocument)
            eventAdded = True
            _err = None

            # Retrieve the user information
            user_info, does_user_exist = userHandler.findUser(criteria["eventHost"])
            print(does_user_exist)
            print(user_info)
            if does_user_exist:
                # Extract user data from the response
                user_data = user_info['Items'][0]

                # Update the user's eventsHosted attribute with the new eventID
                user_data['eventsHosted'].append(criteria["eventID"])

                # Update the user's information in the DynamoDB table
                self.__tableUsers.put_item(Item=user_data)
            else:
                _err = "User does not exist"
        except Exception as e:
            print(f"Error adding event to DynamoDB: {e}")

        return eventAdded, _err

    def findUser(self, criteria: dict):
        # Call the findUser method from UserHandler
        return self.user_handler.findUser(criteria)
    

    def leaveEvent(self, userID, eventID):
        try:
            # Retrieve the event information
            event_info = self.__table.get_item(Key={'eventID': eventID}).get('Item')

            if not event_info:
                return False, 'Event not found'

            # Check if the user is in the list of participants
            if userID not in event_info['usersJoined']:
                return False, 'User not joined the event'

            # Remove the user from the list of participants
            event_info['usersJoined'].remove(userID)

            # Update the event information in the DynamoDB table
            self.__table.put_item(Item=event_info)

            return True, event_info, None
        except Exception as e:
            print(f"Error leaving event: {e}")
            return False, 'Internal server error'

    def joinEvent(self, userID, eventID):
    
    
        try:
            # Use get_item to retrieve the event information based on eventID
            response = self.__table.get_item(Key={'eventID': eventID})
            print("response: ", response)
            # Check if the item was found
            event_info = response.get('Item')
            if not event_info:
                return False, 'Event not found'

            print("Appending user to event")
            # Add the user to the list of participants
            event_info['usersJoined'].append(userID)
            print("Appended user to event")

            print("event_infr updated: ", event_info['usersJoined'])
            # Update the event information in the DynamoDB table
            self.__table.put_item(Item=event_info)

            return True, event_info, None
        except Exception as e:
            print(f"Error joining event: {e}")
            return False, 'Internal server error'

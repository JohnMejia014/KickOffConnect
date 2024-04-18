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
from math import radians, sin, cos, sqrt, atan2
from datetime import datetime, timedelta

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
    
    
    def get_events_within_radius(self, user_lat, user_long, radius_meters, filters, places):
        _err = None
        events_within_radius = {}  # Dictionary to hold events and places by address
        events_without_places = {}  # Dictionary to hold events without associated places


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
                selected_sports_conditions = []
                for sport in filters['selectedSports']:
                    selected_sports_conditions.append(Attr("eventSports").contains(sport))
                # Combine conditions using OR operator
                filter_expression &= reduce(lambda x, y: x | y, selected_sports_conditions)

            # Check date range in filters
            if filters and 'selectedStartDate' in filters and 'selectedEndDate' in filters:
                start_date = filters['selectedStartDate']
                end_date = filters['selectedEndDate']
                filter_expression &= Attr("eventDate").between(start_date, end_date)

            # Use the DynamoDB Table resource with the constructed filter expression
            events = self.__table.scan(FilterExpression=filter_expression)['Items']

            # Group places by address
            for place in places:
                place_address = place['vicinity']
                if place_address not in events_within_radius:
                    events_within_radius[place_address] = {'events': [], 'places': [place]}
                else:
                    events_within_radius[place_address]['places'].append(place)

            # Iterate through events and check if they belong to a place
            # Iterate through events and check if they belong to a place
            for event in events:
                event_address = event['eventAddress']
                event_lat_decimal = Decimal(str(event['eventLat']))
                event_long_decimal = Decimal(str(event['eventLong']))

                # Check if event is close to any place
                event_added_to_place = False
                for place_address, place_data in events_within_radius.items():
                    if place_data['places']:
                        place_lat_decimal = Decimal(str(place_data['places'][0]['geometry']['location']['lat']))
                        place_long_decimal = Decimal(str(place_data['places'][0]['geometry']['location']['lng']))
                        distance_to_place = self.calculate_distance(
                            event_lat_decimal, event_long_decimal, place_lat_decimal, place_long_decimal
                        )
                        if distance_to_place <= 50:
                            place_data['events'].append(event)
                            event_added_to_place = True
                            break

                if not event_added_to_place:
                    # Event does not belong to any nearby place, check if it's close to other events in the dictionary
                    event_added_to_event = False
                    for address, data in events_without_places.items():
                        for existing_event in data['events']:
                            existing_event_lat_decimal = Decimal(str(existing_event['eventLat']))
                            existing_event_long_decimal = Decimal(str(existing_event['eventLong']))
                            distance_to_existing_event = self.calculate_distance(
                                event_lat_decimal, event_long_decimal,
                                existing_event_lat_decimal, existing_event_long_decimal
                            )
                            if distance_to_existing_event <= 50:
                                data['events'].append(event)
                                event_added_to_event = True
                                break
                        if event_added_to_event:
                            break

                    if not event_added_to_event:
                        # Event is not close to any nearby events or places, add it to events_without_places
                        events_without_places[event_address] = {'events': [event], 'places': []}

            events_within_radius.update(events_without_places)

        except Exception as e:
            _err = str(e)

        return events_within_radius, _err


    def calculate_distance(self, lat1, lon1, lat2, lon2):
        # Convert latitude and longitude from degrees to radians
        lat1_rad, lon1_rad = radians(lat1), radians(lon1)
        lat2_rad, lon2_rad = radians(lat2), radians(lon2)

        # Haversine formula
        dlat = lat2_rad - lat1_rad
        dlon = lon2_rad - lon1_rad
        a = sin(dlat / 2) ** 2 + cos(lat1_rad) * cos(lat2_rad) * sin(dlon / 2) ** 2
        c = 2 * atan2(sqrt(a), sqrt(1 - a))

        # Radius of the Earth in meters (approximately)
        earth_radius = 6371000

        # Calculate the distance
        distance = earth_radius * c
        return distance

    


    def convert_to_decimal(self, value):
        if isinstance(value, float):
            return Decimal(str(value))
        return value
    def delete_past_events(self):
        try:
            # Get the current date and time
            current_datetime = datetime.now()

            # Calculate the date threshold for past events (e.g., events older than 2 days)
            date_threshold = current_datetime - timedelta(days=2)  # Changed to 2 days threshold

            # Define a filter expression to retrieve events older than the threshold
            filter_expression = Attr("eventDate").lt(date_threshold.isoformat())

            # Use scan operation to retrieve events that match the filter
            events_to_delete = self.__table.scan(FilterExpression=filter_expression)['Items']

             # Iterate through the events to delete
            for event in events_to_delete:
                event_id = event['eventID']

                # Remove the event ID from the eventHost user's eventsHosted ID list
                self.__table.update_item(
                    Key={'userID': event['eventHost']},
                    UpdateExpression='DELETE eventsHosted :event_id',
                    ExpressionAttributeValues={':event_id': {event_id}}
                )

                # Iterate through the usersJoined list and remove the event ID from their eventsJoined ID list
                for user_id in event['usersJoined']:
                    self.__table.update_item(
                        Key={'userID': user_id},
                        UpdateExpression='DELETE eventsJoined :event_id',
                        ExpressionAttributeValues={':event_id': {event_id}}
                    )

                # Delete the event from the events table
                self.__table.delete_item(Key={'eventID': event_id})
            return True, None  # Success message

        except Exception as e:
            return False, str(e)  # Error message
    def createEvent(self, criteria: dict):
        self.delete_past_events()
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
             # Update eventsInvited for each user in selectedFriends
           # Iterate through each user in usersInvited
            for user_id in criteria["usersInvited"]:
                # Retrieve the user information
                user_info, does_user_exist = userHandler.findUser(user_id)
                print(does_user_exist)
                print(user_info)
                if does_user_exist:
                    # Extract user data from the response
                    user_data = user_info['Items'][0]

                    # Update the user's eventsInvited attribute with the new eventID
                    user_data['eventsInvited'].append(criteria["eventID"])

                    # Update the user's information in the DynamoDB table
                    self.__tableUsers.put_item(Item=user_data)
                else:
                    _err = f"User {user_id} does not exist"
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
            print("eventInfo: ", event_info)
            if not event_info:
                return False, None,  'Event not found'

            # Check if the user is in the list of participants
            if userID not in event_info['usersJoined']:
                return False, None, 'User not joined the event'

            # Remove the user from the list of participants
            event_info['usersJoined'].remove(userID)
            print("eventInfo after removing user: ", event_info)

            # Update the event information in the DynamoDB table
            self.__table.put_item(Item=event_info)

            # Remove the eventID from eventsJoined of the user
            user_info = self.__tableUsers.get_item(Key={'userID': userID}).get('Item')
            print("user info: ", user_info)
            user_info['eventsJoined'].remove(eventID)
            self.__tableUsers.put_item(Item=user_info)
            print("user info after deleting eventID: ", user_info)
            self.__tableUsers.put_item(Item=user_info)

            return True, event_info, None
        except Exception as e:
            print(f"Error leaving event: {e}")
            return False, None, 'Internal server error'


    def joinEvent(self, userID, eventID):
        try:
            # Use get_item to retrieve the event information based on eventID
            response = self.__table.get_item(Key={'eventID': eventID})
            print("response: ", response)
            # Check if the item was found
            event_info = response.get('Item')
            if not event_info:
                return False, 'Event not found'

            # Add the user to the list of participants
            event_info['usersJoined'].append(userID)

            # Update the event information in the DynamoDB table
            self.__table.put_item(Item=event_info)

            # Update eventsJoined list in user database for the user with eventID
            user_info = self.__tableUsers.query(KeyConditionExpression=Key('userID').eq(userID)).get('Items')[0]
            events_joined = user_info.get('eventsJoined', [])
            events_joined.append(eventID)  # Append only the event ID
            self.__tableUsers.update_item(
                Key={'userID': userID},
                UpdateExpression='SET eventsJoined = :val',
                ExpressionAttributeValues={':val': events_joined}
            )
            return True, event_info, None
        except Exception as e:
            print(f"Error joining event: {e}")
            return False, 'Internal server error'
    def inviteFriends(self, selectedFriends, eventID):
        try:

            # Fetch the event document from DynamoDB
            event = self.__table.get_item(Key={'eventID': eventID}).get('Item')
            print("event: ", event)
            if not event:
                return False, f"Event with ID {eventID} not found"
            
            # Update the usersInvited list with selectedFriends
            event['usersInvited'] = selectedFriends

            # Update the event document in DynamoDB
            self.__table.put_item(Item=event)

            # Update eventsInvited for each user in selectedFriends
            for user_id in selectedFriends:
                user = self.__tableUsers.get_item(Key={'userID': user_id}).get('Item')
                if user:
                    user['eventsInvited'].append(eventID)
                    self.__tableUsers.put_item(Item=user)
            print("Inviting friends is succesfull")
            return True, None  # Invitation successful

        except Exception as e:
            print("Inviting friends is not succesfull", str(e))

            return False, str(e)  # Return error message if any exception occurs

    def getEventsList(self, eventIDs):
        try:
            # Convert eventIDs to a list if it's not already
            if not isinstance(eventIDs, list):
                eventIDs = [eventIDs]

            # Initialize an empty.txt list to store retrieved events
            events = []

            # Iterate through each event ID and retrieve the corresponding event from MongoDB
            for eventID in eventIDs:
                event = self.__table.get_item(Key={'eventID': eventID}).get('Item')
                if event:
                    events.append(event)
            print("Maphandler eventIDs", eventIDs)
            print("MapHandler events: ", events)
            return events, None  # Return retrieved events and no error
        except Exception as e:
            print(f"Error retrieving events: {e}")
            return None, 'Internal server error'

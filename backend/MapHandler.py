from flask import Flask, render_template, request, jsonify, redirect
from pymongo import MongoClient
from flask_cors import CORS
import sys
import os
from decimal import Decimal

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import bcrypt
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
        self.__table = self.__dynamodb.Table('Events')

    def convert_to_decimal(self, value):
        if isinstance(value, float):
            return Decimal(str(value))
        return value
    def createEvent(self, criteria: dict):
        eventAdded = False
        _err = "Event was not created"
        eventDocument = {
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
        except Exception as e:
            print(f"Error adding event to DynamoDB: {e}")

        return eventAdded, _err
    


    def get_events_within_radius(self, user_lat, user_long, radius_meters=10000):
        _err = None
        # Define the query for geospatial search
        query = {
            "location": {
                "$near": {
                    "$geometry": {
                        "type": "Point",
                        "coordinates": [user_long, user_lat]  # [longitude, latitude]
                    },
                    "$maxDistance": radius_meters
                }
            }
        }
        # Execute the query and retrieve events within the specified radius
        events_within_radius = list(self.__Events.find(query))
        if not events_within_radius:
            _err = "No events found within user location."
        return events_within_radius, _err

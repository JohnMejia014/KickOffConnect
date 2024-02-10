from flask import Flask, render_template, request, jsonify, redirect
from pymongo import MongoClient
from flask_cors import CORS
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import bcrypt
import backend.DBInit as DBInit
import ast


client = MongoClient('mongodb+srv://marcoflo02:Kickoff@cluster0.qgnjjxr.mongodb.net/?retryWrites=true&w=majority')
db = client['Users']
users_collection = db['Users']

class MapHandler:
    def __init__(self, debugMode : bool = True):
            self.__debugMode = False
            self.__mongo = DBInit.InitializeGlobals(self.__debugMode)
            self.__mongo_url = self.__mongo.getMongoURI()  # Default MongoDB connection URL
            self.__database_name = self.__mongo.getDatabase_name  # Replace with your desired database name

            # Initialize the MongoDB client
            self.__client = self.__mongo.getClient()

            # Create or access the database
            self.__db = self.__mongo.getDatabase()
            self.__Events = self.__mongo.getEvents()
            self.create_geospatial_index()

    def create_geospatial_index(self):
        # Check if the index already exists
        existing_indexes = self.__Events.index_information()
        index_name = "event_location_2dsphere"

        if index_name not in existing_indexes:
            # Create a 2dsphere index on eventLat and eventLong fields
            self.__Events.create_index([("eventLat", "2dsphere"), ("eventLong", "2dsphere")], name=index_name)
    
    def createEvent(self, criteria : dict):
        eventAdded = False
        _err = "Event was not created"
        eventDocument = {
            "eventName": criteria["projectName"],
            "eventDescription": criteria["projectDescription"],
            "eventTime" : criteria['eventTime'],
            "eventDate" : criteria["eventDate"],
            "eventAddress" : criteria["eventAddress"],
            "eventLat": criteria["eventLat"],
            "eventLong": criteria["eventLong"],
            "eventSport" : criteria['eventSport'],
            "eventHostUsername" : criteria["eventHostUsername"],
            "eventVisibility" : criteria["eventAddress"],
            "usersInvited": criteria["usersInvited"],
            "usersJoined": criteria["usersJoined"]
            }
        self.__Events.insert_one(eventDocument)
        eventAdded = True
        _err = None
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

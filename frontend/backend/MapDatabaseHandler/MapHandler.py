from flask import Flask, render_template, request, jsonify, redirect
from pymongo import MongoClient
from flask_cors import CORS
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import bcrypt
import DBInit
import ast


client = MongoClient('mongodb+srv://marcoflo02:Kickoff@cluster0.qgnjjxr.mongodb.net/?retryWrites=true&w=majority')
db = client['Users']
users_collection = db['Users']

class MapHandler:
    def __init__(self):
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
        
        
    def add_event(self, event_data):
        result = self.__events_collection.insert_one(event_data)
        return result.inserted_id
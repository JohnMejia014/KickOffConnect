from flask import Flask, render_template, request, jsonify, redirect
from pymongo import MongoClient
from flask_cors import CORS



client = MongoClient('mongodb+srv://marcoflo02:Kickoff@cluster0.qgnjjxr.mongodb.net/?retryWrites=true&w=majority')
db = client['Users']
users_collection = db['Users']

class MapHandler:
    def __init__(self):
        self.__client = MongoClient('mongodb+srv://marcoflo02:Kickoff@cluster0.qgnjjxr.mongodb.net/?retryWrites=true&w=majority')
        self.__db = self.__client['EventsDB']
        self.__events_collection = self.__db['EventsCollection']
        
    def add_event(self, event_data):
        result = self.__events_collection.insert_one(event_data)
        return result.inserted_id
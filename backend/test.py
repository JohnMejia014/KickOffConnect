from flask import Flask, render_template, request, jsonify, redirect
from pymongo import MongoClient
from flask_cors import CORS

client = MongoClient('mongodb+srv://marcoflo02:Kickoff@cluster0.qgnjjxr.mongodb.net/?retryWrites=true&w=majority')
db = client['users']
users_collection = db['users']



def query():
    db = client["Users"]
    collection_name = db["Marco"]

    item_1 = {
        "userId" : "Marco",
        "password" : "Kickoff"
    }
    collection_name.insert_one(item_1)
    client.close()

def query2():

    db = client["Users"]
    collection_name = db["John Mejia"]

    items = collection_name.find({'userId': "John Mejia"})

    availability = None
    for document in items:
        # print("Availability in " +  document["Description"] + " is " + str(document["Availability"]))
        availability = document["password"]
        print(document["password"])

    return availability

query2()
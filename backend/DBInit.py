import pymongo
import json

class InitializeGlobals:

    def __init__(self, debugMode : bool):
        # db_credsfile = open('Database\DB_creds.json', 'r')
        # db_creds = json.load(db_credsfile)
        # db_credsfile.close()
        self.__database_name = "KickOffConnectDB"
        self.__mongoDBuri = 'mongodb+srv://marcoflo02:Kickoff@cluster0.qgnjjxr.mongodb.net/?retryWrites=true&w=majority'
        if(debugMode == True):
            self.__database_name = "KickOffConnecTestDB"
            self.__mongoDBuri = "mongodb+srv://numpy_ninja:ninja461L@numpyninjastestdb.jg4w9p9.mongodb.net/"


        self.__client = pymongo.MongoClient(self.__mongoDBuri)


        self.__db = self.__client[self.__database_name]
        self.__Users = self.__db.Users
        self.__Events = self.__db.Events
    
    def getDatabase_name(self):
        return self.__database_name
    
    def getMongoURI(self):
        return self.__mongoDBuri
    
    def getClient(self):
        return self.__client
    
    def getDatabase(self):
        return self.__db
    
    def getUsers(self):
        return self.__Users
    
    def getEvents(self):
        return self.__Events
    

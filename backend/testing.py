import unittest
import json
import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from backend.MapHandler import MapHandler

# Your other imports and setup code

class TestApp(unittest.TestCase):

    def setUp(self):
        # Create an instance of MapHandler
        self.map_handler = MapHandler()

    def test_add_event(self):
        print("TestAddEvent: ")

        # Separate event data into individual variables
        event_id = "1234"
        event_name = "Test Event"
        event_description = "This is a test event"
        event_address = "Test Address"
        event_lat = 10.0
        event_long = 20.0
        event_time = {"start": '10:00 AM', "end": '12:00 PM'}
        event_date = "2024-03-30"
        event_sports = ["Soccer"]
        event_host = "1"
        event_visibility = "public"
        users_invited = []
        users_joined = ["1"]

        # Call createEvent directly with individual variables
        added_event, error_message = self.map_handler.createEvent({
            "eventID": event_id,
            "eventName": event_name,
            "eventDescription": event_description,
            "eventAddress": event_address,
            "eventLat": event_lat,
            "eventLong": event_long,
            "eventTime": event_time,
            "eventDate": event_date,
            "eventSports": event_sports,
            "eventHost": event_host,
            "eventVisibility": event_visibility,
            "usersInvited": users_invited,
            "usersJoined": users_joined
        })

        # Check the result
        if added_event:
            self.assertEqual(added_event, True)
            self.assertIsNone(error_message)
        else:
            self.fail(f"Error adding event: {error_message}")

    def test_join_event(self):
        print("TestJoinEvent: ")

        # Prepare data for joining an event
        user_id = "user123"
        event_id = "1234"

        # Simulate the HTTP request to joinEvent endpoint
        success, updated_event, error = self.map_handler.joinEvent(user_id, event_id)

        # Check if the joinEvent method was successful
        self.assertTrue(success)
        self.assertIsNotNone(updated_event)
        self.assertIsNone(error)

        # If you also want to check the updated_event content, you can add additional assertions
        self.assertIn(event_id, updated_event['eventID'])
        self.assertIn(user_id, updated_event['usersJoined'])


    def test_leave_event(self):
        print("TestLeaveEvent: ")

        # Prepare data for leaving an event
        user_id = "user123"
        event_id = "1234"

        # Simulate the leaveEvent method directly
        success, updated_event, error = self.map_handler.leaveEvent(user_id, event_id)

        # Check if the leaveEvent method was successful
        self.assertTrue(success)
        self.assertIsNotNone(updated_event)
        self.assertIsNone(error)

        # Additional checks if required
        self.assertIn(updated_event['eventID'], event_id)
        self.assertNotIn(updated_event['usersJoined'], [user_id])
    def test_get_events(self):
        print("TestGetEvents: ")

        # Prepare data for getting events
        latitude = 10.0
        longitude = 20.0
        filters = {}  # Add any filters if required
        places = []   # Add any places if required

        # Simulate the HTTP request to getEvents endpoint
        events, error = self.map_handler.get_events_within_radius(latitude, longitude, 1000, filters, places)

        self.assertTrue(events)
        self.assertEqual(error, None)
if __name__ == '__main__':
    print("Starting test")
    unittest.main()

// CreateEvent.js
import React, { useState } from 'react';
import { View } from 'react-native';
import ChooseLocation from './ChooseLocation';
import AddEventComponent from './AddEventComponent';
import ShareEventComponent from './ShareEventComponent';

const CreateEvent = ({ userInfo, isVisible, onClose, onSubmit, tabBarHeight, initialEventData, longitude, latitude }) => {
  const [currentStep, setCurrentStep] = useState(1);
  console.log("userInfo: " + userInfo);
    const [eventData, setEventData] = useState({
    eventCoordinates: null,
    eventLat: latitude,
    eventLong: longitude,
    eventAddress: '',
    eventName: '',
    eventDescription: '',
    eventTime: {start: '', end: ''},  // example
    eventDate: '',  // example
    eventSports: [],  // example
    eventHost: '',  // example
    eventVisibility: '',  // example
    usersInvited: [],  // example
    usersJoined: '',  // example
  });

  const handleLocationSelection = (selectedCoordinates) => {
    setEventData((prevEventData) => ({
      ...prevEventData,
      eventCoordinates: selectedCoordinates,
      eventLat: selectedCoordinates.eventLat,
      eventLong: selectedCoordinates.eventLong,
      eventAddress: selectedCoordinates.eventAddress,
    }));

    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleAddEventSubmit = (eventDetails) => {
    setEventData((prevEventData) => ({
      ...prevEventData,
      eventName: eventDetails.eventName,
      eventDescription: eventDetails.eventDescription,
      eventSports: eventDetails.eventSports,
      eventDate: eventDetails.eventDate,
      eventTime: { ...eventDetails.eventTime },
    }));

    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleBackToEventForm = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  const handleShareEvent = () => {
    ;
  };

  return (
    <View>
      {currentStep === 1 && (
        <ChooseLocation
          isVisible={isVisible}
          onClose={handleBackToEventForm}
          onSelectLocation={handleLocationSelection}
          longitude={eventData.eventLong}
          latitude={eventData.eventLat}
          eventData={eventData}
          setCurrentStep={setCurrentStep}
          onCloseMod={onClose}
        />
      )}

      {currentStep === 2 && (
        <AddEventComponent
          onSubmit={handleAddEventSubmit}
          onBack={handleBackToEventForm}
          initialEventData={eventData}
          onClose={onClose}
        />
      )}

      {currentStep === 3 && (
        <ShareEventComponent
          userInfo={userInfo}
          eventData={eventData}
          onBack={handleBackToEventForm}
          initialEventData={eventData}
          shareEvent={handleShareEvent}
          onSubmit={onSubmit}
        />
      )}
    </View>
  );
};

export default CreateEvent;
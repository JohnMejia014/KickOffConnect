// CreateEvent.js
import React, { useState } from 'react';
import { View } from 'react-native';
import ChooseLocation from './ChooseLocation';
import AddEventComponent from './AddEventComponent';
import ShareEventComponent from './ShareEventComponent';

const CreateEvent = ({ isVisible, onClose, onSubmit, tabBarHeight, initialEventData, longitude, latitude }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [eventData, setEventData] = useState({
    coordinates: null,
    latitude: latitude,
    longitude: longitude,
    address: '',
    eventName: '',
    eventDescription: '',
    sports: [],
    date: '',
    timeRange: { start: '', end: '' },
  });

  const handleLocationSelection = (selectedCoordinates) => {
    setEventData((prevEventData) => ({
      ...prevEventData,
      coordinates: selectedCoordinates,
      latitude: selectedCoordinates.latitude,
      longitude: selectedCoordinates.longitude,
      address: selectedCoordinates.address,
    }));

    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleAddEventSubmit = (eventDetails) => {
    setEventData((prevEventData) => ({
      ...prevEventData,
      eventName: eventDetails.eventName,
      eventDescription: eventDetails.eventDescription,
      sports: eventDetails.sports,
      date: eventDetails.date,
      timeRange: { ...eventDetails.timeRange },
    }));

    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleBackToEventForm = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  return (
    <View>
      {currentStep === 1 && (
        <ChooseLocation
          isVisible={isVisible}
          onClose={handleBackToEventForm}
          onSelectLocation={handleLocationSelection}
          longitude={eventData.longitude}
          latitude={eventData.latitude}
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
          eventData={eventData}
          onBack={handleBackToEventForm}
          initialEventData={eventData}
        />
      )}
    </View>
  );
};

export default CreateEvent;
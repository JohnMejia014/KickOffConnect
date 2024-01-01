import React, { useState } from 'react';
import { View } from 'react-native';
import AddEventComponent from './AddEventComponent';
import ShareEventComponent from './ShareEventComponent';

const CreateEvent = ({ isVisible, onClose, onSubmit, tabBarHeight }) => {
  const [isAddEventVisible, setAddEventVisible] = useState(true);
  const [isShareEventVisible, setShareEventVisible] = useState(false); // New state variable
  const [eventData, setEventData] = useState(null);

  const handleAddEventSubmit = (eventInfo) => {
    console.log(eventInfo);
    setEventData(eventInfo);
    setAddEventVisible(false);
    setShareEventVisible(true); // Set to true to switch to ShareEventComponent
  };

  const handleBackToEventForm = () => {
    setEventData(null);
    setAddEventVisible(true);
    setShareEventVisible(false); // Set to false when going back to AddEventComponent
  };

  return (
    <View>
      {isAddEventVisible && (
        <AddEventComponent
          isVisible={isVisible}
          onClose={onClose}
          onSubmit={handleAddEventSubmit}
        />
      )}

      {isShareEventVisible && (
        <ShareEventComponent
          eventData={eventData}
          onBack={handleBackToEventForm}
        />
      )}
    </View>
  );
};

export default CreateEvent;

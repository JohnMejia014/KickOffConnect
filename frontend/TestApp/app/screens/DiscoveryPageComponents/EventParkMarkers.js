import React, { useState } from 'react';
import { Modal, View, StyleSheet, Dimensions } from 'react-native';
import EventListComponent from './EventListComponent';
import PopUpForPlace from './PopUpForPlace';

const EventParkMarkers = ({ isVisible, placeInfo, onClose, joinEvent, leaveEvent, userInfo, addEvent, submitEvent }) => {
  const [modalVisible, setModalVisible] = useState(isVisible);

  const handleCloseModal = () => {
    setModalVisible(false);
    onClose(); // Call the onClose prop when the modal is closed
  };

  return (
      <View>
        {placeInfo.places.length > 0 ? (
          <PopUpForPlace
            placeInfo={placeInfo}
            onClose={handleCloseModal}
            joinEvent={joinEvent}
            leaveEvent={leaveEvent}
            onAddEvent={addEvent}
            onAddRating={() => {}}
            userInfo={userInfo}
            submitEvent={submitEvent}
          />
        ) : (
          <EventListComponent
            events={placeInfo?.events || []}
            isModalVisible={modalVisible}
            onClose={handleCloseModal}
            userInfo={userInfo}
            leaveEvent={leaveEvent}
            joinEvent={joinEvent}
          />
        )}
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
  },
});

export default EventParkMarkers;

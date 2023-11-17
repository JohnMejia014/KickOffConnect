import React from 'react';
import MapView, { Circle, PROVIDER_DEFAULT} from 'react-native-maps';
import { SafeAreaView } from 'react-native';

const GetMap = () => {
  const initialRegion = {
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const circleCoordinates = {
    latitude: 37.7749,
    longitude: -122.4194,
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={initialRegion}
        provider={MapView.PROVIDER_GOOGLE} // or MapView.PROVIDER_DEFAULT for iOS
        apiKey="AIzaSyCFFCJXpMpMapumtoVf5Wnzpp1FynKj3iY"
      >
        <Circle
          center={circleCoordinates}
          radius={500}
          fillColor="rgba(255, 0, 0, 0.2)"
          strokeColor="rgba(255, 0, 0, 0.8)"
        />
      </MapView>
    </SafeAreaView>
  );
};

export default GetMap;
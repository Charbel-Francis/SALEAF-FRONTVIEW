import React from "react";
import { Text, View } from "react-native";

const Events = () => {
  const injectedJS = `
    document.addEventListener('DOMContentLoaded', function() {
      window.localStorage.setItem('serviceToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZTg3ODA5MjczZTI4Yjk2ZDJlMzg1MzgiLCJpYXQiOjE3MjY3MjQ3NzEsImV4cCI6MTcyNjgxMTE3MX0.VM5p84DQuA9PCm3eoOHHXseFneeTHEIKa_shFX04WnY');
      window.localStorage.setItem('mobileView', 'true');
    });
    true;
`;

  return (
    <View>
      <Text>Events</Text>
    </View>
  );
};

export default Events;

import './gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigation from './src/navigation/AuthNavigation/AuthNavigation';
import Toast from 'react-native-toast-message';

const App = () => {
  return (
    <>
      <NavigationContainer>
        <AuthNavigation />
      </NavigationContainer>
      <Toast />
    </>
  );
};

export default App;

import React from 'react'
import Splash from '../../pages/auth/SplashScreen'
import Login from '../../pages/auth/Login'
import Signup from '../../pages/auth/Signup'
import ForgotPassword from '../../pages/auth/FogotPassword'
import ResetPassword from '../../pages/auth/ResetPassword'
import CongratsScreen from '../../pages/auth/CongratsScreen'
import { createStackNavigator } from '@react-navigation/stack';
import DrawerNavigation from '../DrawerNavigation/DrawerNavigation'
import Itinerary from '../../pages/screens/Itinerary'

const Stack = createStackNavigator();

const AuthNavigation = () => {

  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen name="CongratsScreen" component={CongratsScreen} />
      <Stack.Screen name="Drawer" component={DrawerNavigation} />
      <Stack.Screen name="Itinerary" component={Itinerary} />
    </Stack.Navigator>
  )
}

export default AuthNavigation

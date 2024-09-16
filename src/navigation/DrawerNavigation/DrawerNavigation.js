import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Image } from 'react-native';
import Profile from '../../pages/screens/Profile';
import Calendar from '../../pages/screens/Calendar';
import SubscribCalendar from '../../pages/screens/SubscribCalendar';
import CustomDrawerContent from './CustomDrawerContent'; // Import the custom drawer

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />} // Custom drawer content
      screenOptions={{
        headerTitle: 'My Cruise Cal',
        headerStyle: {
          backgroundColor: '#5779B8',
        },
        headerTintColor: '#fff',
      }}
    >
      {/* Profile Screen with Icon */}
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          drawerIcon: ({ focused, size }) => (
            <Image
              source={require('../../assets/images/profile.png')} // Path to your profile icon
              style={{ width: size, height: size, tintColor: focused ? '#5779B8' : 'black', resizeMode: "cover" }}
            />
          ),
        }}
      />

      {/* Calendar Screen with Icon */}
      <Drawer.Screen
        name="My Calendar"
        component={Calendar}
        options={{
          drawerIcon: ({ focused, size }) => (
            <Image
              source={require('../../assets/images/calendar.png')}
              style={{
                width: size, height: size, tintColor: focused ? '#5779B8' : 'black', resizeMode: "contain"
              }}
            />
          ),
        }}
      />

      {/* Subscrib Calendar Screen with Icon */}
      <Drawer.Screen
        name="My Subscribe Calendar"
        component={SubscribCalendar}
        options={{
          drawerIcon: ({ focused, size }) => (
            <Image
              source={require('../../assets/images/subscribe.png')} // Path to your subscription icon
              style={{ width: size, height: size, tintColor: focused ? '#5779B8' : 'black', resizeMode: "cover" }}
              resizeMode='cover'
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;

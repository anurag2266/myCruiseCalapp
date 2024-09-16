import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';

const CustomDrawerContent = (props) => {
    const navigation = useNavigation()
    return (
        <View style={{ flex: 1 }}>
            {/* Profile Section */}
            <View style={styles.profileContainer}>
                <View>
                    <Image
                        source={{ uri: 'https://picsum.photos/id/1/200/300' }} // Replace with your profile image URL or local path
                        style={styles.profileImage}
                    />
                    <TouchableOpacity style={{ alignItems: "center" }}>
                        <Text style={styles.edit}>Edit</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ marginLeft: 20 , marginBottom:30}}>
                    <Text style={styles.profileName}>John Doe</Text>
                    <Text style={styles.email}>john@gmail.com</Text>
                </View>
            </View>

            {/* Drawer Items */}
            <DrawerContentScrollView {...props}>
                <DrawerItemList {...props} />
            </DrawerContentScrollView>

            {/* Logout Button at the Bottom */}
            <TouchableOpacity style={styles.logoutButton} onPress={() => {
                // Add your logout functionality here
                navigation.navigate("Login")
            }}>
                <Image source={require('../../assets/images/logout.png')} />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    profileContainer: {
        // backgroundColor: '#007BFF',
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: "grey",
        marginBottom: 30,
        flexDirection: "row"
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 550,
        marginBottom: 10,
    },
    profileName: {
        color: 'black',
        fontSize: 24,
        fontWeight: '700',
        color: "#5879BC",
        textAlign: "left"
    },
    email: {
        color: 'black',
        fontSize: 16,
        textAlign: "left"
    },
    logoutButton: {
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: "row",
        marginBottom: 50,
        // backgroundColor: "grey",
    },
    logoutText: {
        color: 'black',
        fontSize: 16,
        marginLeft: 10
    },
    edit: {
        color: "#5879BC",
        fontWeight: "bold"
    }
});

export default CustomDrawerContent;

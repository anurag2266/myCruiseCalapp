import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { getFontFamily } from '../../utils/fontFamily';
import { useSelector } from 'react-redux';
import auth from '@react-native-firebase/auth'; 
import { clearUser } from '../../redux/userSlice';
import { useDispatch } from 'react-redux';


const CustomDrawerContent = (props) => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    // const userInfo = useSelector((state) => state.user.userInfo);


   const handleLogout = async () =>{
    try {
        // await auth().signOut(); 
        // dispatch(clearUser()); 
        // persistor.purge(); 
        console.log('User signed out');
        navigation.navigate('Login')
    } catch (error) {
        console.error('Error signing out:', error);
    }
   }

    return (
        <View style={{ flex: 1 }}>
            {/* Profile Section */}
            <View style={styles.profileContainer}>
                <View style={{ flexDirection: "row" }}>
                    <Image
                        source={{ uri: 'https://picsum.photos/id/1/200/300' }} // Replace with your profile image URL or local path
                        style={styles.profileImage}
                    />
                    <TouchableOpacity style={styles.editbtn}>
                        <Image source={require('../../assets/images/dit.png')} style={{ width: 13, height: 13 }} />
                    </TouchableOpacity>
                </View>

                <View style={{ marginLeft: 20, marginBottom: 30 }}>
                    <Text style={styles.profileName}>{"John Doe"}</Text>
                    <Text style={styles.email}> { "john@gmail.com"}</Text>
                </View>
            </View>

            {/* Drawer Items */}
            <DrawerContentScrollView {...props}>
                <DrawerItemList {...props} />
            </DrawerContentScrollView>

            {/* Logout Button at the Bottom */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <View style={{
                    flexDirection: "row", alignItems: 'center',
                    justifyContent: "flex-start", marginLeft: 15
                }}>
                    <Image source={require('../../assets/images/logout.png')} style={{ height: 18, width: 18 }} />
                    <Text style={styles.logoutText}>Log Out</Text>
                </View>

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
        fontSize: 22,
        color: "#5879BC",
        textAlign: "left",
        fontFamily: getFontFamily("bold"),
    },
    email: {
        color: '#666666',
        fontSize: 13,
        textAlign: "left",
        fontFamily: getFontFamily("medium")
    },
    logoutButton: {
        padding: 15,
        marginBottom: 50,
        backgroundColor: "#0000000",
    },
    logoutText: {
        color: 'black',
        fontSize: 16,
        marginLeft: 10
    },
    edit: {
        color: "#5879BC",
        fontWeight: "bold"
    },
    editbtn: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#5879BC",
        height: 30,
        width: 30,
        borderRadius: 15,
        borderColor: "#fff",
        borderWidth: 3,
        zIndex: 100,
        position: "absolute",
        top: 45,
        left: 60
    }
});

export default CustomDrawerContent;

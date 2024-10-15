import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import React, { useState } from 'react';
import CustomTextInput from '../../components/CustomTextInput';
import CustomButton from '../../components/CustomButton';
import { getFontFamily } from '../../utils/fontFamily';


export default function EditProfile() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');

    const handleUpdateProfile = () => {
        // Add your update profile logic here
        console.log('Profile updated:', { firstName, lastName, phoneNumber, email });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.imageContainer}>
                <View style={{ flexDirection: "row" }}>
                    <Image
                        source={{ uri: 'https://picsum.photos/id/1/200/300' }} // Replace with your profile image URL or local path
                        style={styles.profileImage}
                    />
                    <TouchableOpacity onPress={() => { '' }} style={styles.editbtn}>
                        <Image source={require('../../assets/images/dit.png')} style={{ width: 13, height: 13 }} />
                    </TouchableOpacity>
                </View>
            </View>


            <View style={styles.inputContainer}>
                <CustomTextInput
                    placeholder="First Name"
                    value={firstName}
                    onChangeText={setFirstName}
                />

                <CustomTextInput
                    placeholder="Last Name"
                    value={lastName}
                    onChangeText={setLastName}
                />

                <CustomTextInput
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                />

                <CustomTextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
            </View>

            <CustomButton style={styles.updateButton} onPress={handleUpdateProfile} label='Update Profile' />


        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        justifyContent: "space-around",
        backgroundColor: '#f9f9f9',
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 30,
        alignItems: "center",
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    changeImageButton: {
        backgroundColor: '#5879BC',
        padding: 10,
        borderRadius: 5,
    },
    changeImageText: {
        color: '#fff',
        fontSize: 14,
    },
    inputContainer: {
        marginBottom: 20,
    },
    updateButton: {
        padding: 15,
        borderRadius: 5,
    },
    updateButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: getFontFamily("bold"),
    },
    profileImage: {
        width: 100,
        height: 100,
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
        top: 55,
        left: 80
    },
});
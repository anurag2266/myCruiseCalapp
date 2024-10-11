import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ScrollView } from 'react-native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import colors from '../../theme/colors';
import CustomButton from '../../components/CustomButton';
import CustomTextInput from '../../components/CustomTextInput';

const Signup = ({ navigation }) => {
    // State for form inputs
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [mobile, setMobile] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        // Validation check
        if (!name || !email || !password || !confirmPassword || !mobile) {
            Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Error',
                text2: 'All fields are required',
            });
            return;
        }

        if (password !== confirmPassword) {
            Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Error',
                text2: 'Passwords do not match',
            });
            return;
        }

        try {
            setLoading(true); // Start loading

            // API call
            const response = await axios.post('https://cruisecal.blackbullsolution.com/api/register', {
                name,
                email,
                password,
                c_password: confirmPassword,
                mobile,
            });

            console.log("respons", response);

            setLoading(false); // Stop loading

            if (response.data.success) {
                Toast.show({
                    type: 'success',
                    position: 'top',
                    text1: 'Signup Successful',
                    text2: 'Your account has been created!',
                });
                navigation.navigate('Login'); // Navigate to login page after successful registration
            } else {
                Toast.show({
                    type: 'error',
                    position: 'top',
                    text1: 'Error',
                    text2: response.data.message || 'Something went wrong',
                });
            }
        } catch (error) {
            setLoading(false); // Stop loading in case of error
            console.error('Error during signup:', error);
            Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Error',
                text2: 'Failed to create account. Please try again.',
            });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image resizeMode="contain" source={require('../../assets/images/back.png')} style={{ height: 30, width: 30, marginLeft: 10 }} />
                </TouchableOpacity>
                <Image source={require('../../assets/images/appLogo.png')} style={styles.logo} />
                <Text style={styles.title}>Create account</Text>
                <Text style={styles.subHeading}>Create an account so you can explore all the my cruise call</Text>

                <CustomTextInput placeholder="First Name" value={name} onChangeText={(text) => setName(text)} />
                <CustomTextInput placeholder="Email" value={email} onChangeText={(text) => setEmail(text)} />
                <CustomTextInput placeholder="Password" value={password} secureTextEntry onChangeText={(text) => setPassword(text)} />
                <CustomTextInput placeholder="Confirm Password" value={confirmPassword} secureTextEntry onChangeText={(text) => setConfirmPassword(text)} />
                <CustomTextInput placeholder="Mobile" value={mobile} onChangeText={(text) => setMobile(text)} />

                <CustomButton label="Sign Up" onPress={handleSignup} loading={loading} />

                <View style={styles.signupContainer}>
                    <Text style={{ fontSize: 18 }}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.signupText}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 32,
        marginBottom: 24,
        alignSelf: 'center',
        fontWeight: '900',
        color: colors.primary,
    },
    logo: {
        height: 150,
        width: 150,
        resizeMode: 'contain',
        alignSelf: 'center',
    },
    subHeading: {
        alignSelf: 'center',
        marginBottom: 20,
        color: 'black',
        fontSize: 18,
        textAlign: 'center',
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 40,
    },
    signupText: {
        color: colors.primary,
        fontWeight: 'bold',
        fontSize: 18,
    },
});

export default Signup;


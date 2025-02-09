import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import CustomButton from '../../components/CustomButton';
import CustomTextInput from '../../components/CustomTextInput';
import colors from '../../theme/colors';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import { getFontFamily } from '../../utils/fontFamily';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { setUser } from '../../redux/userSlice';
import { useDispatch } from 'react-redux';
import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height } = Dimensions.get('window');

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '1034163217798-9glb7l9dpa7u6b8fde1c4nmv2uo91jan.apps.googleusercontent.com',
        });
    }, []);

    const signInWithGoogle = async () => {
        try {
            const userInfo = await GoogleSignin.signIn();
            const googleCredential = auth.GoogleAuthProvider.credential(userInfo.data.idToken);
            const userCredential = await auth().signInWithCredential(googleCredential);
            Toast.show({ type: 'success', position: 'top', text1: 'Login Successful', text2: 'Welcome back!' });
            dispatch(setUser(userCredential.user));
            navigation.navigate('Drawer');
        } catch (error) {
            handleGoogleSignInError(error);
        }
    };

    const handleGoogleSignInError = (error) => {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            console.log('User cancelled the login flow');
        } else if (error.code === statusCodes.IN_PROGRESS) {
            console.log('Sign in is in progress already');
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            console.log('Play services not available or outdated');
        } else {
            console.error(error);
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // Simple email regex pattern
        return emailRegex.test(email);  // Returns true if email is valid, false otherwise
    };

    const handleLogin = async () => {
        if (!email || !password) {
            Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Validation Error',
                text2: 'Email and Password are required.',
            });
            return;
        }

        // if (!validateEmail(email)) {
        //     Toast.show({
        //         type: 'error',
        //         position: 'top',
        //         text1: 'Validation Error',
        //         text2: 'Please enter a valid email address.',
        //     });
        //     return;
        // }

        setLoading(true);

        try {
            const response = await axios.post('https://cruisecal.blackbullsolution.com/api/login', { email, password });

            // Check if the login is successful
            if (response.data.success) {
                const { token, name } = response.data.data;  // Extract the token and name from the response

                // Show a success message
                Toast.show({
                    type: 'success',
                    position: 'top',
                    text1: 'Login Successful',
                    text2: `Welcome back, ${name}!`,
                });

                // Save the token to persist login state (Optional: You can store this in AsyncStorage)
                await AsyncStorage.setItem('userToken', token);
                await AsyncStorage.setItem('user_name', name);
                // Navigate to the Drawer screen
                navigation.navigate('Drawer');
            } else {
                Toast.show({
                    type: 'error',
                    position: 'top',
                    text1: 'Login Failed',
                    text2: response.data.message || 'An error occurred',
                });
            }
        } catch (error) {
            console.error('Error logging in:', error);
            Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Login Failed',
                text2: 'An error occurred while logging in',
            });
        } finally {
            setLoading(false);
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.innerContainer}>
                <Image source={require('../../assets/images/appLogo.png')} style={styles.logo} />
                <Text style={styles.title}>Login here</Text>
                <Text style={styles.subHeading}>Welcome back you’ve been missed!</Text>
                <CustomTextInput placeholder="Email" value={email} onChangeText={setEmail} />
                <CustomTextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotTxt}>
                    <Text style={{color:"black"}}>Forgot your password?</Text>
                </TouchableOpacity>
                <LinearGradient colors={['#8DC5EA', '#5879BC']} style={styles.gradientButton}>
                    <TouchableOpacity onPress={handleLogin} disabled={loading} style={styles.loginButton}>
                        {loading ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <Text style={styles.buttonText}>Login</Text>
                        )}
                    </TouchableOpacity>
                </LinearGradient>
                <Text style={styles.continue}>Or continue with</Text>
                <View style={styles.socialContainer}>
                    <TouchableOpacity onPress={signInWithGoogle} style={styles.SocialbuttonCon}>
                        <LinearGradient colors={['#8DC5EA', '#5879BC']} style={styles.Socialbutton}>
                            <Image source={require('../../assets/images/google.png')} style={styles.socialIcon} />
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.SocialbuttonCon}>
                        <LinearGradient colors={['#8DC5EA', '#5879BC']} style={styles.Socialbutton}>
                            <Image source={require('../../assets/images/fb.png')} style={styles.socialIcon} />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
                <View style={styles.signupContainer}>
                    <Text style={styles.signupText}>Don’t have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                        <Text style={styles.signupLink}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "white",
    },
    innerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 13,
    },
    title: {
        fontSize: 28,
        marginBottom: 16,
        fontWeight:"900",
        color: colors.primary,
        textAlign: "center",
    },
    logo: {
        height: 150,
        width: 150,
        resizeMode: "contain",
        marginBottom: 20,
    },
    forgotTxt: {
        fontSize: 16,
        color: colors.primary,
        alignSelf: "flex-end",
        marginBottom: 20,
    },
    subHeading: {
        textAlign: "center",
        marginBottom: 20,
        color: "black",
        fontSize: 16,
    },
    loginButton: {
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: getFontFamily("medium"),
    },
    continue: {
        marginVertical: 25,
        color: "black",
        fontSize: 16,
    },
    socialContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: 10,
    },
    Socialbutton: {
        padding: 15,
        borderRadius: 12,
    },
    SocialbuttonCon: {
        padding: 10,
        borderRadius: 12,
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    signupText: {
        fontSize: 16,
        color: "grey",
    },
    signupLink: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: "bold",
    },
    gradientButton: {
        borderRadius: 8,
        marginVertical: 20,
        width: '100%',
        alignItems: 'center',
        elevation: 5,
    },
    socialIcon: {
        width: 35,
        height: 35,
        resizeMode: "contain",
    },
});

export default Login;


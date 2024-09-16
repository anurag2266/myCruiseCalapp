import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import CustomButton from '../../components/CustomButton';
import CustomTextInput from '../../components/CustomTextInput';
import colors from '../../theme/colors';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';


// const axiosInstance = axios.create({
//     baseURL: 'https://cruisecal.blackbullsolution.com/api/',
// });

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);  // Loading state

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
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

        if (!validateEmail(email)) {
            Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Validation Error',
                text2: 'Please enter a valid email address.',
            });
            return;
        }
        setLoading(true);  // Start loading

        try {
            console.log('Attempting to log in with:', { email, password });
            const response = await axios.post('https://cruisecal.blackbullsolution.com/api/login', {
                email,
                password,
            });
            console.log('API response:', response); 
            if (response.data.success) {
                Toast.show({
                    type: 'success',
                    position: 'top',
                    text1: 'Login Successful',
                    text2: 'Welcome back!',
                });
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
            setLoading(false);  // Stop loading
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <Image source={require('../../assets/images/appLogo.png')} style={styles.logo} />
                <Text style={styles.title}>Login here</Text>
                <Text style={styles.subHeading}>Welcome back you’ve been missed!</Text>
                <CustomTextInput
                    style={{ marginBottom: 20 }}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                />
                <CustomTextInput
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                <TouchableOpacity
                    onPress={() => navigation.navigate('ForgotPassword')}
                    style={{ alignSelf: "flex-end", marginBottom: 20 }}
                >
                    <Text style={styles.forgotTxt}>Forgot your password?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.loginButton}
                    // onPress={()=> navigation.navigate('Drawer')}
                    onPress={handleLogin}
                    disabled={loading} // Disable button while loading
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="white" /> // Show loader
                    ) : (
                        <Text style={styles.buttonText}>Login</Text> // Show login text
                    )}
                </TouchableOpacity>

                <Text style={styles.continue}>Or continue with</Text>

                <View style={styles.socialContainer}>
                    <TouchableOpacity style={styles.SocialbuttonCon}>
                        <LinearGradient
                            colors={['#8DC5EA', '#5879BC']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.Socialbutton}
                        >
                            <Image source={require('../../assets/images/realGoogle.png')} style={{ width: 40, height: 40 }} />
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.SocialbuttonCon}>
                        <LinearGradient
                            colors={['#8DC5EA', '#5879BC']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.Socialbutton}
                        >
                            <Image source={require('../../assets/images/fb.png')} style={{ width: 40, height: 40 }} />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
                <View style={styles.signupContainer}>
                    <Text style={{ fontSize: 18 , color:"grey"}}>Don’t have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                        <Text style={styles.signupText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        padding: 20,
        backgroundColor: "white"
    },
    title: {
        fontSize: 32,
        marginBottom: 24,
        alignSelf: "center",
        fontWeight: "900",
        color: colors.primary
    },
    logo: {
        height: 150,
        width: 150,
        resizeMode: "contain",
        alignSelf: "center"
    },
    forgotTxt: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.primary
    },
    subHeading: {
        alignSelf: "center",
        marginBottom: 20,
        color: "black",
        fontSize: 18,
    },
    loginButton: {
        backgroundColor: colors.primary,
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 18,
    },
    continue: {
        margin: 25,
        alignSelf: "center",
        color: "black",
        fontSize: 18
    },
    socialContainer: {
        flexDirection: "row",
        justifyContent: "center"
    },
    Socialbutton: {
        padding: 15,
        borderRadius: 12
    },
    SocialbuttonCon: {
        padding: 10,
        borderRadius: 12
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 40,
    },
    signupText: {
        color: colors.primary,
        fontWeight: 'bold',
        fontSize: 18
    },
});

export default Login;

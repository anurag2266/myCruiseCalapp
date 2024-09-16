// Login.js
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import CustomButton from '../../components/CustomButton';
import CustomTextInput from '../../components/CustomTextInput';
import colors from '../../theme/colors';
import LinearGradient from 'react-native-linear-gradient';


const ForgotPassword = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <TouchableOpacity onPress={()=> navigation.goBack()}>
                <Image resizeMode='contain'  source={require('../../assets/images/back.png')} style={{height:30, width:30, marginLeft:10}} />
                </TouchableOpacity>
                <Image source={require('../../assets/images/appLogo.png')} style={styles.logo} />
                <Text style={styles.title}>Forgot Password?</Text>
                <Text style={styles.subHeading}>Select which contact details should we use to
reset your password</Text>
                <CustomTextInput style={{ marginBottom: 20 }} placeholder="Email" />
                <CustomTextInput placeholder="Confirm Password" />
                <CustomButton onPress={()=> navigation.navigate('ResetPassword')} label='Next' />
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
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingLeft: 8,
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
        textAlign:"center"
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

export default ForgotPassword;
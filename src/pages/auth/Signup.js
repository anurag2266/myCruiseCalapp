import React from 'react';
import { View, Text, StyleSheet, SafeAreaView,TouchableOpacity ,Image, ScrollView} from 'react-native';
import colors from '../../theme/colors';
import LinearGradient from 'react-native-linear-gradient';
import CustomButton from '../../components/CustomButton';
import CustomTextInput from '../../components/CustomTextInput';

const Signup = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
            <ScrollView>
            <TouchableOpacity onPress={()=> navigation.goBack()}>
                <Image resizeMode='contain'  source={require('../../assets/images/back.png')} style={{height:30, width:30, marginLeft:10}} />
                </TouchableOpacity>
                <Image source={require('../../assets/images/appLogo.png')} style={styles.logo} />
                <Text style={styles.title}>Create account</Text>
                <Text style={styles.subHeading}>Create an account so you can explore all the my cruise call</Text>
                <CustomTextInput style={{ marginBottom: 20 }} placeholder="User" />
                <CustomTextInput placeholder="Last name" />
                <CustomTextInput placeholder="Email" />
                <CustomTextInput placeholder="Password" />
                <CustomTextInput placeholder="Confirm Password" />
                <CustomTextInput placeholder="Mobile" />
                <CustomButton label=' Signup' />
                <View style={styles.signupContainer}>
                    <Text style={{ fontSize: 18 }}>Don’t have an account? </Text>
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
      // alignItems:"center",
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

export default Signup;
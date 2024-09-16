import { StyleSheet, Text, View ,Image} from 'react-native'
import React from 'react'
import colors from '../../theme/colors'


const CongratsScreen = () => {
  return (
    <View style={styles.container}>
     <Image style={styles.cong} source={require('../../assets/images/congrats.png')} />
     <View style={{marginTop:40}}>
<Text style={styles.title}>Congrats!</Text>
<Text style={{fontSize:20, color:"black", fontWeight:"600"}}>Password reset successful</Text>
     </View>
    </View>
  )
}

export default CongratsScreen

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"center",
        alignItems:"center"
    },
    cong:{
        width:280,
        height:280,
        resizeMode:"contain"
    },
    title: {
        fontSize: 32,
        marginBottom: 10,
        alignSelf: "center",
        fontWeight: "900",
        color: colors.primary
    },
})
import React, { useState } from 'react';
import { TextInput, StyleSheet, View } from 'react-native';

const CustomTextInput = (props) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      style={[
        styles.inputContainer,
        isFocused && styles.inputFocused, // Apply focused style conditionally
      ]}
    >
      <TextInput
        {...props}
        style={styles.textInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: '#F1F4FF', // Background color
    borderColor: '#ccc', // Default border color
    borderWidth: 1,
    borderRadius: 8, // Border radius
    padding: 10,
    marginBottom:25
  },
  inputFocused: {
    borderColor: '#5779B9', // Border color when focused
  },
  textInput: {
    height: 40,
    color: '#000',
  },
});

export default CustomTextInput;

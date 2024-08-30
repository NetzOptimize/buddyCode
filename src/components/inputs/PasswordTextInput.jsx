import React, {useState, forwardRef} from 'react';
import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {COLORS, FONTS} from '../../constants/theme/theme';

var viewPassword = require('../../../assets/Images/input/viewPassword.png');
var hidePassword = require('../../../assets/Images/input/hidePassword.png');

const PasswordTextInput = forwardRef(
  ({placeholder, onChangeText, ...allProps}, ref) => {
    const [toggleViewPassword, setToggleViewPassword] = useState(true);

    return (
      <View style={styles.pwContainer}>
        <TextInput
          style={styles.inputStyles}
          placeholder={placeholder}
          onChangeText={onChangeText}
          placeholderTextColor={COLORS.VISION}
          secureTextEntry={toggleViewPassword}
          ref={ref}
          {...allProps}
        />
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => setToggleViewPassword(prev => !prev)}>
          <Image
            source={toggleViewPassword ? viewPassword : hidePassword}
            style={{width: 20, height: 20}}
          />
        </TouchableOpacity>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  pwContainer: {
    width: '100%',
    height: 60,
    backgroundColor: COLORS.GREY_LIGHT,
    borderRadius: 100,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputStyles: {
    height: 60,
    fontSize: 16,
    fontFamily: FONTS.MAIN_REG,
    width: '85%',
    color: COLORS.LIGHT,
  },
  iconContainer: {
    width: '15%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PasswordTextInput;

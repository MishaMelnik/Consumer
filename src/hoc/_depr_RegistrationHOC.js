import React from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';

const height = Dimensions.get('window').height;

function registrationDependPlatform(Component) {
  class Registration extends React.Component {
    render() {
      const platform = Platform.OS;
      return (
        <View style={styles.mainView}>
          <View>
            <Image
              source={require('../images/bg_clear.jpg')}
              style={styles.bg_clear}
            />
          </View>
          {platform === 'ios' ? (
            <KeyboardAvoidingView behavior="position">
              <Component {...this.props} />
            </KeyboardAvoidingView>
          ) : (
            <Component {...this.props} />
          )}
        </View>
      );
    }
  }

  Registration.displayName = `RegistrationHOC(${
    Component.displayName || Component.name || 'Component'
  })`;

  return Registration;
}

export default registrationDependPlatform;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  bg_clear: {
    height: height,
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {t} from '../services/i18n';

function reviewCreateDependPlatform(Component) {
  class ReviewCreate extends React.Component {
    render() {
      const platform = Platform.OS;
      return (
        <View style={styles.container}>
          <Text style={styles.heading}>{t('Feedback Form')}</Text>
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
  ReviewCreate.displayName = `ReviewCreateHOC(${
    Component.displayName || Component.name || 'Component'
  })`;

  return ReviewCreate;
}

export default reviewCreateDependPlatform;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
  },
  heading: {
    textAlign: 'center',
    fontSize: 22,
    marginBottom: 20,
  },
});

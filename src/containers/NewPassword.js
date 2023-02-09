import React, {Component} from 'react';
import {
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';

import {t} from '../services/i18n';
import {
  login,
  updateObjectWithResponse,
  userData,
  API,
  createObject,
} from '../services';
// import {HocIOS} from '../hoc/hocIOS';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class NewPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenID: props.route.params.tokenID,
      phone: props.route.params.phone,
      new_password: '',
      confirm_password: '',
    };
  }

  isValid() {
    const {new_password, confirm_password} = this.state;

    if (!new_password) {
      return this.showErrors({
        non_field_errors: [t('Passwords do not match. Try again')],
      });
    }

    // if (new_password.length <= 4) {
    //   return this.showErrors({non_field_errors: [t('Your password is too poor')]})
    // }

    return new_password === confirm_password && new_password.length >= 4;
  }

  showErrors(error) {
    if (error.hasOwnProperty('non_field_errors')) {
      alert(error.non_field_errors[0]);
    }
  }

  _handlePasswordInput = text => this.setState({new_password: text});

  _handleConfirmPasswordInput = text => this.setState({confirm_password: text});

  sendNewPassword = () => {
    const {phone, new_password} = this.state;
    if (this.isValid()) {
      updateObjectWithResponse(API.restore.step_three, {
        phone: phone,
        password: new_password,
      })
        .then(res => {
          if (res.token) {
            login(res.token);
            userData(res.user);
          }
        })
        .then(() => {
          createObject(API.token_phone, {reg_id: this.state.tokenID});
          this.props.navigation.reset({
            index: 0,
            routes: [{name: 'Home'}],
          });
        });
    }
  };

  render() {
    return (
      <View style={styles.mainView}>
        <View>
          <Image
            source={require('../images/bg_clear.jpg')}
            style={styles.bg_clear}
          />
        </View>
        {/*<HocIOS>*/}
        <ScrollView
          contentContainerStyle={styles.loginContainer}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled">
          <View style={{marginLeft: 7, marginRight: 7}}>
            <Image
              source={require('../images/logo_text.png')}
              style={styles.logoImage}
            />
          </View>
          <ScrollView
            contentContainerStyle={styles.loginContent}
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled">
            <Text style={{marginBottom: 10, color: 'white', fontSize: 16}}>
              {t('Enter new password')}
            </Text>
            <TextInput
              keyboardType="default"
              placeholder={t('New password')}
              secureTextEntry={true}
              style={styles.input}
              underlineColorAndroid="transparent"
              onChangeText={this._handlePasswordInput}
            />
            <TextInput
              keyboardType="default"
              placeholder={t('Confirm new password')}
              secureTextEntry={true}
              style={styles.input}
              underlineColorAndroid="transparent"
              onChangeText={this._handleConfirmPasswordInput}
            />
            <View style={styles.buttons}>
              <TouchableOpacity
                onPress={this.sendNewPassword}
                style={styles.simpleButtons}>
                <Text style={styles.simpleButtonText}>
                  {t('Send').toUpperCase()}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </ScrollView>
        {/*</HocIOS>*/}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loginContainer: {
    width: '100%',
    display: 'flex',
    flex: 1,
    justifyContent: 'space-between',
    alignContent: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: 'transparent',
  },
  loginContent: {
    display: 'flex',
    flexGrow: 1,
    flexShrink: 0,
    width: 220,
    marginLeft: 'auto',
    marginRight: 'auto',
    alignContent: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 37,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 3,
    paddingVertical: 0,
    paddingRight: 10,
  },
  buttons: {
    height: 50,
    display: 'flex',
    justifyContent: 'space-around',
  },
  simpleButtons: {
    height: 40,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  simpleButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  logoImage: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
    top: 10,
    left: 0,
  },
  bg_clear: {
    flex: 1,
    width: width,
    height: height,
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

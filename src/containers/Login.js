import React, {Component} from 'react';
import {
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
// import FCM from 'react-native-fcm';
import {authenticate, login, userData, createObject, API} from '../services';
import {PHONENUMBER_PREFIX} from '../config';
import {t} from '../services/i18n';
import TextInputMask from 'react-native-text-input-mask';
import RestorePassword from './RestorePassword';
import styles from '../services/styles';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      phone: PHONENUMBER_PREFIX,
      password: '',
      youCan: false,
    };
  }

  componentDidMount() {
    // FCM.requestPermissions(); // for iOS
    // FCM.getFCMToken().then(token => {
    //   this.setState({tokenID: token});
    //   // store fcm token in your server
    // });
  }

  isValid() {
    const {phone, password} = this.state;

    if (phone.length < 13) {
      return this.showErrors({
        non_field_errors: [t('Phone do not match. Try again')],
      });
    }

    if (!phone || !password) {
      return this.showErrors({
        non_field_errors: [t('Both fields are required')],
      });
    }

    return !!phone && !!password;
  }

  _handlePhoneInput = (formatted, extracted) =>
    this.setState({phone: `+38${extracted}`});

  _handlePasswordInput = text => this.setState({password: text});

  showErrors = error => {
    if (error.hasOwnProperty('non_field_errors')) {
      alert(error.non_field_errors[0]);
    }
  };

  postData = () => {
    if (this.isValid()) {
      const {phone, password} = this.state;
      authenticate({
        phone,
        password,
      })
        .then(response => {
          if (response.user.user_type === 3) {
            login(response.token);
            userData(response.user);
            this.setState({youCan: true});
          }
        })
        .then(() => {
          createObject(API.token_phone, {reg_id: this.state.tokenID});
          this.state.youCan === true
            ? this.props.navigation.reset({
                index: 0,
                routes: [{name: 'Home'}],
              })
            : this.showErrors({
                non_field_errors: [
                  t('Unable to log in with the provided credentials.'),
                ],
              });
        })
        .catch(this.showErrors);
    }
  };

  registration = () =>
    this.props.navigation.navigate('LoyaltyTerms', {register: true});

  forgotPassword = () =>
    this.props.navigation.navigate('RestorePassword', {
      tokenID: this.state.tokenID,
    });

  render() {
    return (
      <View style={styles.mainView}>
        <View>
          <Image
            source={require('../images/bg_clear.jpg')}
            style={styles.bg_clear}
          />
        </View>
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
            <TextInputMask
              onChangeText={this._handlePhoneInput}
              mask={'+38 ([000]) [000] [00] [00]'}
              ref="phone"
              style={styles.input}
              keyboardType="phone-pad"
              placeholder={t('Phone')}
              defaultValue="+38 ("
              underlineColorAndroid="transparent"
            />
            <TextInput
              ref="password"
              keyboardType="default"
              placeholder={t('Password')}
              secureTextEntry={true}
              style={styles.input}
              underlineColorAndroid="transparent"
              onChangeText={this._handlePasswordInput}
            />
            <View style={[styles.buttons, {height: 100}]}>
              <TouchableOpacity
                onPress={this.postData}
                style={styles.simpleButtons}>
                <Text style={styles.simpleButtonText}>
                  {t('Sign in').toUpperCase()}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.registration}
                style={styles.simpleButtons}>
                <Text style={styles.simpleButtonText}>
                  {t('Registration').toUpperCase()}
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={this.forgotPassword}>
              <Text style={styles.forgotPasswordBtn}>
                {t('Forgot password ?')}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </ScrollView>
      </View>
    );
  }
}

export default Login;

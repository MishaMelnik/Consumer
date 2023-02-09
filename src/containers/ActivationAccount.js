import React, {Component} from 'react';
import {
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import {
  authenticate,
  login,
  userData,
  createObject,
  API,
  updateObject,
  updateObjectWithResponse,
} from '../services';
import {PHONENUMBER_PREFIX} from '@app/config';
import {t} from '../services/i18n';

import {HocIOS} from '../hoc/hocIOS';
import {FakeTextInput} from '../components/FakeTextInput';
import styles from '../services/styles';

export default class ActivationAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputSms: props.route.params.register || false,
      phone: props.route.params.phone || '+38 (',
      smsCode: '',
      tokenID: props.route.params.tokenID,
      register: props.route.params.register,
      formatted_phone: props.route.params.phone || '+38 (',
    };
    // this.state = {
    //   inputSms: props.navigation?.state?.params?.register || false,
    //   phone: props.navigation?.state?.params?.phone || '+38 (',
    //   smsCode: '',
    //   tokenID: props.navigation?.state?.params?.tokenID,
    //   register: props.navigation?.state?.params?.register,
    //   formatted_phone: props.navigation?.state?.params?.phone || '+38 (',
    // };
  }

  isValid = () => !!this.state.phone && this.state.phone.length >= 12;

  _handleCodeInput = code => this.setState({smsCode: code});

  _handlePhoneInput = (formatted, extracted) =>
    this.setState({
      phone: `+38${extracted}`,
      formatted_phone: formatted,
    });

  _gotoHomePage = () => {
    this.props.navigation.reset({
      index: 0,
      routes: [{name: 'Home'}],
    });
  };

  _gotoNewPassword = () => {
    const {phone, tokenID} = this.state;
    this.props.navigation.navigate('NewPassword', {
      tokenID: tokenID,
      phone: phone,
    });
  };

  sendRequestForSms = () => {
    if (this.isValid()) {
      const {phone} = this.state;
      updateObject(API.restore.step_one, {
        phone: phone,
      }).then(res => {
        res === true
          ? this.setState({inputSms: true})
          : this.showErrors({
              non_field_errors: [t('There are no user with this phone number')],
            });
      });
    } else {
      this.showErrors({non_field_errors: [t('Enter your phone number')]});
    }
  };

  sendSmsCode = () => {
    if (this.isValid()) {
      const path = this.state.register
        ? API.registration.finish
        : API.restore.step_two;
      const {phone, smsCode, tokenID} = this.state;
      updateObjectWithResponse(path, {
        phone,
        activate_code: smsCode,
      }).then(res => {
        if (res.token) {
          login(res.token);
          userData(res.user);
          createObject(API.token_phone, {reg_id: tokenID}).then(() =>
            this._gotoHomePage(),
          );
        } else if (res.phone && res.phone === phone) {
          this._gotoNewPassword();
        } else {
          this.showErrors({
            non_field_errors: [t('Something happens, please, try again')],
          });
        }
      });
    }
  };

  showErrors = error => {
    if (error.hasOwnProperty('non_field_errors')) {
      alert(error.non_field_errors[0]);
    }
  };

  render() {
    const {inputSms} = this.state;

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
            <HocIOS>
              <Text style={{marginBottom: 10, color: 'white', fontSize: 16}}>
                {inputSms
                  ? t('Enter code from sms')
                  : t('Enter your phone number')}
              </Text>

              <FakeTextInput v={this.state.formatted_phone} />

              {inputSms ? (
                <TextInput
                  keyboardType="default"
                  style={styles.input}
                  placeholder={t('Enter code from sms')}
                  underlineColorAndroid="transparent"
                  onChangeText={this._handleCodeInput}
                />
              ) : null}
              <View style={styles.buttons}>
                <TouchableOpacity
                  onPress={inputSms ? this.sendSmsCode : this.sendRequestForSms}
                  style={styles.simpleButtons}>
                  <Text style={styles.simpleButtonText}>
                    {t('Next').toUpperCase()}
                  </Text>
                </TouchableOpacity>
              </View>
            </HocIOS>
          </ScrollView>
        </ScrollView>
      </View>
    );
  }
}

import React, {Component} from 'react';
import {Text, TextInput, TouchableOpacity, ScrollView} from 'react-native';
import {updateObject, API} from '../../services';
import {t} from '../../services/i18n';
import styles from '../../services/styles';
import {HocIOS} from '../../hoc/hocIOS';

class ChangePassword extends Component {
  constructor() {
    super();

    this.state = {
      password: '',
      new_password: '',
      confirm_password: '',
    };
  }

  isValid() {
    const {password, new_password, confirm_password} = this.state;
    if (!password) {
      return this.showErrors({
        non_field_errors: [t('Passwords do not match. Try again')],
      });
    }
    if (new_password !== confirm_password) {
      return this.showErrors({
        non_field_errors: [t('The password you entered is incorrect')],
      });
    }
    return !!password && !!new_password && !!confirm_password;
  }

  _handlePasswordInput = text => this.setState({password: text});

  _handleNewPasswordInput = text => this.setState({new_password: text});

  _handleConfirmPasswordInput = text => this.setState({confirm_password: text});

  showErrors(error) {
    if (error.hasOwnProperty('non_field_errors')) {
      alert(error.non_field_errors[0]);
    }
  }

  changePassword = () => {
    if (this.isValid()) {
      const {password, new_password} = this.state;
      let requestData = {
        password: password,
        new_password: new_password,
      };
      updateObject(API.password, requestData).then(statusRequest => {
        if (statusRequest) {
          this.props.navigation.reset({
            index: 0,
            routes: [{name: 'Home'}],
          });
        } else {
          let error = {
            non_field_errors: [
              t(
                'Something happened, failed to reset your password, please try again',
              ),
            ],
          };
          this.showErrors(error);
        }
      });
    }
  };

  render() {
    return (
      <ScrollView
        style={styles.loginWrapper}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled">
        <HocIOS>
          <Text style={styles.heading}>{t('Change password')}</Text>
          <TextInput
            keyboardType="default"
            placeholder={t('Old password')}
            secureTextEntry={true}
            style={styles.input}
            underlineColorAndroid="transparent"
            onChangeText={this._handlePasswordInput}
          />
          <TextInput
            keyboardType="default"
            placeholder={t('New password')}
            secureTextEntry={true}
            style={styles.input}
            underlineColorAndroid="transparent"
            onChangeText={this._handleNewPasswordInput}
          />
          <TextInput
            keyboardType="default"
            placeholder={t('Confirm new password')}
            secureTextEntry={true}
            style={styles.input}
            underlineColorAndroid="transparent"
            onChangeText={this._handleConfirmPasswordInput}
          />
          <TouchableOpacity
            onPress={this.changePassword}
            style={styles.simpleButtons}>
            <Text style={styles.simpleButtonText}>
              {t('Change password').toUpperCase()}
            </Text>
          </TouchableOpacity>
        </HocIOS>
      </ScrollView>
    );
  }
}

export default ChangePassword;

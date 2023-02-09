import React, {Component} from 'react';
import {
  View,
  TextInput,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {PHONENUMBER_PREFIX} from '../config';
// import FCM from 'react-native-fcm';
import ModalSelector from 'react-native-modal-selector';
import Autocomplete from 'react-native-autocomplete-input';
import {
  API,
  fetchList,
  registration,
  login,
  userData,
  createObject,
} from '../services';
import {t} from '../services/i18n';
import TextInputMask from 'react-native-text-input-mask';
import CityItem from '../components/CityItem';
import styles from '../services/styles';

class Registration extends Component {
  constructor() {
    super();
    this.state = {
      first_name: '',
      last_name: '',
      city: '',
      city_id: '',
      phone: '',
      date_birth: '',
      genderId: '',
      genderArray: [
        {key: 1, id: 'female', label: t('W')},
        {key: 2, id: 'male', label: t('M')},
      ],
      location: [],
      password: '',
      confirm_password: '',
    };
  }

  componentDidMount() {
    // FCM.requestPermissions(); // for iOS
    // FCM.getFCMToken().then(token => {
    //   this.setState({tokenID: token});
    //   // store fcm token in your server
    // });
    fetchList(API.location).then(response => {
      this.setState({
        location: response,
      });
    });
  }

  findLocation(city) {
    if (city === '') {
      return [];
    }
    const locations = this.state.location;
    const regex = new RegExp(`${city.trim()}`, 'i');
    return locations.filter(location => location.name.match(regex));
  }

  isValid() {
    const {phone, password, confirm_password} = this.state;

    if (!phone) {
      return this.showErrors({
        non_field_errors: [
          t('Phone number, Password, Repeat password fields are required'),
        ],
      });
    }
    if (!password) {
      return this.showErrors({
        non_field_errors: [t('Passwords do not match. Try again')],
      });
    }

    if (password !== confirm_password) {
      return this.showErrors({
        non_field_errors: [t('Passwords do not match. Try again')],
      });
    }

    return (
      !!phone &&
      !!password &&
      !!confirm_password &&
      password === confirm_password
    );
  }

  _handlePhoneInput = (formatted, extracted) =>
    this.setState({phone: `+38${extracted}`});

  _handleNameInput = text => this.setState({first_name: text});

  _handleSurnameInput = text => this.setState({last_name: text});

  _handleCitySelect = text => this.setState({city: text});

  _handleDateBirthInput = (formatted, extracted) =>
    this.setState({date_birth: formatted});

  _handleDateBirthModal = option => this.setState({genderId: option.id});

  _handlePasswordInput = text => this.setState({password: text});

  _handleConfirmPasswordInput = text => this.setState({confirm_password: text});

  _handleCityChoosing = (name, id) => {
    this.setState({city: name, city_id: id});
  };

  _convertDateBirth = date_birth => {
    let dateArray = date_birth.split('-');
    return dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0];
  };

  renderCityItem = props => {
    return (
      <CityItem
        key={`someKey_${props.index}`}
        name={props.item.name}
        id={props.item.id}
        handleCityChoosing={this._handleCityChoosing}
      />
    );
  };

  showErrors = defaultError => {
    console.log(defaultError);
    let error = {};
    for (let item in defaultError) {
      error = {non_field_errors: defaultError[item]};
    }
    if (error.hasOwnProperty('non_field_errors')) {
      alert(error.non_field_errors[0]);
    }
  };

  inputValuePicker = id => {
    let value = '';
    id.length !== 0
      ? this.state.genderArray.forEach(item => {
          item.id === id ? (value = item.label) : '';
        })
      : (value = t('Choose your gender'));
    return value;
  };

  postData = () => {
    if (this.isValid()) {
      //FIXME: server format 'YYYY-MM-DD', app format 'DD-MM-YYYY', back-end busy
      const {
        first_name,
        last_name,
        city_id,
        phone,
        genderId,
        password,
        tokenID,
      } = this.state;
      let {date_birth} = this.state;

      date_birth = date_birth ? this._convertDateBirth(date_birth) : null;

      let requestData = {
        first_name,
        last_name,
        city: city_id === '' ? null : city_id,
        phone,
        date_birth,
        gender: genderId,
        password,
      };

      registration(API.registration, requestData)
        .then(response => {
          response !== true
            ? this.showErrors({
                non_field_errors: [
                  t(
                    'Incorrect data entered or user with this number already exists',
                  ),
                ],
              })
            : this.props.navigation.navigate('ActivationAccount', {
                tokenID,
                phone,
                register: true,
              });
        })
        .catch(this.showErrors);
    }
  };

  render() {
    const {city, genderArray, genderId} = this.state;
    const locations = this.findLocation(city);
    const comp = (a, b) => a.trim() === b.trim();
    return (
      <View style={styles.mainView}>
        <View>
          <Image
            source={require('../images/bg_clear.jpg')}
            style={styles.bg_clear}
          />
        </View>
        <ScrollView
          style={styles.loginWrapper}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive">
          <Text style={styles.heading}>{t('Registration')}</Text>
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
            keyboardType="default"
            placeholder={t('Name')}
            style={styles.input}
            underlineColorAndroid="transparent"
            onChangeText={this._handleNameInput}
          />
          <TextInput
            keyboardType="default"
            placeholder={t('Surname')}
            style={styles.input}
            underlineColorAndroid="transparent"
            onChangeText={this._handleSurnameInput}
          />
          {/*<View style={styles.autoComplete}>*/}
          {/*  <Autocomplete*/}
          {/*    autoCapitalize="none"*/}
          {/*    autoCorrect={false}*/}
          {/*    style={styles.autoCompleteInput}*/}
          {/*    containerStyle={styles.autocompleteContainer}*/}
          {/*    inputContainerStyle={{borderWidth: 0}}*/}
          {/*    data={*/}
          {/*      locations.length === 1 && comp(city, locations[0].name)*/}
          {/*        ? []*/}
          {/*        : locations*/}
          {/*    }*/}
          {/*    defaultValue={city}*/}
          {/*    underlineColorAndroid="transparent"*/}
          {/*    onChangeText={this._handleCitySelect}*/}
          {/*    placeholder={t('Select a city')}*/}
          {/*    listContainerStyle={styles.cityListContainer}*/}
          {/*    renderItem={this.renderCityItem}*/}
          {/*  />*/}
          {/*</View>*/}
          <TextInputMask
            onChangeText={this._handleDateBirthInput}
            mask={'[00]-[00]-[0000]'}
            ref="date"
            style={styles.input}
            keyboardType="phone-pad"
            placeholder="DD-MM-YYYY"
            underlineColorAndroid="transparent"
          />
          <ModalSelector
            data={genderArray}
            cancelText={t('Cancel')}
            optionTextStyle={{color: '#000'}}
            onChange={this._handleDateBirthModal}>
            <Text style={[styles.input, {paddingTop: 5, color: '#a8a4a4'}]}>
              {this.inputValuePicker(genderId)}
            </Text>
          </ModalSelector>
          <TextInput
            ref="password"
            keyboardType="default"
            placeholder={t('Password')}
            secureTextEntry={true}
            style={styles.input}
            underlineColorAndroid="transparent"
            onChangeText={this._handlePasswordInput}
          />
          <TextInput
            ref="password"
            keyboardType="default"
            placeholder={t('Repeat your password')}
            secureTextEntry={true}
            style={styles.input}
            underlineColorAndroid="transparent"
            onChangeText={this._handleConfirmPasswordInput}
          />
          <View style={{marginBottom: 20}}>
            <TouchableOpacity
              onPress={this.postData}
              style={styles.simpleButtons}>
              <Text style={styles.simpleButtonText}>
                {t('Registration').toUpperCase()}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default Registration;

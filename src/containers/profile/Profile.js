import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import ModalSelector from 'react-native-modal-selector';
import {
  API,
  fetchList,
  isLoggedIn,
  getUser,
  updateObjectWithResponse,
  userData,
} from '../../services';
import {t} from '../../services/i18n';
import TextInputMask from 'react-native-text-input-mask';
import CityItem from '../../components/CityItem';
import styles from '../../services/styles';

class Profile extends Component {
  constructor() {
    super();
    let index = 0;
    this.state = {
      loggedIn: false,
      first_name: '',
      last_name: '',
      city: '',
      city_id: '',
      phone: '',
      date_birth: '',
      editable_date: false,
      genderId: '',
      genderArray: [
        {id: 'female', label: t('W'), key: 1},
        {id: 'male', label: t('M'), key: 2},
      ],
      location: [],
    };
    isLoggedIn().then(loggedIn => {
      if (this) {
        this.setState({loggedIn: loggedIn});
      }
      if (loggedIn) {
        getUser().then(user => {
          let correctFormatDate = '';
          if (user.date_birth !== null) {
            let dateArray = user.date_birth.split('-');
            correctFormatDate = `${dateArray[2] || ''}-${dateArray[1] || ''}-${
              dateArray[0] || ''
            }`;
          }
          if (this) {
            this.setState({
              first_name: user.first_name,
              last_name: user.last_name,
              city_id: user.city,
              phone: user.phone,
              date_birth: correctFormatDate,
              genderId: user.gender,
            });
          }
        });
      }
    });
  }

  componentDidMount() {
    fetchList(API.location)
      .then(response => {
        console.log('response', response);
        this.setState({location: response});
        return response;
      })
      .then(locations => {
        locations.filter(item => {
          if (this.state.city_id === item.id) {
            this.setState({city: item.name});
            console.log('city', item.name);
          }
          if (this.state.date_birth === null || this.state.date_birth === '') {
            this.setState({editable_date: true});
          }
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

  inputValuePicker = id => {
    let value = '';
    id.length !== 0
      ? this.state.genderArray.forEach(item => {
          item.id === id ? (value = item.label) : '';
        })
      : (value = t('Choose your gender'));
    return value;
  };

  renderCityItem = props => {
    console.log('renderCityItem', props);
    return (
      <CityItem
        key={`someKey_${props.index}`}
        name={props.item.name}
        id={props.item.id}
        handleCityChoosing={this._handleCityChoosing}
      />
    );
  };

  _handleNameInput = text => this.setState({first_name: text});

  _handleLastNameInput = text => this.setState({last_name: text});

  _handleCityInput = text => {
    this.setState({city: text});
  };

  _handleCityChoosing = (name, id) => {
    this.setState({city: name, city_id: id});
  };

  _handleDateBirthInput = (formatted, extracted) => {
    this.setState({date_birth: formatted});
  };

  _handleGenderSelection = option => {
    this.setState({genderId: option.id});
  };

  postData = () => {
    //FIXME: server format 'YYYY-MM-DD', app format 'DD-MM-YYYY', back-end busy
    let {date_birth, first_name, last_name, city_id, genderId} = this.state;
    let dateBirth = null;
    if (date_birth !== '') {
      let dateArray = date_birth.split('-');
      dateBirth = dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0];
    }
    let requestData = {
      first_name,
      last_name,
      city: city_id,
      date_birth: dateBirth,
      gender: genderId,
    };
    updateObjectWithResponse(API.profile, requestData).then(statusRequest => {
      if (statusRequest) {
        getUser().then(response => {
          response.first_name = requestData.first_name;
          response.last_name = requestData.last_name;
          response.city = requestData.city;
          response.date_birth = requestData.date_birth;
          response.gender = requestData.gender;
          userData(response);
        });
        this.props.navigation.reset({
          index: 0,
          routes: [{name: 'Home'}],
        });
      }
    });
  };

  render() {
    const {
      city,
      phone,
      first_name,
      last_name,
      editable_date,
      date_birth,
      genderArray,
      genderId,
    } = this.state;
    const locations = this.findLocation(city);

    const comp = (a, b) => a.trim() === b.trim();
    return (
      <ScrollView
        style={styles.loginWrapper}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive">
        <Text style={styles.heading}>{t('Profile')}</Text>
        <TextInput
          ref="phone"
          keyboardType="phone-pad"
          placeholder={t('Phone number')}
          style={styles.input}
          defaultValue={phone}
          editable={false}
          underlineColorAndroid="transparent"
        />
        <TextInput
          keyboardType="default"
          placeholder={t('Name')}
          defaultValue={first_name}
          style={styles.input}
          underlineColorAndroid="transparent"
          onChangeText={this._handleNameInput}
        />
        <TextInput
          keyboardType="default"
          placeholder={t('Surname')}
          defaultValue={last_name}
          style={styles.input}
          underlineColorAndroid="transparent"
          onChangeText={this._handleLastNameInput}
        />
        <View style={styles.autoComplete}>
          <SafeAreaView style={{flex: 1}}>
            <TextInput
              style={styles.autoCompleteInput}
              value={city}
              onChangeText={this._handleCityInput}
              placeholder="Find Town"
            />
            <FlatList data={locations} renderItem={this.renderCityItem} />
          </SafeAreaView>
          {/*<Autocomplete*/}
          {/*  autoCapitalize="none"*/}
          {/*  autoCorrect={false}*/}
          {/*  style={styles.autoCompleteInput}*/}
          {/*  containerStyle={styles.autocompleteContainer}*/}
          {/*  inputContainerStyle={{borderWidth: 0}}*/}
          {/*  data={locations}*/}
          {/*  // data={*/}
          {/*  //   locations.length === 1 && comp(city, locations[0].name)*/}
          {/*  //     ? []*/}
          {/*  //     : locations*/}
          {/*  // }*/}
          {/*  defaultValue={city}*/}
          {/*  underlineColorAndroid="transparent"*/}
          {/*  onChangeText={this._handleCityInput}*/}
          {/*  placeholder={t('Select a city')}*/}
          {/*  listContainerStyle={styles.cityListContainer}*/}
          {/*  renderItem={this.renderCityItem}*/}
          {/*/>*/}
        </View>
        <TextInputMask
          onChangeText={this._handleDateBirthInput}
          mask={'[00]-[00]-[0000]'}
          ref="date"
          style={styles.input}
          keyboardType="phone-pad"
          placeholder="DD-MM-YYYY"
          editable={editable_date}
          defaultValue={date_birth}
          underlineColorAndroid="transparent"
        />
        <ModalSelector
          data={genderArray}
          cancelText={t('Cancel')}
          optionTextStyle={{color: '#000'}}
          onChange={this._handleGenderSelection}>
          <Text
            style={[
              styles.input,
              {
                paddingTop: 5,
                color: '#a8a4a4',
              },
            ]}>
            {this.inputValuePicker(genderId)}
          </Text>
        </ModalSelector>
        <View style={{zIndex: -1}}>
          <TouchableOpacity
            onPress={this.postData}
            style={styles.simpleButtons}>
            <Text style={styles.simpleButtonText}>
              {t('Save').toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

export default Profile;

import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  API,
  isLoggedIn,
  getUser,
  fetchList,
  createObject,
} from '../../services';
import {t} from '../../services/i18n';
import Autocomplete from 'react-native-autocomplete-input';
import CityItem from '../../components/CityItem';
import {HocIOS} from '../../hoc/hocIOS';

class ReviewCreate extends Component {
  constructor() {
    super();
    this.state = {
      title: null,
      description: null,
      location: [],
      city: '',
      city_id: '',
    };
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

  postData = () => {
    const {theme, description, city_id} = this.state;
    if (theme && description) {
      let requestData = {
        theme,
        description,
        city: city_id,
      };
      createObject(API.comment, requestData).then(() => {
        const {navigate} = this.props.navigation;
        Alert.alert(
          '',
          t('Thank for your review'),
          [
            {
              text: 'OK',
              onPress: () => {
                navigate('Reviews');
              },
            },
          ],
          {cancelable: false},
        );
      });
    } else {
      Alert.alert(t('Missing data'));
    }
  };

  renderCityItem = ({name, id}, index) => {
    return (
      <CityItem
        key={index}
        name={name}
        id={id}
        handleCityChoosing={this._handleCityChoosing}
      />
    );
  };

  _handleThemeInput = text => this.setState({theme: text});

  _handleCityValue = text => this.setState({city: text});

  _handleDescriptionInput = text => this.setState({description: text});

  _handleCityChoosing = (name, id) => {
    this.setState({city: name, city_id: id});
  };

  render() {
    const {city} = this.state;
    const locations = this.findLocation(city);
    const comp = (a, b) => a.trim() === b.trim();
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>{t('Feedback Form')}</Text>
        <ScrollView
          style={{padding: 15}}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled">
          <HocIOS>
            <Text style={styles.label}>
              {t('Theme') + ' макс: 40 символів'}
            </Text>
            <TextInput
              keyboardType="default"
              style={styles.input}
              maxLength={40}
              underlineColorAndroid="transparent"
              onChangeText={this._handleThemeInput}
            />

            <Text style={styles.label}>{t('Select a city')}</Text>
            {/*TODO: problem with dropdown on IOS(emulator)*/}
            <View style={styles.autoCompleteView}>
              <Autocomplete
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.autoCompleteInput}
                containerStyle={styles.autocompleteContainer}
                inputContainerStyle={{borderWidth: 0}}
                data={
                  locations.length === 1 && comp(city, locations[0].name)
                    ? []
                    : locations
                }
                defaultValue={city}
                underlineColorAndroid="transparent"
                onChangeText={this._handleCityValue}
                placeholder={t('Select a city')}
                listContainerStyle={styles.autoCompletelistContainerStyle}
                renderItem={this.renderCityItem}
              />
            </View>

            <Text style={styles.label}>
              {t('Description') + ' макс: 300 символів'}
            </Text>
            <TextInput
              keyboardType="default"
              style={styles.textarea}
              multiline={true}
              maxLength={300}
              underlineColorAndroid="transparent"
              onChangeText={this._handleDescriptionInput}
            />
            <View style={{padding: 10}}>
              <TouchableOpacity
                onPress={this.postData}
                style={styles.simpleButtons}>
                <Text style={styles.simpleButtonText}>
                  {t('Send a review').toUpperCase()}
                </Text>
              </TouchableOpacity>
            </View>
          </HocIOS>
        </ScrollView>
      </View>
    );
  }
}

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
  simpleButtons: {
    height: 40,
    backgroundColor: '#e31e24',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  simpleButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  input: {
    height: 36,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
    marginBottom: 10,
    paddingLeft: 7,
    borderRadius: 4,
    paddingVertical: 0,
    paddingRight: 7,
    fontSize: 17,
  },
  textarea: {
    minHeight: 37,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
    marginBottom: 10,
    paddingLeft: 7,
    borderRadius: 4,
    paddingVertical: 0,
    paddingRight: 7,
    fontSize: 17,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  autoCompleteView: {
    marginBottom: 10,
  },
  autoCompletelistContainerStyle: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    zIndex: 2,
  },
  autoCompleteInput: {
    height: 36,
    fontSize: 17,
    backgroundColor: 'white',
    paddingLeft: 7,
    paddingVertical: 0,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#ccc',
  },
  autocompleteContainer: {
    flex: 1,
  },
  itemText: {
    fontSize: 15,
    height: 35,
    paddingLeft: 10,
    paddingTop: 5,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
});

export default ReviewCreate;

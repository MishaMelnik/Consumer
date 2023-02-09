import React, {Component} from 'react';
import {
  View,
  Text,
  Slider,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  Platform,
  Alert,
} from 'react-native';

import Loader from '../../components/Loader';
import {HocIOS} from '../../hoc/hocIOS';

import {API, createObject, updateObjectById} from '../../services';
import {t} from '../../services/i18n';

import theme from '../../services/styles';
import Bottle from '../../images/Bottle_template_50.png';

export class BeCraftRecipeStage2 extends Component {
  state = {
    isLoading: true,
    data: [],
    amountML: null,
    name: '',
    recipeIdForUpdate: null,
    errors: {},
  };

  componentDidMount() {
    const {navigation} = this.props;

    let propsData = navigation.getParam('pickedIngredients'),
      recipeIdForUpdate = navigation.getParam('recipeIdForUpdate'),
      recipeNameForUpdate = navigation.getParam('recipeNameForUpdate');

    propsData.map(item => {
      item.value = 1;
      item.valueForRange = 0.01;

      if (item.defValue) {
        item.value = item.defValue;
        item.valueForRange = item.defValue / 100;
      }
    });

    propsData.sort((first_item, second_item) => {
      return first_item.level - second_item.level;
    });

    this.setState(
      {
        data: propsData,
        isLoading: false,
        recipeIdForUpdate: recipeIdForUpdate,
        name: recipeNameForUpdate || '',
      },
      () => this._amountML(),
    );
  }

  __convertTo = value => {
    return Math.round(value * 100);
  };

  _onChangeValue = (id, value) => {
    this.setState(
      ({data}) => ({
        data: data.map(item =>
          item.id === id
            ? {...item, value: this.__convertTo(value), valueForRange: value}
            : {...item},
        ),
      }),
      () => this._amountML(),
    );
  };

  _onChangeMinusValue = id => {
    this.setState(
      ({data}) => ({
        data: data.map(item =>
          item.id === id
            ? {
                ...item,
                value: item.value - 1 < 1 ? item.value : item.value - 1,
                valueForRange:
                  item.valueForRange - 0.01 < 0.01
                    ? item.valueForRange
                    : item.valueForRange - 0.01,
              }
            : {
                ...item,
              },
        ),
      }),
      () => this._amountML(),
    );
  };

  _onChangePlusValue = id => {
    this.setState(
      ({data}) => ({
        data: data.map(item =>
          item.id === id
            ? {
                ...item,
                value: item.value + 1 > 100 ? item.value : item.value + 1,
                valueForRange:
                  item.valueForRange + 0.01 > 1
                    ? item.valueForRange
                    : item.valueForRange + 0.01,
              }
            : {
                ...item,
              },
        ),
      }),
      () => this._amountML(),
    );
  };

  _amountML = () => {
    const {data} = this.state;
    let amount = 0;

    data.map(item => {
      amount += item.value;
    });

    this.setState({
      amountML: amount,
    });
  };

  _onChangeNameOfRecipe = text => {
    let error = {};
    if (text.length >= 50) {
      error = {
        name: [t('No more than 50 characters')],
      };
    } else {
      error = {};
    }
    this.setState({
      name: text,
      errors: error,
    });
  };

  _saveRecipe = () => {
    let {data, name, recipeIdForUpdate, errors} = this.state;

    data.map(item => {
      item.ingredient = item.id;
      item.amount = item.value;
    });

    if (errors.hasOwnProperty('name')) {
      Alert.alert(
        t('Message'),
        t('Invalid data, repeat again'),
        [
          {
            text: 'OK',
          },
        ],
        {cancelable: false},
      );
    } else {
      if (recipeIdForUpdate) {
        updateObjectById(API.recipes, recipeIdForUpdate, {
          name: name,
          components: data,
        })
          .then(() => {
            this.props.navigation.navigate('BeCraft');
          })
          .catch(error => {
            console.warn('error', error);
            this.setState({
              errors: error.message,
            });
          });
      } else {
        createObject(API.recipes, {name: name, components: data})
          .then(() => {
            this.props.navigation.navigate('BeCraft');
          })
          .catch(error => {
            console.warn('error', error);
            this.setState({
              errors: error.message,
            });
          });
      }
    }
  };

  render() {
    const {isLoading, data, amountML, name, errors} = this.state;

    const list = data.map((item, index) => (
      <IngredientRangeItem
        key={`ingr_range_${index}`}
        value={name}
        data={item}
        _onChangeValue={this._onChangeValue}
        _onMinusValue={this._onChangeMinusValue}
        _onPlusValue={this._onChangePlusValue}
      />
    ));

    if (isLoading) {
      return <Loader />;
    }

    return (
      <ScrollView
        style={{flex: 1, backgroundColor: '#fff', padding: 10}}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled">
        <HocIOS>
          {list}
          <View style={styles.blockContent}>
            <View
              style={{width: '60%', paddingBottom: 7, position: 'relative'}}>
              <Text
                style={[
                  styles.label,
                  errors.hasOwnProperty('name') ? {color: '#ff0000'} : {},
                ]}>
                {t('Aroma name')}
              </Text>
              <TextInput
                style={[
                  theme.input,
                  errors.hasOwnProperty('name') ? {borderColor: '#ff0000'} : {},
                ]}
                value={name}
                maxLength={50}
                underlineColorAndroid="transparent"
                onChangeText={this._onChangeNameOfRecipe}
              />
              {errors.hasOwnProperty('name') ? (
                <Text
                  style={{
                    color: '#ff0000',
                    fontSize: 12,
                    bottom: 0,
                    position: 'absolute',
                  }}>
                  {errors.name[0]}
                </Text>
              ) : null}
              <Text style={{textAlign: 'right'}}>
                Купівля данного типу парфюмерії доступна в магазині за адресою
                м. Львів, вул. П. Куліша 3
              </Text>
            </View>
            <BottleForRecipe amountML={amountML} />
          </View>
          <View
            style={[
              styles.ingredientRangeItemContainer,
              {marginTop: 15, paddingBottom: 25},
            ]}>
            <TouchableOpacity
              onPress={this._saveRecipe}
              style={styles.saveButton}>
              <Text style={theme.simpleButtonText}>{t('Save perfume')}</Text>
            </TouchableOpacity>
          </View>
        </HocIOS>
      </ScrollView>
    );
  }
}

class IngredientRangeItem extends Component {
  _onEventMinus = () => {
    const {data, _onMinusValue} = this.props;

    _onMinusValue(data.id);
  };

  _onEventPlus = () => {
    const {data, _onPlusValue} = this.props;

    _onPlusValue(data.id);
  };

  render() {
    const {data, _onChangeValue} = this.props;

    return (
      <View style={styles.ingredientRangeItemWrapper}>
        <View style={styles.ingredientRangeItemContainer}>
          <Image
            source={{uri: data.img}}
            style={styles.ingredientRangeItemImage}
          />
          <Text style={[styles.defText]}>{data.name}</Text>
        </View>
        <View style={[styles.ingredientRangeItemContainer, {marginBottom: 10}]}>
          <Text style={[styles.defText]}>{data.value} мл</Text>
        </View>
        <View
          style={[
            styles.ingredientRangeItemContainer,
            {justifyContent: 'space-between'},
          ]}>
          <TouchableOpacity
            style={styles.controllerButton}
            onPress={this._onEventMinus}>
            <Text
              style={[
                styles.controllerText,
                {left: Platform.OS === 'ios' ? 11 : 12},
              ]}>
              -
            </Text>
          </TouchableOpacity>
          <Slider
            style={{width: '80%', height: 40}}
            minimumValue={0.01}
            maximumValue={1}
            thumbTintColor={'#ff0000'}
            value={data.valueForRange}
            // onValueChange={(value) => _onChangeValue(data.id, value)}
            onSlidingComplete={value => _onChangeValue(data.id, value)}
            minimumTrackTintColor="#000000"
            maximumTrackTintColor="#000000"
          />
          <TouchableOpacity
            style={styles.controllerButton}
            onPress={this._onEventPlus}>
            <Text style={[styles.controllerText]}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

class BottleForRecipe extends Component {
  checkSizeBottle = () => {
    const {amountML} = this.props;

    let result = {text: '', value: null};

    if (amountML <= 30) {
      result = {text: '30 мл', percent: amountML / 30};
    } else if (amountML > 30 && amountML <= 50) {
      result = {text: '50 мл', percent: amountML / 50};
    } else if (amountML > 50 && amountML <= 100) {
      result = {text: '100 мл', percent: amountML / 100};
    } else {
      result = {text: '> 100 мл', percent: 1};
    }

    return result;
  };

  render() {
    const {amountML} = this.props;
    let heightBottle = Platform.OS === 'ios' ? 55 : 61;
    return (
      <View style={styles.bottleWrapper}>
        <View style={styles.bottleContainer}>
          <Image source={Bottle} style={{position: 'absolute', zIndex: 1}} />
          <View style={{backgroundColor: '#fff', height: 23}} />
          {/*55 max height(full for ios) && 61 max height(full for android)*/}
          <View
            style={{
              backgroundColor: '#c09760',
              height: heightBottle * this.checkSizeBottle().percent,
            }}
          />
        </View>
        <Text style={[styles.bottleWrapperText, styles.defText]}>
          {amountML} мл
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  ingredientRangeItemWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 7,
    padding: 10,
    marginBottom: 10,
  },
  ingredientRangeItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  defText: {
    color: '#000',
  },
  ingredientRangeItemImage: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 40 / 2,
  },
  controllerButton: {
    width: 31,
    height: 31,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#c09760',
    position: 'relative',
  },
  controllerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    position: 'absolute',
    top: 1,
    left: Platform.OS === 'ios' ? 9 : 10,
  },
  bottleContainer: {
    backgroundColor: '#fff',
    width: 50,
    height: Platform.OS === 'ios' ? 78 : 85,
    justifyContent: 'space-between',
    position: 'relative',
  },
  bottleWrapper: {
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottleWrapperText: {
    marginTop: 15,
  },
  blockContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  label: {
    marginBottom: 7,
    color: '#000',
    fontSize: 15,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#c09760',
    borderRadius: 7,
    padding: 10,
    alignItems: 'center',
    width: '50%',
  },
});

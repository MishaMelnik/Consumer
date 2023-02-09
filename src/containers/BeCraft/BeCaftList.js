import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import Loader from '../../components/Loader';

import {t} from '../../services/i18n';
import {
  API,
  fetchList,
  fetchDetail,
  getUser,
  deleteObject,
} from '../../services';

import theme from '../../services/styles';
import QRCode from 'react-native-qrcode-svg';

export class BeCraftList extends Component {
  state = {
    isLoading: true,
    userPhone: '',
    data: [],
  };

  componentDidMount() {
    fetchList(API.recipes)
      .then(response => {
        getUser().then(user => {
          response.map(item => {
            item.opened = false;
            item.about = {};
          });

          this.setState({
            isLoading: false,
            userPhone: user.phone,
            data: response,
          });
        });
      })
      .catch(error => console.warn('error', error));
  }

  _ToggleDropdownRecipe = id => {
    if (
      this.state.data
        .filter(ingr => ingr.id === id)[0]
        .about.hasOwnProperty('components')
    ) {
      this.setState(({data}) => ({
        data: data.map(item =>
          item.id === id
            ? {...item, opened: !item.opened}
            : {...item, opened: false},
        ),
      }));
    } else {
      fetchDetail(API.recipes, id)
        .then(response => {
          response.components.map(component => {
            component.id = component.ingredient;
          });

          this.setState(({data}) => ({
            data: data.map(item =>
              item.id === id
                ? {...item, opened: !item.opened, about: response}
                : {...item, opened: false},
            ),
          }));
        })
        .catch(error => console.warn('error', error));
    }
  };

  _redirectToCreate = () => {
    const {navigation} = this.props;

    navigation.navigate('BeCraftRecipeStage1');
  };

  _redirectToUpdate = recipe => {
    const {navigation} = this.props;

    navigation.navigate('BeCraftRecipeStage1', {recipeForUpdate: recipe});
  };

  _deleteRecipe = id => {
    Alert.alert(
      t('Message'),
      t('Are you sure you want to delete the recipe?'),
      [
        {
          text: t('Yes'),
          onPress: () => {
            deleteObject(API.recipes, id)
              .then(status => {
                if (status) {
                  this.setState(({data}) => ({
                    data: data.filter(item => item.id !== id),
                  }));
                } else {
                  console.warn('error_then');
                }
              })
              .catch(error => console.warn('error', error));
          },
          style: 'cancel',
        },
        {text: t('No'), onPress: () => false},
      ],
    );
  };

  render() {
    const {isLoading, data, userPhone} = this.state;

    const list = data.map((item, index) => (
      <RecipeItem
        key={`list_recipe_index_${index}`}
        data={item}
        userPhone={userPhone}
        _ToggleDropdownRecipe={this._ToggleDropdownRecipe}
        _deleteRecipe={this._deleteRecipe}
        _redirectToUpdate={this._redirectToUpdate}
      />
    ));
    if (isLoading) {
      return <Loader />;
    }

    return (
      <ScrollView style={{flex: 1, backgroundColor: '#fff', padding: 10}}>
        <View style={{marginTop: 10, marginBottom: 20}}>
          <Text style={theme.heading}>{t('Your perfumes')}</Text>
        </View>
        {list}
        <View style={styles.redirectToContainer}>
          <TouchableOpacity
            style={styles.redirectToButton}
            onPress={this._redirectToCreate}>
            <Text style={styles.redirectToButtonText}>
              {t('Create perfume')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

class RecipeItem extends Component {
  _event = () => {
    const {data, _ToggleDropdownRecipe} = this.props;

    _ToggleDropdownRecipe(data.id);
  };
  render() {
    const {data, userPhone, _deleteRecipe, _redirectToUpdate} = this.props;

    return (
      <View style={styles.recipeWrapper}>
        <TouchableOpacity
          style={[
            styles.recipeItemContainer,
            data.opened ? {backgroundColor: '#c09760'} : {},
          ]}
          onPress={this._event}>
          <Text style={[styles.defText, styles.recipeItemTitle]}>
            {data.name}
          </Text>
          <Icon
            name={`chevron-${data.opened ? 'up' : 'down'}`}
            size={16}
            color={'#fff'}
          />
        </TouchableOpacity>
        {data.opened ? (
          <View style={styles.dropdownWrapper}>
            <AboutRecipe
              recipeId={data.id}
              data={data.about}
              userPhone={userPhone}
              _deleteRecipe={_deleteRecipe}
              _redirectToUpdate={_redirectToUpdate}
            />
          </View>
        ) : null}
      </View>
    );
  }
}

class AboutRecipe extends Component {
  _delete_event = () => {
    const {recipeId, _deleteRecipe} = this.props;

    _deleteRecipe(recipeId);
  };

  _update_event = () => {
    const {data, _redirectToUpdate} = this.props;

    _redirectToUpdate(data);
  };

  render() {
    const {data, userPhone} = this.props;
    const components = data.components.map((component, index) => (
      <View key={`component_index_${index}`} style={styles.recipeComponentItem}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={{uri: component.ingredient_img}}
            style={styles.recipeComponentImg}
          />
          <Text style={[styles.defText]}>{component.ingredient_name}</Text>
        </View>
        <Text style={[styles.defText, styles.componentsAmount]}>
          {component.amount} мл
        </Text>
      </View>
    ));
    return (
      <View>
        {components}
        <View style={styles.qrCodeContainer}>
          <QRCode
            value={JSON.stringify({phone: userPhone, recipeId: data.id})}
            size={200}
            backgroundColor="#c09760"
          />
        </View>
        <View style={styles.controllerWrapper}>
          <TouchableOpacity
            onPress={this._update_event}
            style={styles.controllerContainerItem}>
            <Icon name="pencil" size={25} color={'#2576f9'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this._delete_event}
            style={styles.controllerContainerItem}>
            <Icon name="trash" size={25} color={'#ff0000'} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  redirectToContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 15,
  },
  defText: {
    color: '#000',
  },
  redirectToButton: {
    backgroundColor: '#c09760',
    borderRadius: 7,
    padding: 10,
    alignItems: 'center',
    width: '50%',
  },
  redirectToButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  recipeWrapper: {
    marginBottom: 10,
  },
  recipeItemContainer: {
    padding: 15,
    width: '100%',
    borderRadius: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#977060',
  },
  recipeItemTitle: {
    fontWeight: 'bold',
    color: '#fff',
  },
  dropdownWrapper: {
    minHeight: 100,
    padding: 10,
    paddingTop: 20,
    marginTop: -3,
    borderTopWidth: 0,
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
  },
  recipeComponentItem: {
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    justifyContent: 'space-between',
  },
  componentsAmount: {},
  recipeComponentImg: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    marginRight: 10,
  },
  qrCodeContainer: {
    alignItems: 'center',
  },
  controllerWrapper: {
    marginTop: 10,
    borderRadius: 7,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  controllerContainerItem: {
    padding: 7,
    marginRight: 7,
  },
});

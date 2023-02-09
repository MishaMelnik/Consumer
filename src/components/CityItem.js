import React, {Component} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import styles from '../services/styles';

export default class CityItem extends Component {
  _onPress = () => {
    const {handleCityChoosing, name, id} = this.props;
    handleCityChoosing(name, id);
  };

  render() {
    const {name} = this.props;

    return (
      <TouchableOpacity
        style={{borderWidth: 0, color: '#000'}}
        onPress={this._onPress}>
        <Text style={styles.itemText}>{name}</Text>
      </TouchableOpacity>
    );
  }
}

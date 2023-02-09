import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {View, Text, TouchableOpacity} from 'react-native';
import {isLoggedIn, logout} from '../services';
import {t} from '../services/i18n';
import styles from '../services/styles';

class AuthDrawerBar extends Component {
  constructor() {
    super();
    this.state = {
      loggedIn: false,
    };
    isLoggedIn()
      .then(loggedIn => {
        if (this._isMount) {
          this.setState({loggedIn: loggedIn});
        }
      })
      .catch(e => console.error(e));
  }

  componentWillUnmount() {
    this._isMount = false;
  }

  componentDidMount() {
    this._isMount = true;
  }

  login = () => this.props.navigation.navigate('Login');

  _logout = () => {
    logout();
    this.props.navigation.reset({
      index: 0,
      routes: [{name: 'Home'}],
    });
  };

  render() {
    const {loggedIn} = this.state;
    return (
      <TouchableOpacity
        underlayColor="transparent"
        onPress={loggedIn ? this._logout : this.login}>
        <View style={styles.drawerItem}>
          <Icon
            color="#706d6d"
            style={{width: 23, textAlign: 'center', marginRight: 4}}
            name="sign-out"
            size={16}
          />
          <Text style={styles.drawerItemText}>
            {loggedIn ? t('Go out') : t('Sign in')}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export default AuthDrawerBar;

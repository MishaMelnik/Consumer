import React, {Component} from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableHighlight,
  StyleSheet,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  API,
  getBonus,
  getUser,
  isLoggedIn,
  userData,
  fetchList,
} from '../services';
import AuthDrawerBar from '../components/AuthDrawerBar';

import {t} from '../services/i18n';

import BECRAFTLOGO from '../images/be_craft_logo.png';

const UserPages = [
  {title: t('Campaigns'), screen: 'Home', icon: 'list'},
  {title: t('Loyalty Program Terms'), screen: 'LoyaltyTerms', icon: 'percent'},
  {title: t('SocialMedia'), screen: 'SocialMedia', icon: 'comments'},
];

const ConsumerPages = [
  {title: t('Campaigns'), screen: 'Home', icon: 'list'},
  {title: t('Product Catalog'), screen: 'Catalog', icon: 'shopping-bag'},
  {title: t('My purchases'), screen: 'PurchasesList', icon: 'shopping-cart'},
  {title: t('Profile'), screen: 'Profile', icon: 'user'},
  {title: t('Change password'), screen: 'ChangePassword', icon: 'key'},
  {title: t('My QR-code'), screen: 'QRcode', icon: 'qrcode'},
  {title: t('Push-notifications history'), screen: 'PushHistory', icon: 'bell'},
  {title: t('Reviews and Suggestions'), screen: 'Reviews', icon: 'edit'},
  {title: t('Loyalty Program Terms'), screen: 'LoyaltyTerms', icon: 'percent'},
  {title: t('Perfume shop'), screen: 'BeCraft', icon: 'flask'},
  {title: t('SocialMedia'), screen: 'SocialMedia', icon: 'comments'},
];

const UserInformation = props => {
  const {bonus, name, surname} = props;
  return (
    <View style={styles.drawerHeader}>
      <View style={styles.drawerHeaderBalanceContainer}>
        <Text style={styles.balance}>{bonus} UAH</Text>
      </View>
      <Text style={styles.nameSurname}>{name}</Text>
      <Text style={styles.nameSurname}>{surname}</Text>
    </View>
  );
};

const DrawerItems = props => {
  const {loggedIn, pushes, comments, is_show_craft} = props;
  const {navigate} = props.navigation;
  let pages = UserPages;
  if (loggedIn) {
    pages = ConsumerPages;
  }
  return (
    <View>
      {pages.map((item, index) => {
        return (
          <DrawerItem
            item={item}
            key={index.toString()}
            pushes={pushes}
            comments={comments}
            navigate={navigate}
            is_show_craft={is_show_craft}
          />
        );
      })}
    </View>
  );
};

class DrawerItem extends Component {
  _goTo = () => {
    const {item, navigate} = this.props;
    navigate(item.screen);
  };

  render() {
    const {item, comments, pushes, is_show_craft} = this.props;

    if (item.screen === 'BeCraft') {
      if (!is_show_craft) {
        return null;
      } else {
        return (
          <TouchableHighlight underlayColor="transparent" onPress={this._goTo}>
            <View
              style={{
                paddingLeft: 5,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={BECRAFTLOGO}
                style={{width: 30, height: 36, marginRight: 2}}
                resizeMode={'contain'}
              />
              <View style={{alignItems: 'center'}}>
                <View style={{borderRadius: 7, backgroundColor: '#977060'}}>
                  <Text
                    style={[
                      styles.drawerItemText,
                      {padding: 5, color: '#fff', fontWeight: 'bold'},
                    ]}>
                    {item.title}
                  </Text>
                </View>
                <Text style={{color: '#333', marginTop: 1, fontSize: 13}}>
                  м. Львів, вул. П. Куліша 3
                </Text>
              </View>
            </View>
          </TouchableHighlight>
        );
      }
    }

    return (
      <TouchableHighlight underlayColor="transparent" onPress={this._goTo}>
        <View style={styles.drawerItem}>
          {/*<Icon color="#706d6d" style={{width: 50}} name={item.icon} size={16}/>*/}
          <Icon
            color="#706d6d"
            style={styles.styleForIconsInDrawer}
            name={item.icon}
            size={16}
          />
          <Text style={styles.drawerItemText}>{item.title}</Text>
          {item.screen === 'Reviews' || item.screen === 'PushHistory' ? (
            <View
              style={
                comments > 0 && item.screen === 'Reviews'
                  ? styles.rowDrawerNumber
                  : pushes > 0 && item.screen === 'PushHistory'
                  ? styles.rowDrawerNumber
                  : {display: 'none'}
              }>
              <Text style={styles.rowDrawerText}>
                {item.screen === 'Reviews' ? comments : pushes}
              </Text>
            </View>
          ) : null}
        </View>
      </TouchableHighlight>
    );
  }
}

class Drawer extends Component {
  constructor() {
    super();
    this.state = {
      user: {},
      loggedIn: false,
      comment: 0,
      push: 0,
      drawerProps: '',
      is_show_craft: false,
    };
    isLoggedIn().then(loggedIn => {
      if (this) {
        this.setState({loggedIn: loggedIn});
      }
      if (loggedIn) {
        getUser().then(user => this.setState({user: user}));
      }
    });
  }

  componentDidMount() {
    // if (AppState.currentState === 'active') {
    isLoggedIn().then(isLoggedIn => {
      if (isLoggedIn === true) {
        let timerForPushes = setInterval(() => this.getNumbers(), 10 * 1000);
        this.setState({timerForPushes});
      }
    });
    // }
  }

  componentWillUnmount() {
    clearInterval(this.state.timerForPushes);
  }

  refreshBonus() {
    getBonus(API.bonus)
      .then(response => this.setState({newBonus: response.bonus}))
      .then(() =>
        getUser().then(user => {
          user.bonus = this.state.newBonus;
          this.setState({user: user});
          userData(user);
        }),
      );
  }

  getNumbers() {
    fetchList(API.digits).then(response => {
      this.setState({
        push: response.push,
        comment: response.comment,
        is_show_craft: response.is_show_craft || false,
      });
    });
    this.refreshBonus();
  }

  render() {
    const props = this.props.drawerProps;
    const {user, loggedIn, push, comment, is_show_craft} = this.state;

    return (
      <ScrollView contentContainerStyle={styles.container}>
        {loggedIn ? (
          <UserInformation
            name={user.first_name === '' ? user.phone : user.first_name}
            surname={user.last_name}
            bonus={user.bonus}
          />
        ) : null}
        <View style={styles.drawerItemsContainer}>
          {loggedIn ? (
            <ScrollView>
              <View>
                <DrawerItems
                  {...props}
                  loggedIn={loggedIn}
                  pushes={push}
                  comments={comment}
                  is_show_craft={is_show_craft}
                />
                <AuthDrawerBar navigation={props.navigation} />
              </View>
            </ScrollView>
          ) : (
            <View>
              <DrawerItems {...props} />
              <AuthDrawerBar navigation={props.navigation} />
            </View>
          )}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerHeader: {
    backgroundColor: '#efefef',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  drawerHeaderBalanceContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  drawerItemsContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  balance: {
    margin: 10,
    fontSize: 16,
  },
  nameSurname: {
    margin: 6,
    fontSize: 16,
    textAlign: 'center',
  },

  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
  },
  drawerItemText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  rowDrawer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowDrawerNumber: {
    marginLeft: 4,
    backgroundColor: '#ededed',
    borderRadius: 10,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 4,
    paddingRight: 4,
    borderWidth: 1,
    borderColor: '#e31e24',
  },
  rowDrawerText: {
    fontSize: 13,
    color: '#e31e24',
  },

  styleForIconsInDrawer: {
    width: 23,
    textAlign: 'center',
    marginRight: 4,
  },
});

export default Drawer;

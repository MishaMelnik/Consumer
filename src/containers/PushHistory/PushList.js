import React, {Component} from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import Autolink from 'react-native-autolink';

import Icon from 'react-native-vector-icons/FontAwesome';
import {API, isLoggedIn, getUser, fetchList} from '../../services';
import Loader from '../../components/Loader';
import {t} from '../../services/i18n';
import styles from '../../services/styles';
import {logout} from '../../services';

class Push extends Component {
  render() {
    const {data} = this.props;

    let backgroundColor = '#fff',
      color = '#fff';
    if (!this.props.data.is_read) {
      backgroundColor = '#cecccc';
      color = '#e31e24';
    }
    return this.props.data.promo ? (
      <TouchableOpacity
        style={{
          backgroundColor: backgroundColor,
          marginBottom: 15,
          padding: 5,
          borderRadius: 5,
        }}
        onPress={this.props.onPress}>
        <View>
          <View style={[styles.comment, {borderColor: '#dd7578'}]}>
            <View style={styles.rowSpaceBetween}>
              <Text style={styles.textReview}>{data.title}</Text>
              <Icon name="bell" size={20} color={color} />
            </View>
            {/* <Text style={styles.textReview}>{data.body}</Text>      */}

            <Text style={styles.textReview}>
              <Autolink text={data.body} />
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    ) : (
      <View
        style={{
          backgroundColor: backgroundColor,
          marginBottom: 15,
          padding: 5,
          borderRadius: 5,
        }}>
        <View>
          <View style={styles.comment}>
            <View style={styles.rowSpaceBetween}>
              <Text style={styles.textReview}>{data.title}</Text>
              <Icon name="bell" size={20} color={color} />
            </View>

            <Text style={styles.textReview}>
              <Autolink text={data.body} />
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

class PushItem extends Component {
  _onPress = () => {
    const {navigate, data} = this.props;
    navigate('CampaignDetails', {id: data.promo});
  };

  render() {
    const {data} = this.props;

    return <Push data={data} onPress={this._onPress} />;
  }
}

class PushList extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      history: [],
    };
  }

  componentDidMount() {
    isLoggedIn()
      .then(loggedIn => {
        if (loggedIn) {
          this.loadData();
          const loadDataTimer = setTimeout(() => this.loadData(), 3000);
          this.setState({loadDataTimer});
        } else {
          logout();
          this.props.navigation.reset({
            index: 0,
            routes: [{name: 'Home'}],
          });
        }
      })
      .catch(e => console.error(e));
  }

  componentWillUnmount() {
    clearInterval(this.state.loadDataTimer);
  }

  _keyExtractor = (item, index) => index.toString();

  loadData = () => {
    fetchList(API.pushHistory)
      .then(response => {
        if (Array.isArray(response)) {
          this.setState({
            history: response,
            isLoading: false,
          });
        } else {
          this.showErrors({error: response.detail});
        }
      })
      .catch(e => {
        if (e.message === 'Unauthorized') {
          logout();
          this.props.navigation.reset({
            index: 0,
            routes: [{name: 'Home'}],
          });
        }
      });
  };

  showErrors = error => alert(error.error);

  renderPushItem = ({item}, index) => {
    const {navigate} = this.props.navigation;
    return <PushItem data={item} key={index} navigate={navigate} />;
  };

  render() {
    const {isLoading, history} = this.state;

    return isLoading ? (
      <Loader />
    ) : (
      <View style={styles.pushListContainer}>
        <Text style={styles.heading}>{t('Push-notifications history')}</Text>

        <FlatList
          data={history}
          refreshing={isLoading}
          keyExtractor={this._keyExtractor}
          onRefresh={this.loadData}
          renderItem={this.renderPushItem}
        />
      </View>
    );
  }
}

export default PushList;

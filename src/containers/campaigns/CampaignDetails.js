import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loader from '../../components/Loader';
import {API, fetchDetail, isLoggedIn} from '../../services';
import {t} from '../../services/i18n';
import styles from '../../services/styles';
import Autolink from 'react-native-autolink';

class CampaignDetails extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    const campaignState = this.props.route;
    fetchDetail(API.campaigns, campaignState.params.id)
      .then(detailsJSON => this.setState(detailsJSON))
      .then(() => this.setState({loading: false}));
    isLoggedIn().then(loggedIn => {
      this.setState({loggedIn: loggedIn});
    });
  }

  static navigationOptions = () => {
    return {
      drawerLabel: t('Campaigns'),
      drawerIcon: <Icon name="list" size={16} />,
    };
  };

  _goTo = () => {
    const {loggedIn} = this.state;
    const {navigate} = this.props.navigation;
    navigate(loggedIn ? 'QRcode' : 'Login');
  };

  render() {
    const {
      loading,
      logo,
      title,
      date_start,
      date_end,
      description,
      life_status,
    } = this.state;
    return loading ? (
      <Loader />
    ) : (
      <View style={styles.detailContainer}>
        <ScrollView>
          <View style={styles.logoCanvas}>
            <Image
              resizeMode={logo ? 'cover' : 'contain'}
              style={styles.campaignDetailLogo}
              defaultSource={require('../../images/logo_words.png')}
              source={
                logo ? {uri: logo} : require('../../images/logo_words.png')
              }
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.campaignTitle}>{title}</Text>
            <View style={styles.campaignDates}>
              <Icon
                name="calendar"
                size={18}
                style={styles.campaignDatesIcon}
              />
              <Text style={styles.campaignDatesText}>
                {date_start} - {date_end}
              </Text>
            </View>
            <Text style={styles.campaignDescription}>
              <Autolink text={description} />
            </Text>
          </View>
          <View
            style={
              life_status === 'past' || life_status === 'future'
                ? {display: 'none'}
                : styles.paddingButton
            }>
            <TouchableOpacity
              onPress={this._goTo}
              style={[styles.simpleButtons, {backgroundColor: '#e31e24'}]}>
              <Text style={styles.simpleButtonText}>
                {t('Take advantage of').toUpperCase()}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default CampaignDetails;

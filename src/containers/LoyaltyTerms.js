import React, {Component} from 'react';
import {
  ScrollView,
  Dimensions,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import RenderHtml from 'react-native-render-html';

import {API, fetchList} from '../services';
import {t} from '../services/i18n';
import styles from '../services/styles';
import Loader from '../components/Loader';

export default class LoyaltyTerms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fromRegister: props.route?.params?.register || false,
      htmlContent: {html: ''},
      loading: true,
    };
  }

  componentDidMount() {
    fetchList(API.loyalty)
      .then(
        res =>
          res &&
          this.setState({
            htmlContent: {html: res.text},
            loading: res.text && false,
          }),
      )
      .catch(e => {});
  }

  goToRegistration = () => {
    this.props.navigation.navigate('Registration');
  };

  goBack = () => {
    this.props.navigation.goBack();
  };

  render() {
    const {htmlContent, fromRegister, loading} = this.state;
    return loading ? (
      <Loader />
    ) : (
      <View style={{flex: 1}}>
        <ScrollView
          style={{flex: 1, padding: 10, marginBottom: fromRegister ? 50 : 0}}>
          <RenderHtml
            contentWidth={Dimensions.get('window').width}
            source={htmlContent}
            enableExperimentalMarginCollapsing={true}
          />
        </ScrollView>
        {fromRegister && (
          <View style={local.buttonsView}>
            <TouchableOpacity
              style={styles.simpleButtons}
              onPress={this.goBack}>
              <Text style={styles.simpleButtonText}>{t('Disagree')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.simpleButtons}
              onPress={this.goToRegistration}>
              <Text style={styles.simpleButtonText}>{t('Apply')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

const local = {
  buttonsView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 20,
    position: 'absolute',
    bottom: 10,
    right: 10,
    left: 10,
    height: 40,
  },
};

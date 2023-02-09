import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
import {isLoggedIn, getUser} from '../services';
import {t} from '../services/i18n';
import QRCode from 'react-native-qrcode-svg';

class qrCode extends Component {
  constructor() {
    super();
    this.state = {
      qRCode: '',
    };
    isLoggedIn().then(loggedIn => {
      if (this) {
        this.setState({loggedIn: loggedIn});
      }
      if (loggedIn) {
        getUser().then(user =>
          this.setState({
            qRCode: user.phone,
          }),
        );
      }
    });
  }

  render() {
    console.log('this.state.qRCode', this.state.qRCode);
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>QR code</Text>
        <Text>
          {t(
            'To make a purchase - show this code to the seller at the point of sale Perfums Bar',
          )}
        </Text>
        <View style={styles.containerQRCode}>
          <QRCode
            // value={this.state.qRCode}
            value={JSON.stringify({phone: this.state.qRCode})}
            size={200}
            color="white"
            backgroundColor="red"
          />
        </View>
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
    marginBottom: 30,
  },
  containerQRCode: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingTop: 50,
  },
});

export default qrCode;

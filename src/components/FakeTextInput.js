import React, {Component} from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';

import styles from '../services/styles';

export class FakeTextInput extends Component {
  render() {
    const {v} = this.props;
    return (
      <View style={localStyles.textViaInputView}>
        <Text style={localStyles.textViaInputText}>
          {/*{value}*/}
          {`${v[0] + v[1] + v[2]} (${v[3] + v[4] + v[5]}) ${
            v[6] + v[7] + v[8]
          } ${v[9] + v[10]} ${v[11] + v[12]}`}
        </Text>
      </View>
    );
  }
}

const localStyles = StyleSheet.create({
  textViaInputView: {
    ...styles.input,
    paddingTop: Platform.OS === 'ios' ? 7 : 5,
    borderRadius: 4,
  },
  textViaInputText: {
    color: '#000',
    fontSize: 17,
  },
});

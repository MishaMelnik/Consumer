import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {API, fetchDetail} from '../../services';
import Loader from '../../components/Loader';
import {t} from '../../services/i18n';

class ReviewCreate extends Component {
  constructor() {
    super();
    this.state = {
      detail: '',
      isLoading: true,
    };
  }

  componentDidMount() {
    const reviewState = this.props.navigation.state;
    fetchDetail(API.comment, reviewState.params.id)
      .then(response => {
        this.setState({
          detail: response,
          isLoading: false,
        });
      })
      .catch(e => console.error(e));
  }

  render() {
    this.props.navigation.state.params.backFunction();
    if (!this.state.isLoading) {
      return (
        <ScrollView style={styles.container}>
          <Text style={styles.heading}>{this.state.detail.theme}</Text>
          <View>
            <View style={styles.comment}>
              <Text>
                {t('City')}: {this.state.detail.city || t('Not selected')}
              </Text>
              <Text style={styles.textReview}>
                {this.state.detail.description}
              </Text>
            </View>
            {this.state.detail.feedback !== null ? (
              <View style={styles.feedback}>
                <Text>
                  {' '}
                  {t('Author')}:{' '}
                  {this.state.detail.feedback.author !== ''
                    ? this.state.detail.feedback.author
                    : ''}
                </Text>
                <Text style={styles.textReview}>
                  {' '}
                  {this.state.detail.feedback.description}
                </Text>
              </View>
            ) : (
              <View />
            )}
          </View>
        </ScrollView>
      );
    }

    return <Loader />;
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
    marginBottom: 20,
  },
  comment: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    width: '95%',
    borderRadius: 5,
    marginBottom: 4,
    backgroundColor: '#fff',
  },
  feedback: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    width: '95%',
    marginLeft: 15,
    borderRadius: 5,
    marginBottom: 4,
    backgroundColor: '#fff',
  },
  cityReview: {
    color: '#000',
  },
  textReview: {
    fontSize: 16,
    color: '#000000',
  },
});

export default ReviewCreate;

import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import {API, isLoggedIn, getUser, fetchList} from '../../services';
import Loader from '../../components/Loader';
import {t} from '../../services/i18n';

class Review extends Component {
  render() {
    const {data, onPress} = this.props;

    let backgroundColor = data.unread ? '#cecccc' : '#fff',
      color = data.unread ? '#e31e24' : '#fff';

    return (
      <TouchableOpacity
        style={[styles.reviewContainer, {backgroundColor: backgroundColor}]}
        onPress={onPress}>
        <View>
          <View style={styles.comment}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text>
                {t('City')}: {data.city || t('Not selected')}
              </Text>
              <Icon name="bell" size={20} color={color} />
            </View>
            <Text style={styles.textReview}>
              {t('Theme')}: {data.theme}
            </Text>
            <Text style={styles.textReview}>{data.description}</Text>
          </View>
          {this.props.data.feedback !== null ? (
            <View style={styles.feedback}>
              <Text>
                {' '}
                {t('Author')}:{' '}
                {data.feedback.author !== undefined ? data.author : ''}
              </Text>
              <Text style={styles.textReview}>
                {' '}
                {data.feedback.description || ''}
              </Text>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  }
}

class ReviewItem extends Component {
  _onPress = () => {
    const {navigate, data, loadData} = this.props;
    navigate('ReviewDetail', {id: data.id, backFunction: loadData});
  };
  render() {
    const {data, navigate} = this.props;
    return <Review data={data} navigate={navigate} onPress={this._onPress} />;
  }
}

class RevAndSugList extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      reviewsList: [],
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    fetchList(API.comment)
      .then(response => {
        this.setState({
          reviewsList: response,
          isLoading: false,
        });
      })
      .catch(e => console.error(e));
  };

  _GoToCreateReview = () => {
    const {navigate} = this.props.navigation;
    navigate('ReviewCreate');
  };

  renderReviewList = ({item}) => {
    const {navigate} = this.props.navigation;
    return (
      <ReviewItem data={item} navigate={navigate} loadData={this.loadData} />
    );
  };

  _keyExtractor = (item, index) => index.toString();

  render() {
    const {isLoading, reviewsList} = this.state;

    return !isLoading ? (
      <View style={styles.container}>
        <Text style={styles.heading}>{t('Reviews and Suggestions')}</Text>
        <FlatList
          data={reviewsList}
          refreshing={isLoading}
          keyExtractor={this._keyExtractor}
          onRefresh={this.loadData}
          renderItem={this.renderReviewList}
        />
        <View style={{padding: 10}}>
          <TouchableOpacity
            onPress={this._GoToCreateReview}
            style={styles.simpleButtons}>
            <Text style={styles.simpleButtonText}>
              {t('Leave a review').toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    ) : (
      <Loader />
    );
  }
}

const styles = StyleSheet.create({
  reviewItemHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reviewContainer: {
    backgroundColor: '#fff',
    marginBottom: 15,
    padding: 5,
    borderRadius: 5,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 5,
  },
  heading: {
    textAlign: 'center',
    fontSize: 22,
    marginBottom: 30,
  },
  simpleButtons: {
    height: 40,
    backgroundColor: '#e31e24',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  simpleButtonText: {
    fontSize: 18,
    color: '#fff',
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

export default RevAndSugList;

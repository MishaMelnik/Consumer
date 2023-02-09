import React, {Component} from 'react';
import {View, Text, FlatList} from 'react-native';
import {API, fetchList, isLoggedIn} from '../../services';
import {t} from '../../services/i18n';
import styles from '../../services/styles';

class SaleListItem extends Component {
  _keyExtractor = (item, index) => index.toString();

  saleItem = ({item}) => (
    <View style={styles.salesListItem}>
      <View style={styles.salesListItemContent}>
        <Text style={styles.purchaseCampaignName}>
          <Text style={{fontWeight: 'bold'}}>{t('Goods')}: </Text>
          {item.product}
        </Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.purchaseCampaignName}>
            <Text style={{fontWeight: 'bold'}}>{t('Qty')}: </Text>
            {item.quantity}
          </Text>
          <Text style={styles.purchaseCampaignName}>
            <Text style={{fontWeight: 'bold'}}>{t('Price')}: </Text>
            {item.price}
          </Text>
        </View>
      </View>
    </View>
  );

  render() {
    const {data} = this.props;
    return (
      <View style={styles.purchaseListMainView}>
        <View style={{width: '100%'}}>
          <Text style={styles.campaignNameLine}>{data.date}</Text>
          <Text style={styles.purchaseCampaignName}>
            <Text style={{fontWeight: 'bold'}}>{t('Sale')}:</Text>{' '}
            {data.promo ? data.promo : t('Without sale')}
          </Text>
          <FlatList
            data={data.products}
            keyExtractor={this._keyExtractor}
            renderItem={this.saleItem}
          />
          <View style={styles.campaignDetails}>
            <Text style={styles.purchaseCampaignName}>
              <Text style={{fontWeight: 'bold'}}>{t('Sum')}:</Text> {data.sum}
            </Text>
            <Text style={styles.purchaseCampaignName}>
              <Text style={{fontWeight: 'bold'}}>{t('Bonuses')}:</Text>{' '}
              {data.bonus}
            </Text>
            <Text style={styles.purchaseCampaignName}>
              <Text style={{fontWeight: 'bold'}}>{t('Result')}:</Text>{' '}
              {data.total}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

class PurchaseList extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    fetchList(API.sales).then(response => {
      this.setState({
        salesList: response,
        isLoading: false,
      });
    });
  };

  _keyExtractor = (item, index) => index.toString();

  render() {
    const {salesList, isLoading} = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>{t('My purchases')}</Text>
        <FlatList
          data={salesList}
          refreshing={isLoading}
          keyExtractor={this._keyExtractor}
          onRefresh={this.loadData}
          renderItem={({item}) => <SaleListItem data={item} />}
        />
      </View>
    );
  }
}

export default PurchaseList;

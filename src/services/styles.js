import {Dimensions, StyleSheet} from 'react-native';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

let styles;
export default styles = StyleSheet.create({
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
  campaignList: {
    flex: 1,
    backgroundColor: 'white',
  },
  campaignListItem: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  campaignListItemPast: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
    opacity: 0.5,
  },
  campaignLogo: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  campaignName: {
    fontSize: 16,
    flex: 1,
    color: '#666',
    fontWeight: '500',
  },
  purchaseListMainView: {
    borderColor: '#ccc',
    margin: 5,
    borderWidth: 1,
    borderRadius: 3,
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    width: '97%',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 15,
  },
  campaignNameLine: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor: '#ccc',
  },
  salesListItem: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    width: '100%',
  },
  salesListItemContent: {
    paddingLeft: 15,
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    width: '100%',
  },
  purchaseCampaignName: {
    fontSize: 16,
    marginRight: 10,
    paddingLeft: 10,
  },
  campaignDetails: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    width: '100%',
    flexWrap: 'wrap',
  },
  detailContainer: {
    borderTopWidth: 1,
    borderTopColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    flex: 1,
  },
  logoCanvas: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#e31e24',
  },
  campaignDetailLogo: {
    flex: 1,
    alignSelf: 'stretch',
    width: null,
    height: 150,
  },
  textContainer: {
    padding: 10,
  },
  campaignTitle: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 15,
  },
  paddingButton: {
    padding: 20,
  },
  campaignDates: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  campaignDatesText: {
    fontSize: 14,
    color: '#888',
  },
  campaignDatesIcon: {
    marginRight: 5,
    color: '#888',
  },
  campaignDescription: {
    textAlign: 'justify',
  },
  deviderContainer: {
    alignItems: 'center',
    backgroundColor: '#e31c22',
    padding: 7,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  deviderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    paddingRight: 5,
  },
  deviderButton: {
    width: '40%',
    backgroundColor: 'green',
    alignItems: 'center',
    borderRadius: 6,
  },
  cityListContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    zIndex: 2,
  },
  loginWrapper: {
    padding: 10,
    display: 'flex',
    flex: 1,
  },
  autocompleteContainer: {
    flex: 1,
  },
  pushListContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 5,
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
  textReview: {
    fontSize: 16,
    color: '#000000',
  },
  rowSpaceBetween: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mainView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  forgotPasswordBtn: {
    textAlign: 'center',
    marginTop: 10,
  },
  loginContainer: {
    width: '100%',
    height: height,
    display: 'flex',
    flex: 1,
    justifyContent: 'space-between',
    alignContent: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: 'transparent',
  },
  loginContent: {
    display: 'flex',
    flexGrow: 1,
    flexShrink: 0,
    width: 220,
    marginLeft: 'auto',
    marginRight: 'auto',
    alignContent: 'center',
    justifyContent: 'center',
  },
  simpleButtons: {
    height: 40,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  simpleButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  logoImage: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
    top: 10,
    left: 0,
  },
  bg_clear: {
    flex: 1,
    width: width,
    height: height,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  input: {
    height: 36,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
    marginBottom: 10,
    paddingLeft: 7,
    borderRadius: 4,
    paddingVertical: 0,
    paddingRight: 7,
    fontSize: 17,
    zIndex: -1,
  },
  inputView: {
    height: 36,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
    marginBottom: 10,
    paddingLeft: 7,
    borderRadius: 4,
    paddingVertical: 0,
    paddingRight: 7,
    zIndex: -1,
  },
  autoComplete: {
    marginBottom: 10,
    zIndex: 5,
  },
  autoCompleteInput: {
    height: 36,
    fontSize: 17,
    backgroundColor: 'white',
    paddingLeft: 7,
    paddingVertical: 0,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#ccc',
  },
  heading: {
    textAlign: 'center',
    fontSize: 22,
    marginBottom: 10,
    backgroundColor: 'transparent',
  },
  autoCompletelistContainerStyle: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    zIndex: 2,
  },
  itemText: {
    fontSize: 15,
    height: 35,
    paddingLeft: 10,
    paddingTop: 5,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  buttons: {
    height: 50,
    display: 'flex',
    justifyContent: 'space-around',
  },
  catalogItemNew: {
    position: 'absolute',
    justifyContent: 'center',
    left: -18,
    top: 7,
    width: 66,
    height: 20,
    zIndex: 5,
    backgroundColor: '#ff0000',
    transform: [{rotate: '-45deg'}],
  },
  catalogItemTextNew: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 13,
  },
  messageFromCatalogContainer: {
    padding: 10,
  },
  messageFromCatalogContainerText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
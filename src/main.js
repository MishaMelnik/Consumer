import 'react-native-gesture-handler';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {TouchableHighlight, Dimensions} from 'react-native';
// import {getUser, isLoggedIn} from '../../services';
// import FCM, {
//   FCMEvent,
//   RemoteNotificationResult,
//   WillPresentNotificationResult,
//   NotificationType,
// } from 'react-native-fcm';
import {
  useNavigation,
  NavigationContainer,
  DrawerActions,
} from '@react-navigation/native';

import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';

import CampaignList from './containers/campaigns/CampaignList';
import CampaignDetails from './containers/campaigns/CampaignDetails';
import Login from './containers/Login';
import Drawer from './components/Drawer';
import PurchasesList from './containers/purchases/PurchaseList';
import Profile from './containers/profile/Profile';
import ChangePassword from './containers/profile/ChangePassword';
import Registration from './containers/Registration';
import Reviews from './containers/ReviewsAndSuggestions/RevAndSugList';
import ReviewCreate from './containers/ReviewsAndSuggestions/ReviewCreate';
import ReviewDetail from './containers/ReviewsAndSuggestions/RevAndSugDetails';
import qrCode from './containers/QRcode';
import PushHistory from './containers/PushHistory/PushList';
import RestorePassword from './containers/RestorePassword';
import ActivationAccount from './containers/ActivationAccount';
import NewPassword from './containers/NewPassword';
import LoyaltyTerms from './containers/LoyaltyTerms';
import {BeCraftRecipeStage1} from './containers/BeCraft/BeCraftRecipeStage1';
import {BeCraftRecipeStage2} from './containers/BeCraft/BeCraftRecipeStage2';
import {BeCraftList} from './containers/BeCraft/BeCaftList';
import {Catalog} from './containers/Catalog';
import {CatalogItemDetail} from './containers/Catalog/CatalogItemDetail';
import {SocialMedia} from './containers/social/SocialMedia';

import * as Sentry from '@sentry/react-native';
import {getUser, isLoggedIn} from './services';
import {t} from './services/i18n';
import AuthDrawerBar from './components/AuthDrawerBar';
import {NativeBaseProvider} from 'native-base';

Sentry.init({
  dsn: 'https://46625e562e3b4bd2aff63c32a5416791@sentry.io/1780076',
});

const HEIGHT = Dimensions.get('window').height;

let headerStyle = {
  backgroundColor: '#e31e24',
};

// const MainScreenNavigator = DrawerNavigator(
//   {
//     Home: {screen: CampaignList},
//     PurchasesList: {screen: PurchasesList},
//     Profile: {screen: Profile},
//     ChangePassword: {screen: ChangePassword},
//     QRcode: {screen: QRcode},
//     PushHistory: {screen: PushHistory},
//     Reviews: {screen: Reviews},
//     BeCraft: {screen: BeCraftList},
//     Catalog: {screen: Catalog},
//     SocialMedia: {screen: SocialMedia},
//   },
//   {
//     contentComponent: props => <Drawer drawerProps={props} />,
//   },
// );

// MainScreenNavigator.navigationOptions = ({navigation}) => {
//   if (Platform.OS === 'ios') {
//     headerStyle.height = HEIGHT * 0.07;
//     headerStyle.paddingTop = HEIGHT * 0.03;
//   }
//   return {
//     headerMode: 'screen',
//     title: 'Perfums Bar',
//     headerTintColor: 'white',
//     headerBackTitle: null,
//     headerStyle: headerStyle,
//     headerTitleStyle: {
//       color: 'white',
//     },
//     statusBarStyle: 'light-content',
//     headerLeft: (
//       <TouchableHighlight
//         onPress={() => {
//           const {routes, index} = navigation.state;
//           if (routes[index].routeName !== 'DrawerOpen') {
//             navigation.navigate('DrawerOpen');
//           } else {
//             navigation.navigate('DrawerClose');
//           }
//           // isLoggedIn().then((loggedIn) => {
//           //   if(loggedIn) {
//           //     getUser().then((user) => this ? this.setState({user: user}) : null);
//           //   }
//           // });
//         }}
//         style={{
//           paddingTop: 5,
//           paddingBottom: 5,
//           paddingLeft: 10,
//           paddingRight: 10,
//           marginLeft: 5,
//         }}
//         underlayColor="#e31e24">
//         <Icon name="bars" size={22} color="white" />
//       </TouchableHighlight>
//     ),
//   };
// };

// const AppNav = StackNavigator(
//   {
//     Home: {screen: MainScreenNavigator},
//     Login: {screen: Login},
//     Registration: {screen: Registration},
//     RestorePassword: {screen: RestorePassword},
//     ActivationAccount: {screen: ActivationAccount},
//     NewPassword: {screen: NewPassword},
//     QRcode: {screen: QRcode},
//     ReviewCreate: {screen: ReviewCreate},
//     ReviewDetail: {screen: ReviewDetail},
//     LoyaltyTerms: {screen: LoyaltyTerms},
//     BeCraftRecipeStage1: {screen: BeCraftRecipeStage1},
//     BeCraftRecipeStage2: {screen: BeCraftRecipeStage2},
//     CatalogItemDetail: {screen: CatalogItemDetail},
//     CampaignDetails: {screen: CampaignDetails},
//   },
//   {
//     navigationOptions: ({navigation}) => {
//       return {
//         headerMode: 'screen',
//         headerTintColor: 'white',
//         headerStyle: headerStyle,
//         headerLeft: (
//           <TouchableHighlight
//             style={{
//               paddingTop: 5,
//               paddingBottom: 5,
//               paddingLeft: 10,
//               paddingRight: 10,
//               marginRight: 5,
//             }}
//             onPress={() => navigation.goBack()}
//             underlayColor="#e31e24">
//             <Icon name="arrow-left" size={22} color="white" />
//           </TouchableHighlight>
//         ),
//       };
//     },
//   },
// );
const DrawerNavigation = () => {
  const DrawerInstance = createDrawerNavigator();

  return (
    <DrawerInstance.Navigator
      initialRouteName="Home"
      screenOptions={{
        drawerActiveTintColor: 'red',
        headerShown: false,
      }}
      drawerContent={props => <Drawer drawerProps={props} />}>
      <DrawerInstance.Screen
        options={{
          title: t('Campaigns'),
          drawerIcon: ({focused}) => (
            <Icon name="list" size={20} color={focused ? 'red' : '#969696'} />
          ),
        }}
        name="Home"
        component={CampaignList}
      />
      <DrawerInstance.Screen
        options={{
          title: t('Product Catalog'),
          drawerIcon: ({focused}) => (
            <Icon
              style={{marginRight: -2}}
              name="shopping-bag"
              size={20}
              color={focused ? 'red' : '#969696'}
            />
          ),
        }}
        name="Product Catalog"
        component={Catalog}
      />
      <DrawerInstance.Screen
        options={{
          title: t('My purchases'),
          drawerIcon: ({focused}) => (
            <Icon
              style={{marginLeft: -1, marginRight: 1}}
              name="shopping-cart"
              size={20}
              color={focused ? 'red' : '#969696'}
            />
          ),
        }}
        name="PurchasesList"
        component={PurchasesList}
      />

      <DrawerInstance.Screen
        options={{
          title: t('Profile'),
          drawerIcon: ({focused}) => (
            <Icon
              style={{marginLeft: 2, marginRight: 2}}
              name="user"
              size={20}
              color={focused ? 'red' : '#969696'}
            />
          ),
        }}
        name="Profile"
        component={Profile}
      />
      <DrawerInstance.Screen
        options={{
          title: t('Change password'),
          drawerIcon: ({focused}) => (
            <Icon
              style={{marginLeft: -1, marginRight: -1}}
              name="key"
              size={20}
              color={focused ? 'red' : '#969696'}
            />
          ),
        }}
        name="ChangePassword"
        component={ChangePassword}
      />
      <DrawerInstance.Screen
        options={{
          title: t('My QR-codes'),
          drawerIcon: ({focused}) => (
            <Icon
              style={{marginLeft: 1, marginRight: 1}}
              name="qrcode"
              size={20}
              color={focused ? 'red' : '#969696'}
            />
          ),
        }}
        name="QRcode"
        component={qrCode}
      />
      <DrawerInstance.Screen
        options={{
          title: t('Push-notifications history'),
          drawerIcon: ({focused}) => (
            <Icon
              style={{marginLeft: -2, marginRight: -1}}
              name="bell"
              size={20}
              color={focused ? 'red' : '#969696'}
            />
          ),
        }}
        name="PushHistory"
        component={PushHistory}
      />
      <DrawerInstance.Screen
        options={{
          title: t('Reviews and Suggestions'),
          drawerIcon: ({focused}) => (
            <Icon
              style={{marginRight: -4}}
              name="edit"
              size={20}
              color={focused ? 'red' : '#969696'}
            />
          ),
        }}
        name="Reviews"
        component={Reviews}
      />
      <DrawerInstance.Screen
        options={{
          title: t('Perfume shop'),
          drawerIcon: ({focused}) => (
            <Icon
              style={{marginRight: -4}}
              name="flask"
              size={20}
              color={focused ? 'red' : '#969696'}
            />
          ),
        }}
        name="BeCraft"
        component={BeCraftList}
      />
      <DrawerInstance.Screen
        options={{
          title: t('Loyalty Program Terms'),
          drawerIcon: ({focused}) => (
            <Icon
              style={{marginRight: -4}}
              name="percent"
              size={20}
              color={focused ? 'red' : '#969696'}
            />
          ),
        }}
        name="Loyalty Program Terms"
        component={LoyaltyTerms}
      />
      <DrawerInstance.Screen
        options={{
          title: t('SocialMedia'),
          drawerIcon: ({focused}) => (
            <Icon
              style={{marginRight: -6}}
              name="comments"
              size={20}
              color={focused ? 'red' : '#969696'}
            />
          ),
        }}
        name="SocialMedia"
        component={SocialMedia}
      />
    </DrawerInstance.Navigator>
  );
};

const RoutingComponent = ({userType}) => {
  const Stack = createStackNavigator();
  const navigation = useNavigation();

  const getNavOptions = () => {
    return {
      headerMode: 'screen',
      title: 'Perfums Bar',
      headerTintColor: 'white',
      headerBackTitle: null,
      headerStyle: headerStyle,
      headerTitleStyle: {
        color: 'white',
      },
      statusBarStyle: 'light-content',
      headerLeft: () => (
        <TouchableHighlight
          onPress={() => {
            navigation.dispatch(DrawerActions.openDrawer());
            isLoggedIn().then(loggedIn => {
              if (loggedIn) {
                getUser().then(user =>
                  this ? this.setState({user: user}) : null,
                );
              }
            });
          }}
          style={{
            paddingTop: 5,
            paddingBottom: 5,
            paddingLeft: 10,
            paddingRight: 10,
            marginLeft: 5,
          }}
          underlayColor="#e31e24">
          <Icon name="bars" size={22} color="white" />
        </TouchableHighlight>
      ),
      headerRight: () => <AuthDrawerBar />,
    };
  };
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: true,
      }}>
      <Stack.Screen
        name="Home"
        component={DrawerNavigation}
        options={getNavOptions}
      />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Registration" component={Registration} />
      <Stack.Screen name="RestorePassword" component={RestorePassword} />
      <Stack.Screen name="QRcode" component={qrCode} />
      <Stack.Screen name="ReviewCreate" component={ReviewCreate} />
      <Stack.Screen name="ReviewDetail" component={ReviewDetail} />
      <Stack.Screen name="ActivationAccount" component={ActivationAccount} />
      <Stack.Screen name="NewPassword" component={NewPassword} />
      <Stack.Screen
        options={{
          headerShown: true,
        }}
        name="LoyaltyTerms"
        component={LoyaltyTerms}
      />
      <Stack.Screen
        name="BeCraftRecipeStage1"
        component={BeCraftRecipeStage1}
      />
      <Stack.Screen
        name="BeCraftRecipeStage2"
        component={BeCraftRecipeStage2}
      />
      <Stack.Screen
        options={{
          title: t('Goods'),
        }}
        name="CatalogItemDetail"
        component={CatalogItemDetail}
      />

      <Stack.Screen
        options={{
          title: t('Sale'),
        }}
        name="CampaignDetails"
        component={CampaignDetails}
      />
    </Stack.Navigator>
  );
  // return <NavApp ref="navigator" screenProps={{userType}} />;
};

console.reportErrorsAsExceptions = false;
const App = () => {
  const [userType, setUserType] = useState(null);
  // // const [store, setStore] = useState(null);
  //
  // useEffect(() => {
  //   getUserType().then((userType: any) => {
  //     log.info('userType', userType);
  //     setUserType(userType);
  //   });
  // }, []);
  //
  // useEffect(() => {
  //   log.info('user', userType);
  //   if (userType) {
  //   }
  //   // eslint-disable-next-line
  // }, [userType]);

  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <RoutingComponent userType={userType} />
      </NavigationContainer>
    </NativeBaseProvider>
  );
};
// class App extends Component {
// componentDidMount() {
//   const navigation = this.refs.navigator._navigation;
//
//   FCM.getInitialNotification().then(notification => {
//     if (notification && notification.hasOwnProperty('type')) {
//       if (notification.type === 'promo') {
//         let id = parseInt(notification.obj_id, 10);
//         navigation.navigate('CampaignDetails', {id: id});
//       } else {
//         if (notification.type === 'comment') {
//           navigation.navigate('Reviews');
//         } else {
//           navigation.navigate('PushHistory');
//         }
//       }
//     }
//   });
//
//   this.notificationListener = FCM.on(FCMEvent.Notification, async notif => {
//     if (notif.opened_from_tray) {
//       if (notif.type === 'promo') {
//         let id = parseInt(notif.obj_id, 10);
//         navigation.navigate('CampaignDetails', {id: id});
//       } else {
//         if (notif.type === 'comment') {
//           navigation.navigate('Reviews');
//         } else {
//           navigation.navigate('PushHistory');
//         }
//       }
//     }
//     //await someAsyncCall();
//
//     if (Platform.OS === 'ios') {
//       switch (notif._notificationType) {
//         case NotificationType.Remote:
//           notif.finish(RemoteNotificationResult.NewData);
//           break;
//         case NotificationType.NotificationResponse:
//           notif.finish();
//           break;
//         case NotificationType.WillPresent:
//           notif.finish(WillPresentNotificationResult.All);
//           break;
//       }
//     }
//   });
// }

// componentWillUnmount() {
//   this.notificationListener.remove();
// }
//   render() {
//     return <AppNav ref="navigator" />;
//   }
// }

export default App;

import {
  fetchList,
  fetchDetail,
  updateObject,
  updateObjectWithResponse,
  registration,
  getBonus,
  backgroundGeolocation,
  createObject,
  deleteObject,
  updateObjectById,
  loadMore,
  fetchListWithOutsideUrl,
} from './utils';
import {
  authenticate,
  login,
  logout,
  isLoggedIn,
  userData,
  getUser,
} from './auth';

export const API = {
  campaigns: {
    list: 'campaigns',
    details: 'campaigns/{id}',
  },
  catalogNew: {
    list: 'catalog/new',
  },
  socialmedia: {
    list: 'social-media-links',
  },
  contacts: {
    list: 'contacts',
  },

  loggedInCompaigns: {
    list: 'consumer/campaigns',
  },
  auth: {
    login: 'auth',
  },
  password: {
    update: 'password/edit',
  },
  ingredients: {
    list: 'ingredients',
  },
  location: {
    list: 'consumer/location',
  },
  registration: {
    login: 'consumer/register',
    finish: 'consumer/register/finish',
  },
  profile: {
    update: 'consumer/profile',
  },
  sales: {
    list: 'consumer/purchase/list',
  },
  bonus: {
    get: 'consumer/bonus',
  },
  geolocation: {
    create: 'location/user',
  },
  token_phone: {
    create: 'user/token',
  },
  comment: {
    create: 'consumer/comment/create',
    list: 'consumer/comments',
    details: 'consumer/comments/{id}',
  },
  pushHistory: {
    list: 'notifications',
  },
  digits: {
    list: 'digits',
  },
  restore: {
    step_one: 'restore/2',
    step_two: 'restore/finish',
    step_three: 'restore/password',
  },
  loyalty: 'loyalty-program',
  recipes: {
    create: 'recipe/create',
    list: 'recipe/list',
    details: 'recipe/{id}',
    delete: 'recipe/{id}',
    update: 'recipe/{id}',
  },
  catalog: {
    list: 'catalog',
    brands: {
      list: 'catalog/brands',
    },
    perfume: {
      details: 'catalog/perfumes/{id}',
    },
    accessor: {
      details: 'catalog/accessories/{id}',
    },
  },
};

export {
  fetchList,
  fetchDetail,
  authenticate,
  login,
  logout,
  isLoggedIn,
  userData,
  getUser,
  updateObject,
  registration,
  getBonus,
  backgroundGeolocation,
  createObject,
  updateObjectWithResponse,
  deleteObject,
  updateObjectById,
  loadMore,
  fetchListWithOutsideUrl,
};

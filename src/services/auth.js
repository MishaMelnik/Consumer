import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '../config';
import {API} from './index';

export function authenticate(data) {
  return new Promise((resolve, reject) => {
    fetch(`${API_URL}/${API.auth.login}/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(response => {
      return response.json().then(json => {
        response.ok ? resolve(json) : reject(json);
      });
    });
  });
}

export function login(token) {
  AsyncStorage.setItem('token', token);
}

export function userData(user) {
  AsyncStorage.setItem('user', JSON.stringify(user));
}

export function isLoggedIn() {
  return AsyncStorage.getItem('token').then(token => !!token);
}

export function getUser() {
  return AsyncStorage.getItem('user').then(user => JSON.parse(user));
}

export function logout() {
  AsyncStorage.removeItem('token');
  AsyncStorage.removeItem('user');
}

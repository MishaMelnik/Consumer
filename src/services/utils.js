import {API_URL} from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {logout} from './auth';

function getAuthHeader() {
  return AsyncStorage.getItem('token').then(token =>
    token ? {Authorization: `JWT ${token}`} : {},
  );
}

export class BadRequestError {
  constructor(message = 'Bad Request') {
    this.message = message;
  }
}

export class UnauthorizedError {
  constructor(message = 'Unauthorized') {
    this.message = message;
  }
}

export class ForbiddenError {
  constructor(message = 'Forbidden') {
    this.message = message;
  }
}

export class InternalServerError {
  constructor(message = 'Internal Server Error') {
    this.message = message;
  }
}

export class BaseError {
  constructor(message = 'Error') {
    this.message = message;
  }
}

const ERRORS = {
  400: BadRequestError,
  401: UnauthorizedError,
  403: ForbiddenError,
  500: InternalServerError,
};

function throwError(status, message) {
  if (status in ERRORS) {
    throw new ERRORS[status](message);
  } else {
    throw new BaseError(message);
  }
}

export function fetchList(path) {
  if (path.hasOwnProperty('list')) {
    path = path.list;
  }
  let fullUrl = `${API_URL}/${path}/`;

  return getAuthHeader()
    .then(headers => fetch(fullUrl, {headers: headers}))
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throwError(response.status, ERRORS['401'].message);
      }
    });
}

export function loadMore(self, targetName, url_next, options = {}) {
  let origin_list = self.state[targetName];
  fetchListWithOutsideUrl(url_next)
    .then(response => {
      if (options.hasOwnProperty('checked')) {
        response.results = response.results.map(item => ({
          ...item,
          checked: options.checked,
        }));
      }

      origin_list = origin_list.concat(response.results);
      self.setState({
        [targetName]: origin_list,
        next: response.next,
      });
    })
    .catch(error => console.warn('error', error));
}

export function fetchListWithOutsideUrl(url) {
  return getAuthHeader()
    .then(headers => fetch(url, {headers: headers}))
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return {status: response.status, response: response.json()};
      }
    });
}

export function fetchDetail(path, id) {
  if (path.hasOwnProperty('details')) {
    path = path.details;
    path = path.replace('{id}', id);
  }
  let fullUrl = `${API_URL}/${path}/`;

  return getAuthHeader()
    .then(headers => fetch(fullUrl, {headers: headers}))
    .then(response => response.json())
    .catch(error => {
      console.error(error);
    });
}

export function updateObject(path, data) {
  if (path.hasOwnProperty('update')) {
    path = path.update;
  }
  let fullUrl = `${API_URL}/${path}/`;

  return getAuthHeader()
    .then(headers => {
      let valueHeaders = 'application/json';
      headers.Accept = valueHeaders;
      headers['Content-Type'] = valueHeaders;
      return fetch(fullUrl, {
        headers: headers,
        method: 'PUT',
        body: JSON.stringify(data),
      });
    })
    .then(response => response.ok)
    .catch(error => {
      console.error(error);
    });
}

export function updateObjectById(path, id, data) {
  if (path.hasOwnProperty('update')) {
    path = path.update;
    path = path.replace('{id}', id);
  }
  let fullUrl = `${API_URL}/${path}/`;

  return getAuthHeader()
    .then(headers => {
      let valueHeaders = 'application/json';
      headers.Accept = valueHeaders;
      headers['Content-Type'] = valueHeaders;
      return fetch(fullUrl, {
        headers: headers,
        method: 'PUT',
        body: JSON.stringify(data),
      });
    })
    .then(response => {
      return response.ok;
    })
    .catch(error => {
      console.error(error);
    });
}

export function updateObjectWithResponse(path, data) {
  if (path.hasOwnProperty('update')) {
    path = path.update;
  }
  let fullUrl = `${API_URL}/${path}/`;
  return getAuthHeader()
    .then(headers => {
      let valueHeaders = 'application/json';
      headers.Accept = valueHeaders;
      headers['Content-Type'] = valueHeaders;
      return fetch(fullUrl, {
        headers: headers,
        method: 'PUT',
        body: JSON.stringify(data),
      });
    })
    .then(response => {
      return response.json();
    })
    .catch(error => {
      console.error(error);
    });
}

export function registration(path, data) {
  if (path.hasOwnProperty('login')) {
    path = path.login;

    return fetch(`${API_URL}/${path}/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.ok)
      .catch(error => {
        console.error(error);
      });
  }
}

export function backgroundGeolocation(path, data) {
  if (path.hasOwnProperty('create')) {
    path = path.create;
    let fullUrl = `${API_URL}/${path}/`;

    return getAuthHeader()
      .then(headers => {
        let valueHeaders = 'application/json';
        headers.Accept = valueHeaders;
        headers['Content-Type'] = valueHeaders;
        return fetch(fullUrl, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify(data),
        });
      })
      .then(response => response.ok)
      .catch(error => {
        console.error(error);
      });
  }
}

export function getBonus(path) {
  if (path.hasOwnProperty('get')) {
    path = path.get;
  }
  let fullUrl = `${API_URL}/${path}/`;
  return getAuthHeader()
    .then(headers => fetch(fullUrl, {headers: headers}))
    .then(response => response.json())
    .catch(error => {
      console.error(error);
    });
}

export function createObject(path, obj, options = {}) {
  if (path.hasOwnProperty('create')) {
    path = path.create;
  }
  let fullUrl = `${API_URL}/${path}/`;

  return getAuthHeader()
    .then(headers => {
      headers.Accept = 'application/json';
      headers['Content-Type'] = 'application/json';

      return fetch(fullUrl, {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: headers,
      });
    })
    .then(response => {
      if (response.ok) {
        return true;
      } else {
        return response.json().then(responseJSON => {
          throwError(response.status, responseJSON);
        });
      }
    });
}

export function deleteObject(path, id) {
  if (path.hasOwnProperty('delete')) {
    path = path.delete;
    path = path.replace('{id}', id);
  }

  let fullUrl = `${API_URL}/${path}/`;

  return getAuthHeader()
    .then(headers => {
      headers.Accept = 'application/json';
      headers['Content-Type'] = 'application/json';

      return fetch(fullUrl, {
        method: 'delete',
        headers: headers,
      });
    })
    .then(response => {
      if (response.ok) {
        return true;
      } else {
        return response.json().then(responseJSON => {
          throwError(response.status, responseJSON);
        });
      }
    });
}

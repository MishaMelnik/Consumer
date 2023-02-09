let apiUrl = 'http://46.101.171.22/api/v1';
// Test server for production
// let apiUrl = 'http://10.14.0.147:8000/api/v1';
// let apiUrl = 'http://192.168.1.131:8000/api/v1';

if (__DEV__) {
  apiUrl = 'http://46.101.171.22/api/v1';
  // TODO: change local ip for __DEV__
  // apiUrl = 'http://10.14.0.158:8000/api/v1'
  // apiUrl = 'http://192.168.8.110:8000/api/v1';
  // apiUrl = 'http://192.168.43.115:8000/api/v1'

  // apiUrl = 'http://10.14.0.179:8000/api/v1'
}

//TODO: test server for production
// http://80.87.199.122:8080/api/v1
// export const API_URL = 'http://80.87.199.122:8080/api/v1';
export const API_URL = apiUrl;
export const PHONENUMBER_PREFIX = '+380';
export const HOTLINE_NUMBER = '+380672199949';
export const HOTLINE_NUMBER_for_CALL = '0672199949';
export const EMAIL_HOTLINE = 'main_zt@perfumsbar.com';

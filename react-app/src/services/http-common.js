import axios from 'axios';

const config = {
  baseURL: process.env.REACT_APP_BACKEND_API || 'http://localhost:4000/api/v1',
  headers: {
    'Content-type': 'application/json'
  }
};
let instance = axios.create(config);

class CustomAxios {

  get() {
    return instance;
  }

  setId(id) {
    instance.defaults.headers.common['socket-id'] = id;
  }
}

const customAxios = new CustomAxios();
export default customAxios;

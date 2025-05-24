import axios from 'axios';

// Create a custom Axios instance with a baseURL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT, // Use the environment variable
});

export default api; 
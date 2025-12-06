import axios from 'axios'

const API_URL = '/api/auth'

export const authService = {
  async register(userData) {
    const response = await axios.post(`${API_URL}/register`, userData)
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data))
    }
    return response.data
  },

  async login(credentials) {
    const response = await axios.post(`${API_URL}/login`, credentials)
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data))
    }
    return response.data
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'))
  },

  getToken() {
    return localStorage.getItem('token')
  }
}

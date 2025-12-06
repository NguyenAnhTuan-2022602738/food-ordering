import axios from 'axios'
import { authService } from './authService'

const API_URL = '/api/orders'

export const orderService = {
  async createOrder(orderData) {
    const token = authService.getToken()
    const response = await axios.post(API_URL, orderData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  },

  async getMyOrders(userId) {
    const token = authService.getToken()
    const response = await axios.get(`${API_URL}/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }
}

import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { orderService } from '../services/orderService'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Package, Clock, MapPin, Phone, ChevronRight, ShoppingBag, CheckCircle, Truck, ChefHat, XCircle, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      loadOrders()
    }

    const handleNotification = () => {
      loadOrders()
    }

    window.addEventListener('notification_received', handleNotification)
    return () => window.removeEventListener('notification_received', handleNotification)
  }, [user])

  const loadOrders = async () => {
    try {
      const data = await orderService.getMyOrders(user.userId || user.id)
      // Sort by newest first
      setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
    } catch (err) {
      setError('Failed to load orders. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusConfig = (status) => {
    const configs = {
      PENDING: { color: 'text-yellow-600 bg-yellow-50 border-yellow-200', icon: Clock, label: 'Pending Confirmation' },
      CONFIRMED: { color: 'text-blue-600 bg-blue-50 border-blue-200', icon: CheckCircle, label: 'Confirmed' },
      PREPARING: { color: 'text-purple-600 bg-purple-50 border-purple-200', icon: ChefHat, label: 'Preparing' },
      DELIVERING: { color: 'text-indigo-600 bg-indigo-50 border-indigo-200', icon: Truck, label: 'Out for Delivery' },
      DELIVERED: { color: 'text-green-600 bg-green-50 border-green-200', icon: Package, label: 'Delivered' },
      CANCELLED: { color: 'text-red-600 bg-red-50 border-red-200', icon: XCircle, label: 'Cancelled' }
    }
    return configs[status] || { color: 'text-gray-600 bg-gray-50 border-gray-200', icon: AlertCircle, label: status }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-500 mb-8">Track and manage your recent orders</p>

          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-3xl h-64 animate-pulse shadow-sm border border-gray-100"></div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-white rounded-3xl shadow-sm border border-red-100">
              <div className="text-red-500 mb-4 flex justify-center"><AlertCircle size={48} /></div>
              <p className="text-gray-800 font-medium">{error}</p>
              <button onClick={loadOrders} className="mt-4 text-orange-500 font-bold hover:underline">Try Again</button>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
              <div className="bg-orange-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-500">
                <ShoppingBag size={48} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
              <p className="text-gray-500 mb-8">Looks like you haven't ordered anything yet.</p>
              <Link 
                to="/menu" 
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/30"
              >
                Start Ordering <ChevronRight size={20} />
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const statusConfig = getStatusConfig(order.status)
                const StatusIcon = statusConfig.icon

                return (
                  <div key={order.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 group">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${statusConfig.color.replace('text-', 'bg-').replace('bg-', 'bg-opacity-10 ')}`}>
                          <StatusIcon size={24} className={statusConfig.color.split(' ')[0]} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-900">Order #{order.id}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusConfig.color}`}>
                              {statusConfig.label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                            <Clock size={14} /> {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="text-xl font-bold text-orange-500">{order.totalAmount?.toLocaleString('vi-VN')}đ</p>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-6">
                      <div className="space-y-4 mb-6">
                        {order.items?.map((item, index) => (
                          <div key={index} className="flex justify-between items-center py-2 border-b border-dashed border-gray-100 last:border-0">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-xs">
                                {item.quantity}x
                              </div>
                              <span className="font-medium text-gray-700">{item.menuItemName}</span>
                            </div>
                            <span className="font-bold text-gray-900">
                              {(item.price * item.quantity)?.toLocaleString('vi-VN')}đ
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-6 pt-4 bg-gray-50/50 rounded-2xl p-4">
                        <div className="flex-1 flex items-start gap-3">
                          <MapPin className="text-gray-400 mt-1" size={20} />
                          <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Delivery Address</p>
                            <p className="text-gray-800 font-medium text-sm">{order.deliveryAddress}</p>
                          </div>
                        </div>
                        <div className="flex-1 flex items-start gap-3">
                          <Phone className="text-gray-400 mt-1" size={20} />
                          <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Contact Phone</p>
                            <p className="text-gray-800 font-medium text-sm">{order.phoneNumber}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

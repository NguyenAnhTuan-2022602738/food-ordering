import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { ShoppingBag, DollarSign, Users, Utensils, TrendingUp, ArrowUpRight, Clock, Filter, Calendar } from 'lucide-react'

export default function Dashboard() {
  const { getToken } = useAuth()
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalMenuItems: 0
  })
  const [orders, setOrders] = useState([])
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [timeFilter, setTimeFilter] = useState('day') // day, month, quarter, year

  useEffect(() => {
    loadDashboardData()

    const handleNotification = () => {
      loadDashboardData()
    }

    window.addEventListener('notification_received', handleNotification)
    return () => window.removeEventListener('notification_received', handleNotification)
  }, [])

  const loadDashboardData = async () => {
    try {
      const token = getToken()
      const headers = { Authorization: `Bearer ${token}` }

      // 1. Get Menu Count
      let menuCount = 0
      try {
        const menuResponse = await axios.get('/api/menu?availableOnly=false', { headers })
        menuCount = menuResponse.data?.length || 0
      } catch (err) {
        // Fallback for public endpoint if admin fails or vice versa
        try {
             const menuResponsePublic = await axios.get('/api/menu?availableOnly=false')
             menuCount = menuResponsePublic.data?.length || 0
        } catch (e) { console.error('Menu API error', e) }
      }

      // 2. Get Users Count
      let userCount = 0
      try {
        const usersResponse = await axios.get('/api/users', { headers })
        userCount = usersResponse.data?.length || 0
      } catch (err) {
        console.error('Users API error', err)
      }

      // 3. Get Orders (for Stats & Charts)
      let allOrders = []
      try {
        const ordersResponse = await axios.get('/api/orders', { headers })
        allOrders = ordersResponse.data || []
      } catch (err) {
        console.error('Orders API error', err)
      }

      // Calculate Global Stats
      const totalRevenue = allOrders.reduce((sum, order) => sum + (order.status === 'COMPLETED' ? (order.totalAmount || 0) : 0), 0)
      
      // Sort for Recent Orders
      const sortedOrders = [...allOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      
      setOrders(allOrders)
      setRecentOrders(sortedOrders.slice(0, 5))
      setStats({
        totalOrders: allOrders.length,
        totalRevenue: totalRevenue,
        totalUsers: userCount,
        totalMenuItems: menuCount
      })
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate Chart Data based on Time Filter
  const chartData = useMemo(() => {
    const now = new Date()
    const currentYear = now.getFullYear()
    let data = []

    if (timeFilter === 'day') {
      // Last 7 days
      const map = new Map()
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now)
        d.setDate(now.getDate() - i)
        const key = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }) // dd/MM
        const dateStr = d.toISOString().split('T')[0]
        map.set(dateStr, { name: key, orders: 0, revenue: 0 })
      }

      orders.forEach(order => {
        const orderDate = new Date(order.createdAt).toISOString().split('T')[0]
        if (map.has(orderDate)) {
          const entry = map.get(orderDate)
          entry.orders += 1
          entry.revenue += (order.status === 'COMPLETED' ? order.totalAmount : 0)
        }
      })
      data = Array.from(map.values())

    } else if (timeFilter === 'month') {
      // This Year (12 months)
      const map = new Map()
      for (let i = 0; i < 12; i++) {
        map.set(i, { name: `T${i + 1}`, orders: 0, revenue: 0 })
      }

      orders.forEach(order => {
        const date = new Date(order.createdAt)
        if (date.getFullYear() === currentYear) {
          const month = date.getMonth()
          const entry = map.get(month)
          entry.orders += 1
          entry.revenue += (order.status === 'COMPLETED' ? order.totalAmount : 0)
        }
      })
      data = Array.from(map.values())

    } else if (timeFilter === 'quarter') {
      // This Year (4 Quarters)
      const map = new Map()
      for (let i = 1; i <= 4; i++) {
        map.set(i, { name: `Quý ${i}`, orders: 0, revenue: 0 })
      }

      orders.forEach(order => {
        const date = new Date(order.createdAt)
        if (date.getFullYear() === currentYear) {
          const month = date.getMonth() // 0-11
          const quarter = Math.floor(month / 3) + 1
          const entry = map.get(quarter)
          entry.orders += 1
          entry.revenue += (order.status === 'COMPLETED' ? order.totalAmount : 0)
        }
      })
      data = Array.from(map.values())

    } else if (timeFilter === 'year') {
      // Last 5 Years
      const map = new Map()
      for (let i = 4; i >= 0; i--) {
        const y = currentYear - i
        map.set(y, { name: y.toString(), orders: 0, revenue: 0 })
      }

      orders.forEach(order => {
        const y = new Date(order.createdAt).getFullYear()
        if (map.has(y)) {
          const entry = map.get(y)
          entry.orders += 1
          entry.revenue += (order.status === 'COMPLETED' ? order.totalAmount : 0)
        }
      })
      data = Array.from(map.values())
    }

    return data
  }, [orders, timeFilter])

  const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
          <Icon size={24} className={color.replace('bg-', 'text-')} />
        </div>
        <div className="flex items-center gap-1 text-gray-400 text-xs font-medium">
           <Clock size={12} /> realtime
        </div>
      </div>
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tổng quan Dashboard</h1>
          <p className="text-gray-500">Số liệu kinh doanh được cập nhật mới nhất.</p>
        </div>
        
        {/* Date Filters */}
        <div className="flex items-center bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
          <button 
            onClick={() => setTimeFilter('day')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${timeFilter === 'day' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Theo Ngày
          </button>
          <button 
            onClick={() => setTimeFilter('month')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${timeFilter === 'month' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Tháng
          </button>
          <button 
            onClick={() => setTimeFilter('quarter')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${timeFilter === 'quarter' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Quý
          </button>
          <button 
            onClick={() => setTimeFilter('year')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${timeFilter === 'year' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Năm
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Tổng doanh thu" 
          value={`${stats.totalRevenue.toLocaleString('vi-VN')}đ`} 
          icon={DollarSign} 
          color="bg-green-500" 
        />
        <StatCard 
          title="Tổng đơn hàng" 
          value={stats.totalOrders} 
          icon={ShoppingBag} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Món ăn đang bán" 
          value={stats.totalMenuItems} 
          icon={Utensils} 
          color="bg-orange-500" 
        />
        <StatCard 
          title="Tổng người dùng" 
          value={stats.totalUsers} 
          icon={Users} 
          color="bg-purple-500" 
        />
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-gray-900">Biểu đồ doanh thu</h3>
              <p className="text-xs text-gray-500 mt-1">
                {timeFilter === 'day' ? '7 ngày gần nhất' : 
                 timeFilter === 'month' ? `Năm ${new Date().getFullYear()}` : 
                 timeFilter === 'quarter' ? `Theo quý năm ${new Date().getFullYear()}` : '5 năm gần nhất'}
              </p>
            </div>
            <div className="p-2 bg-green-50 rounded-lg text-green-600">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} tickFormatter={(value) => value >= 1000000 ? `${value/1000000}M` : value >= 1000 ? `${value/1000}K` : value } />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  formatter={(value) => [`${value.toLocaleString()}đ`, 'Doanh thu']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-gray-900">Biểu đồ đơn hàng</h3>
              <p className="text-xs text-gray-500 mt-1">
                 Số lượng đơn hàng theo {
                   timeFilter === 'day' ? 'ngày' : 
                   timeFilter === 'month' ? 'tháng' : 
                   timeFilter === 'quarter' ? 'quý' : 'năm'
                 }
              </p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <ShoppingBag size={20} />
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} allowDecimals={false} />
                <Tooltip 
                  cursor={{fill: '#F3F4F6'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  formatter={(value) => [value, 'Đơn hàng']}
                />
                <Bar dataKey="orders" fill="#6366F1" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-900">Đơn hàng mới nhất</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Mã đơn</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Khách hàng</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    Chưa có đơn hàng nào
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">#{order.id}</td>
                    <td className="px-6 py-4 text-gray-600">
                        {order.phoneNumber || order.email || 'Khách vãng lai'}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {order.totalAmount?.toLocaleString('vi-VN')}đ
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold
                        ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 
                          order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'PREPARING' ? 'bg-purple-100 text-purple-700' :
                          order.status === 'DELIVERING' ? 'bg-indigo-100 text-indigo-700' :
                          order.status === 'COMPLETED' || order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                          order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        {new Date(order.createdAt).toLocaleString('vi-VN', {
                            day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

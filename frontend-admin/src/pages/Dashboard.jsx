import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { ShoppingBag, DollarSign, Users, Utensils, TrendingUp, ArrowUpRight, Clock } from 'lucide-react'

export default function Dashboard() {
  const { getToken } = useAuth()
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalMenuItems: 0
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

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

      // Try to load menu items count
      let menuCount = 0
      try {
        const menuResponse = await axios.get('/api/menu?availableOnly=false')
        menuCount = menuResponse.data?.length || 0
      } catch (err) {
        console.log('Menu endpoint not available yet')
      }

      // Try to load orders
      let orders = []
      try {
        const ordersResponse = await axios.get('/api/orders', { headers })
        orders = ordersResponse.data || []
      } catch (err) {
        console.log('Orders endpoint not available yet')
      }

      // Calculate stats
      const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
      
      // Sort orders by date descending
      const sortedOrders = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      const recent = sortedOrders.slice(0, 5)
      setRecentOrders(recent)

      setStats({
        totalOrders: orders.length,
        totalRevenue: totalRevenue,
        totalUsers: 12, // Mock users count for now
        totalMenuItems: menuCount
      })
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const mockChartData = [
    { name: 'Mon', orders: 12, revenue: 2450000 },
    { name: 'Tue', orders: 19, revenue: 3800000 },
    { name: 'Wed', orders: 15, revenue: 2900000 },
    { name: 'Thu', orders: 25, revenue: 5200000 },
    { name: 'Fri', orders: 30, revenue: 6700000 },
    { name: 'Sat', orders: 35, revenue: 7800000 },
    { name: 'Sun', orders: 28, revenue: 5900000 }
  ]

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
          <Icon size={24} className={color.replace('bg-', 'text-')} />
        </div>
        <div className="flex items-center gap-1 text-green-500 text-sm font-medium bg-green-50 px-2 py-1 rounded-lg">
          <TrendingUp size={14} />
          {trend}%
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back, here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`${stats.totalRevenue.toLocaleString('vi-VN')}đ`} 
          icon={DollarSign} 
          color="bg-green-500" 
          trend="+12.5"
        />
        <StatCard 
          title="Total Orders" 
          value={stats.totalOrders} 
          icon={ShoppingBag} 
          color="bg-blue-500" 
          trend="+8.2"
        />
        <StatCard 
          title="Menu Items" 
          value={stats.totalMenuItems} 
          icon={Utensils} 
          color="bg-orange-500" 
          trend="+2.4"
        />
        <StatCard 
          title="Active Users" 
          value={stats.totalUsers} 
          icon={Users} 
          color="bg-purple-500" 
          trend="+5.1"
        />
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900">Revenue Analytics</h3>
            <button className="text-sm text-indigo-600 font-medium hover:underline">View Report</button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} tickFormatter={(value) => `${value/1000000}M`} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  formatter={(value) => [`${value.toLocaleString()}đ`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900">Order Statistics</h3>
            <button className="text-sm text-indigo-600 font-medium hover:underline">View Details</button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                <Tooltip 
                  cursor={{fill: '#F3F4F6'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
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
          <h3 className="font-bold text-gray-900">Recent Orders</h3>
          <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 transition-colors">
            View All <ArrowUpRight size={16} />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">#{order.id}</td>
                    <td className="px-6 py-4 text-gray-600">{order.phoneNumber}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {order.totalAmount?.toLocaleString('vi-VN')}đ
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                          order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                          order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
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

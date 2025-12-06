import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { MapPin, Phone, CreditCard, CheckCircle, Loader, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart()
  const { user, getToken } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    address: '',
    phone: '',
    note: ''
  })

  if (cart.length === 0) {
    setTimeout(() => navigate('/menu'), 0)
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = getToken()
      const orderData = {
        userId: user?.userId,
        email: user?.email,
        items: cart.map(item => ({
          menuItemId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        deliveryAddress: formData.address,
        phoneNumber: formData.phone,
        notes: formData.note
      }

      await axios.post('/api/orders', orderData, {
        headers: { Authorization: `Bearer ${token}` }
      })

      clearCart()
      navigate('/my-orders')
      toast.success('Order placed successfully! 🎉')
    } catch (error) {
      toast.error('Failed to place order: ' + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-6xl mx-auto">
          <button onClick={() => navigate('/cart')} className="flex items-center gap-2 text-gray-500 hover:text-orange-500 mb-8 transition-colors">
            <ArrowLeft size={20} /> Back to Cart
          </button>
          
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Checkout Form */}
            <div className="flex-1">
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 mb-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Delivery Details</h2>
                    <p className="text-gray-500">Where should we send your food?</p>
                  </div>
                </div>

                <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Address</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="e.g. 123 Nguyen Hue, District 1, HCMC"
                      />
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="e.g. 0901234567"
                      />
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Note for Driver (Optional)</label>
                    <textarea
                      value={formData.note}
                      onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                      rows="3"
                      className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="e.g. Leave at the front desk, extra spicy..."
                    />
                  </div>
                </form>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
                    <CreditCard size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Payment Method</h2>
                    <p className="text-gray-500">Secure payment processing</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center gap-4 p-4 border-2 border-orange-500 bg-orange-50 rounded-xl cursor-pointer transition-all">
                    <input type="radio" name="payment" defaultChecked className="w-5 h-5 text-orange-600 focus:ring-orange-500" />
                    <span className="font-bold text-gray-800">Cash on Delivery (COD)</span>
                    <CheckCircle className="ml-auto text-orange-500" size={20} />
                  </label>
                  
                  <label className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-all opacity-60">
                    <input type="radio" name="payment" disabled className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-500">Credit Card (Coming Soon)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:w-96">
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 sticky top-32">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Your Order</h2>
                
                <div className="max-h-60 overflow-y-auto mb-6 pr-2 space-y-4 custom-scrollbar">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                        <img src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=100&q=80'} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800 text-sm line-clamp-1">{item.name}</h4>
                        <div className="flex justify-between text-sm mt-1">
                          <span className="text-gray-500">x{item.quantity}</span>
                          <span className="font-medium text-gray-900">{((item.price || 0) * item.quantity).toLocaleString('vi-VN')}đ</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-dashed border-gray-200 pt-4 space-y-3 mb-8">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{(total || 0).toLocaleString('vi-VN')}đ</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span className="text-green-500">Free</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-gray-900 pt-2">
                    <span>Total</span>
                    <span className="text-orange-500">{(total || 0).toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>

                <button
                  type="submit"
                  form="checkout-form"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-orange-500/40 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin" size={20} /> Processing...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

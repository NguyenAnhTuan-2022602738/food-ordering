import { useCart } from '../context/CartContext'
import { useNavigate, Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, total } = useCart()
  const navigate = useNavigate()

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="bg-white p-12 rounded-3xl shadow-xl text-center max-w-md w-full border border-gray-100">
            <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-500">
              <ShoppingBag size={48} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Looks like you haven't added any delicious food yet.</p>
            <Link 
              to="/menu" 
              className="inline-flex items-center justify-center gap-2 w-full py-4 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/30"
            >
              Start Ordering <ArrowRight size={20} />
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/menu" className="p-2 bg-white rounded-full text-gray-500 hover:text-orange-500 hover:bg-orange-50 transition-all shadow-sm">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart <span className="text-gray-400 text-lg font-normal">({cart.length} items)</span></h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items List */}
          <div className="flex-1 space-y-6">
            {cart.map((item) => (
              <div key={item.id} className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6 hover:shadow-md transition-shadow duration-300">
                <img 
                  src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80'} 
                  alt={item.name} 
                  className="w-24 h-24 rounded-xl object-cover shadow-sm"
                />
                
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
                  <p className="text-orange-500 font-bold mb-3">{(item.price || 0).toLocaleString('vi-VN')}đ</p>
                  
                  <div className="flex items-center justify-center sm:justify-start gap-4">
                    <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:text-orange-500 transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-bold text-gray-700">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:text-orange-500 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title="Remove item"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                <div className="text-right font-bold text-xl text-gray-900 min-w-[100px]">
                  {((item.price || 0) * item.quantity).toLocaleString('vi-VN')}đ
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:w-96">
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 sticky top-32">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">{(total || 0).toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="text-green-500 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (0%)</span>
                  <span className="font-medium">0đ</span>
                </div>
                <div className="border-t border-dashed border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between items-end">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-3xl font-bold text-orange-500">{(total || 0).toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-orange-500 transition-all duration-300 shadow-lg shadow-gray-900/20 hover:shadow-orange-500/30 flex items-center justify-center gap-2 group"
              >
                Proceed to Checkout
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <p className="text-center text-xs text-gray-400 mt-4">
                Secure Checkout • 100% Money Back Guarantee
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

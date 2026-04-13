import { useState, useEffect } from 'react'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { Search, Filter, ShoppingBag, Star, Heart, ChefHat } from 'lucide-react'
import ProductModal from '../components/ProductModal'

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItemForModal, setSelectedItemForModal] = useState(null)
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuRes, catRes] = await Promise.all([
          axios.get('/api/menu?availableOnly=true'),
          axios.get('/api/categories?activeOnly=true')
        ])
        setMenuItems(menuRes.data || [])
        setCategories(catRes.data || [])
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'ALL' || item.categoryId === selectedCategory
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header Section */}
      <div className="bg-gray-900 text-white pt-32 pb-12 rounded-b-[50px] mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/90"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Thực Đơn Hấp Dẫn</h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Khám phá các món ăn đa dạng được chế biến bằng cả tâm huyết. Từ Phở truyền thống đến các món ăn hiện đại.
          </p>
          
          {/* Search Bar */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <input
              type="text"
              placeholder="Tìm kiếm món ăn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-20">
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
              selectedCategory === 'ALL'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 scale-105'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Tất cả
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === cat.id
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 scale-105'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <div className="bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ChefHat size={40} className="text-orange-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy món ăn nào</h3>
            <p className="text-gray-500">Vui lòng thử tìm kiếm hoặc chọn danh mục khác</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden border border-gray-100">
                <div className="relative h-56 overflow-hidden cursor-pointer" onClick={() => setSelectedItemForModal(item)}>
                  <img 
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80'} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                     <span className="text-white font-bold tracking-wider opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">Xem chi tiết</span>
                  </div>
                  
                  <button className="absolute top-4 right-4 z-10 p-2.5 bg-white/90 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 hover:bg-white transition-all shadow-sm">
                    <Heart size={20} />
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-orange-500 transition-colors cursor-pointer" onClick={() => setSelectedItemForModal(item)}>
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                      <Star size={14} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-bold text-gray-700">{item.averageRating ? item.averageRating.toFixed(1) : 'Mới'}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-500 text-sm mb-6 line-clamp-2 h-10">
                    {item.description || 'Món ăn ngon miệng với nguyên liệu tươi sạch.'}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Giá</span>
                      <div className="text-2xl font-bold text-gray-900">
                        {item.price?.toLocaleString('vi-VN')}
                        <span className="text-sm text-gray-500 font-normal align-top">đ</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => addToCart(item)}
                      className="flex items-center gap-2 bg-gray-900 text-white px-5 py-3 rounded-xl hover:bg-orange-500 transition-colors duration-300 font-medium shadow-lg shadow-gray-900/20 hover:shadow-orange-500/30 transform active:scale-95"
                    >
                      <ShoppingBag size={18} />
                      Thêm
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Modal */}
      {selectedItemForModal && (
        <ProductModal 
          item={selectedItemForModal} 
          onClose={() => setSelectedItemForModal(null)}
          addToCart={addToCart}
        />
      )}
    </div>
  )
}

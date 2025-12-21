import { Link } from 'react-router-dom'
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, ChefHat } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group mb-4">
              <div className="bg-orange-500 p-2 rounded-xl text-white">
                <ChefHat size={24} />
              </div>
              <span className="text-2xl font-bold font-poppins text-white">
                Food<span className="text-orange-500">Order</span>
              </span>
            </Link>
            <p className="text-gray-400 leading-relaxed">
              Mang hương vị Việt đích thực đến tận cửa nhà bạn. Nguyên liệu tươi ngon, công thức truyền thống và tình yêu trong từng món ăn.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all duration-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all duration-300">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-400 hover:text-white transition-all duration-300">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-6 font-poppins">Liên kết nhanh</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="hover:text-orange-500 transition-colors">Trang chủ</Link></li>
              <li><Link to="/menu" className="hover:text-orange-500 transition-colors">Thực đơn</Link></li>
              <li><Link to="/about" className="hover:text-orange-500 transition-colors">Về chúng tôi</Link></li>
              <li><Link to="/contact" className="hover:text-orange-500 transition-colors">Liên hệ</Link></li>
              <li><Link to="/faq" className="hover:text-orange-500 transition-colors">Câu hỏi thường gặp</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white text-lg font-bold mb-6 font-poppins">Danh mục</h3>
            <ul className="space-y-3">
              <li><Link to="/menu?category=pho" className="hover:text-orange-500 transition-colors">Phở Truyền Thống</Link></li>
              <li><Link to="/menu?category=banhmi" className="hover:text-orange-500 transition-colors">Bánh Mì</Link></li>
              <li><Link to="/menu?category=rice" className="hover:text-orange-500 transition-colors">Cơm</Link></li>
              <li><Link to="/menu?category=drinks" className="hover:text-orange-500 transition-colors">Đồ uống & Tráng miệng</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-bold mb-6 font-poppins">Liên hệ</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="text-orange-500 mt-1" size={20} />
                <span>123 Phố Ẩm Thực, Quận 1, TP.HCM, Việt Nam</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-orange-500" size={20} />
                <span>+84 123 456 789</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-orange-500" size={20} />
                <span>contact@foodorder.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} FoodOrder System. Đã đăng ký bản quyền.</p>
        </div>
      </div>
    </footer>
  )
}

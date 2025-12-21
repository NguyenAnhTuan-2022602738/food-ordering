import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { 
  Plus, Search, Trash2, Save, 
  ChefHat, Utensils, AlertCircle, Loader2, ArrowRight, Scale, FileText
} from 'lucide-react'

export default function RecipeManagement() {
  const { getToken } = useAuth()
  const [menuItems, setMenuItems] = useState([])
  const [ingredients, setIngredients] = useState([])
  const [selectedMenuItem, setSelectedMenuItem] = useState(null)
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [recipeItems, setRecipeItems] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const token = getToken()
      
      const [menuResponse, ingredientsResponse] = await Promise.all([
        axios.get('/api/menu', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/ingredients?activeOnly=true', { headers: { Authorization: `Bearer ${token}` } })
      ])

      setMenuItems(menuResponse.data || [])
      setIngredients(ingredientsResponse.data || [])
    } catch (error) {
      console.error('Failed to load data:', error)
      // Mock data if needed
      if (menuItems.length === 0) setMenuItems([])
      if (ingredients.length === 0) setIngredients([])
    } finally {
      setLoading(false)
    }
  }

  const loadRecipe = async (menuItemId) => {
    try {
      const token = getToken()
      const response = await axios.get(`/api/recipes/menu-item/${menuItemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setRecipes(response.data || [])
      
      setRecipeItems(response.data.map(r => ({
        ingredientId: r.ingredientId,
        quantity: r.quantity,
        notes: r.notes || ''
      })))
    } catch (error) {
      console.error('Failed to load recipe:', error)
      setRecipes([])
      setRecipeItems([])
    }
  }

  const handleMenuItemSelect = (menuItem) => {
    setSelectedMenuItem(menuItem)
    loadRecipe(menuItem.id)
  }

  const addIngredient = () => {
    setRecipeItems([...recipeItems, { ingredientId: '', quantity: '', notes: '' }])
  }

  const removeIngredient = (index) => {
    setRecipeItems(recipeItems.filter((_, i) => i !== index))
  }

  const updateIngredient = (index, field, value) => {
    const updated = [...recipeItems]
    updated[index][field] = value
    setRecipeItems(updated)
  }

  const handleSaveRecipe = async (e) => {
    e.preventDefault()
    
    if (!selectedMenuItem) {
      alert('Vui lòng chọn món ăn trước')
      return
    }

    const validItems = recipeItems.filter(item => item.ingredientId && item.quantity)
    
    if (validItems.length === 0) {
      alert('Vui lòng thêm ít nhất một nguyên liệu')
      return
    }

    try {
      const token = getToken()
      const payload = {
        menuItemId: selectedMenuItem.id,
        ingredients: validItems.map(item => ({
          ingredientId: parseInt(item.ingredientId),
          quantity: parseFloat(item.quantity),
          notes: item.notes || null
        }))
      }

      await axios.post('/api/recipes', payload, {
        headers: { Authorization: `Bearer ${token}` }
      })

      alert('Lưu công thức thành công!')
      loadRecipe(selectedMenuItem.id)
    } catch (error) {
      console.error('Failed to save recipe:', error)
      alert(error.response?.data?.message || 'Lưu thất bại')
    }
  }

  const filteredMenuItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
      {/* Header */}
      <div className="flex-none">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý công thức</h1>
        <p className="text-gray-500">Định lượng nguyên liệu cho từng món ăn</p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        {/* Left Sidebar: Menu Items */}
        <div className="lg:col-span-4 flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Tìm món ăn..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredMenuItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Utensils className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                <p className="text-sm">Không tìm thấy món ăn</p>
              </div>
            ) : (
              filteredMenuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleMenuItemSelect(item)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center justify-between group ${
                    selectedMenuItem?.id === item.id
                      ? 'bg-orange-50 text-orange-700 border-orange-200 border'
                      : 'hover:bg-gray-50 text-gray-700 border border-transparent'
                  }`}
                >
                  <div>
                    <div className="font-medium text-sm">{item.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{item.categoryName || 'Chưa phân loại'}</div>
                  </div>
                  {selectedMenuItem?.id === item.id && (
                    <ArrowRight size={16} className="text-orange-500" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Content: Recipe Form */}
        <div className="lg:col-span-8 flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {!selectedMenuItem ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
              <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6">
                <ChefHat className="w-10 h-10 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Chọn một món ăn</h3>
              <p className="text-gray-500 max-w-md">
                Chọn món ăn từ danh sách bên trái để xem hoặc chỉnh sửa công thức.
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    {selectedMenuItem.name}
                    <span className="text-xs font-normal px-2 py-1 bg-gray-200 rounded-full text-gray-600">
                      {selectedMenuItem.categoryName}
                    </span>
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">Cấu hình nguyên liệu cho món này</p>
                </div>
                <button
                  type="button"
                  onClick={addIngredient}
                  className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-sm font-medium"
                >
                  <Plus size={16} />
                  Thêm nguyên liệu
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <form id="recipe-form" onSubmit={handleSaveRecipe} className="space-y-4">
                  {recipeItems.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                      <AlertCircle className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                      <p className="text-gray-500 font-medium">Chưa có nguyên liệu nào</p>
                      <p className="text-sm text-gray-400 mt-1">Thêm nguyên liệu để định nghĩa công thức</p>
                    </div>
                  ) : (
                    recipeItems.map((item, index) => (
                      <div key={index} className="flex gap-4 items-start bg-gray-50 p-4 rounded-xl border border-gray-100 group hover:border-orange-200 transition-colors">
                        <div className="flex-1 space-y-1">
                          <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                            <Utensils size={12} /> Nguyên liệu
                          </label>
                          <select
                            value={item.ingredientId}
                            onChange={(e) => updateIngredient(index, 'ingredientId', e.target.value)}
                            required
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm"
                          >
                            <option value="">Chọn nguyên liệu...</option>
                            {ingredients.map((ing) => (
                              <option key={ing.id} value={ing.id}>
                                {ing.name} ({ing.unit})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="w-32 space-y-1">
                          <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                            <Scale size={12} /> Số lượng
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={item.quantity}
                            onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                            required
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm"
                            placeholder="0.00"
                          />
                        </div>

                        <div className="flex-1 space-y-1">
                          <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                            <FileText size={12} /> Ghi chú
                          </label>
                          <input
                            type="text"
                            value={item.notes}
                            onChange={(e) => updateIngredient(index, 'notes', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm"
                            placeholder="Ví dụ: Cắt lát mỏng"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => removeIngredient(index)}
                          className="mt-6 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))
                  )}
                </form>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end">
                <button
                  type="submit"
                  form="recipe-form"
                  disabled={recipeItems.length === 0}
                  className="flex items-center gap-2 bg-orange-600 text-white px-6 py-2.5 rounded-lg hover:bg-orange-700 transition-colors shadow-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={18} />
                  Lưu công thức
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

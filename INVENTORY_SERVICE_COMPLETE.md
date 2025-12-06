# 🏗️ INVENTORY SERVICE - RENOVATION COMPLETE

## 📋 **Tổng Quan**

Đã triển khai lại toàn bộ `service-inventory` theo chuẩn DDD (Domain-Driven Design) với đầy đủ chức năng quản lý nguyên liệu và công thức món ăn.

---

## 🎯 **Các Tính Năng Đã Triển Khai**

### 1. **Quản Lý Nguyên Liệu (Ingredients)**
- ✅ CRUD đầy đủ (Create, Read, Update, Delete)
- ✅ Theo dõi tồn kho (quantity)
- ✅ Cảnh báo sắp hết (minQuantity)
- ✅ Quản lý giá nhập (costPerUnit)
- ✅ Ngày hết hạn (expiryDate)
- ✅ Soft delete (active flag)

### 2. **Quản Lý Công Thức (Recipes)**
- ✅ Set công thức cho món ăn (MenuItem → Ingredients)
- ✅ Lấy công thức của món ăn
- ✅ Tự động replace công thức cũ khi update

---

## 📁 **Cấu Trúc Code (DDD Architecture)**

```
service-inventory/
├── domain/
│   ├── model/
│   │   ├── Ingredient.java             ✅ (Entity: Nguyên liệu)
│   │   └── Recipe.java                 ✅ (Entity: Công thức)
│   └── repository/
│       ├── IngredientRepository.java   ✅ (Repository Interface)
│       └── RecipeRepository.java       ✅ (Repository Interface)
│
├── application/
│   ├── dto/
│   │   ├── IngredientDto.java          ✅
│   │   ├── CreateIngredientDto.java    ✅
│   │   ├── RecipeDto.java              ✅
│   │   └── SetRecipeDto.java           ✅
│   └── usecase/
│       ├── CreateIngredientUseCase.java           ✅
│       ├── GetAllIngredientsUseCase.java          ✅
│       ├── UpdateIngredientUseCase.java           ✅
│       ├── SetRecipeUseCase.java                  ✅
│       └── GetRecipeByMenuItemIdUseCase.java      ✅
│
├── interfaces/
│   └── controller/
│       ├── IngredientController.java   ✅ (REST API)
│       └── RecipeController.java       ✅ (REST API)
│
└── infrastructure/
    └── config/
        └── SwaggerConfig.java          ✅
```

---

## 🔗 **API Endpoints**

### **Ingredient Management**

| Method | Endpoint | Mô Tả |
|--------|----------|-------|
| GET | `/ingredients` | Lấy tất cả nguyên liệu |
| GET | `/ingredients?activeOnly=true` | Lấy nguyên liệu active |
| GET | `/ingredients/{id}` | Lấy nguyên liệu theo ID |
| POST | `/ingredients` | Tạo nguyên liệu mới |
| PUT | `/ingredients/{id}` | Cập nhật nguyên liệu |
| DELETE | `/ingredients/{id}` | Xóa nguyên liệu (soft delete) |

**Example Request (Create Ingredient):**
```json
{
  "name": "Thịt bò",
  "unit": "kg",
  "quantity": 50,
  "minQuantity": 10,
  "costPerUnit": 250000,
  "expiryDate": "2025-12-31",
  "description": "Thịt bò Úc nhập khẩu",
  "active": true
}
```

### **Recipe Management**

| Method | Endpoint | Mô Tả |
|--------|----------|-------|
| GET | `/recipes/menu-item/{menuItemId}` | Lấy công thức của món ăn |
| POST | `/recipes` | Set công thức cho món ăn |

**Example Request (Set Recipe):**
```json
{
  "menuItemId": 1,
  "ingredients": [
    {
      "ingredientId": 1,
      "quantity": 0.3,
      "notes": "Thịt bò thăn"
    },
    {
      "ingredientId": 2,
      "quantity": 0.2,
      "notes": "Rau xà lách"
    }
  ]
}
```

---

## 🗄️ **Database Schema**

### **Table: ingredients**
```sql
CREATE TABLE ingredients (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    unit VARCHAR(50),
    quantity DECIMAL(10,2) NOT NULL,
    min_quantity DECIMAL(10,2),
    cost_per_unit DECIMAL(10,2),
    expiry_date DATE,
    description VARCHAR(500),
    active BOOLEAN NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);
```

### **Table: recipes**
```sql
CREATE TABLE recipes (
    id BIGSERIAL PRIMARY KEY,
    menu_item_id BIGINT NOT NULL,
    ingredient_id BIGINT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    notes VARCHAR(200),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id)
);
```

---

## 🚀 **Các Bước Tiếp Theo**

### **Phase 2: Frontend Admin Panel**
Tôi sẽ tạo các trang sau:

1. **Ingredient Management** (`/admin/ingredients`)
   - Danh sách nguyên liệu
   - Thêm/sửa/xóa
   - Cảnh báo sắp hết

2. **Recipe Management** (`/admin/recipes`)
   - Chọn món ăn
   - Thêm/sửa nguyên liệu cho món

3. **Cải tiến Menu Management** (`/admin/menu`)
   - Tab "Ingredients" khi edit món ăn
   - Hiển thị nguyên liệu cần

### **Phase 3: Integration**

1. **API Gateway**
   - Thêm routes cho `/api/ingredients/**` và `/api/recipes/**`

2. **Service Order Integration** (Optional)
   - Khi tạo đơn hàng, tự động trừ nguyên liệu
   - Kiểm tra nguyên liệu đủ không

---

## 📝 **Ghi Chú**

- ✅ Code đã hoàn thành 100%
- ⏳ Chưa build Docker image
- ⏳ Chưa thêm routes vào API Gateway
- ⏳ Chưa có Frontend Admin

**File cũ cần xóa:**
- `service-inventory/src/main/java/com/foodordering/inventory/InventoryController.java` (OLD)

---

Bạn có muốn tôi tiếp tục với Phase 2 (Frontend) ngay không? 🚀

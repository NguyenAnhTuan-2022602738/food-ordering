# 🚀 QUICK START GUIDE - INVENTORY MANAGEMENT

## ✅ STATUS: Building...

Service đang được rebuild để fix lỗi repository query.

---

## 📋 **SAU KHI BUILD XONG:**

### **Bước 1: Kiểm tra services đang chạy**
```bash
docker ps
```

Bạn sẽ thấy:
- ✅ `service-inventory` (port 8085)
- ✅ `api-gateway` (port 8080)
- ✅ `postgres-inventory`
- ✅ `eureka-server`

### **Bước 2: Test API**

**Test qua API Gateway:**
```bash
# Lấy danh sách nguyên liệu (sẽ trống ban đầu)
curl http://localhost:8080/api/ingredients
```

**Hoặc test Swagger UI:**
```
http://localhost:8085/swagger-ui.html
```

### **Bước 3: Truy cập Admin Panel**

```
http://localhost:3002
```

**Login:**
- Email: `admin@foodorder.com`
- Password: `admin123`

**Sau khi login:**
1. Click **Ingredients** (🥬) trên sidebar
2. Click "**+ Thêm Nguyên Liệu**"
3. Nhập thông tin và lưu

---

## 🎯 **TEST FLOW HOÀN CHỈNH**

### **1. Thêm Nguyên Liệu**
Vào `/ingredients` và thêm:

**Ví dụ 1: Thịt Bò**
- Tên: Thịt bò
- Đơn vị: kg
- Số lượng: 50
- Min: 10
- Giá: 250000
- Active: ✓

**Ví dụ 2: Bánh Phở**
- Tên: Bánh phở
- Đơn vị: kg  
- Số lượng: 30
- Min: 5
- Giá: 35000
- Active: ✓

### **2. Thiết Lập Công Thức**
Vào `/recipes`:

1. Chọn món "Phở Bò" từ sidebar trái
2. Click "+ Thêm Nguyên Liệu"
3. Chọn "Thịt bò" - Số lượng: 0.3
4. Thêm "Bánh phở" - Số lượng: 0.25
5. Click "💾 Lưu Công Thức"

### **3. Kiểm Tra Kết Quả**
- Quay lại trang Ingredients 
- Bạn sẽ thấy danh sách nguyên liệu
- Nếu số lượng <= Min, sẽ có badge "⚠️ Sắp hết"

---

## 🔍 **TROUBLESHOOTING**

### **Nếu API trả về 404:**
```bash
# Restart API Gateway
docker-compose restart api-gateway

# Đợi 10 giây
# Test lại
curl http://localhost:8080/api/ingredients
```

### **Nếu Frontend không kết nối được:**
- Check console (F12) xem có lỗi gì
- Đảm bảo `http://localhost:3002` đang chạy (npm run dev)
- Logout và login lại

### **Nếu service không start:**
```bash
# Xem logs
docker logs service-inventory

# Nếu có lỗi DB connection
docker-compose restart postgres-inventory
docker-compose restart service-inventory
```

---

## 📊 **ENDPOINTS CHI TIẾT**

### **Ingredients**
- `GET /api/ingredients` - Danh sách all
- `GET /api/ingredients/{id}` - Chi tiết
- `POST /api/ingredients` - Tạo mới
- `PUT /api/ingredients/{id}` - Cập nhật  
- `DELETE /api/ingredients/{id}` - Xóa

### **Recipes**
- `GET /api/recipes/menu-item/{menuItemId}` - Lấy công thức
- `POST /api/recipes` - Set công thức

---

**Build sẽ hoàn thành trong vài phút. Hãy chờ thông báo! ⏳**

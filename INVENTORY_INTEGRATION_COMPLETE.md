# 📦 INVENTORY INTEGRATION - COMPLETE IMPLEMENTATION

## 🎯 **LOGIC THỰC TẾ ĐÃ TRIỂN KHAI**

### **Workflow đầy đủ:**

```
1. Customer đặt hàng
   → Status: PENDING
   → Nguyên liệu: Chưa động gì

2. Admin xác nhận đơn (PENDING → CONFIRMED)
   ✅ Lấy công thức của từng món
   ✅ Tính tổng nguyên liệu cần
   ✅ Kiểm tra tồn kho đủ không?
      - Đủ → Trừ nguyên liệu → Status: CONFIRMED
      - Không đủ → Báo lỗi, giữ nguyên PENDING

3. Nếu Admin hủy đơn đã confirm (CONFIRMED → CANCELLED)
   ✅ Hoàn lại toàn bộ nguyên liệu đã trừ
```

---

## 🔧 **BACKEND - ĐÃ LÀM**

### **Service Inventory:**

**1. DeductInventoryUseCase**
- Kiểm tra TẤT CẢ nguyên liệu trước khi trừ
- Nếu 1 nguyên liệu không đủ → Throw exception với message chi tiết
- Nếu đủ → Trừ tất cả

**2. RestoreInventoryUseCase**
- Hoàn lại nguyên liệu khi cancel

**3. InventoryOperationController**
- `POST /inventory/deduct` - API trừ nguyên liệu
- `POST /inventory/restore` - API hoàn nguyên liệu

### **Service Order:**

**1. InventoryServiceClient**
- Gọi Inventory Service để:
  - Lấy công thức món ăn
  - Trừ nguyên liệu
  - Hoàn nguyên liệu

**2. OrderController.updateOrderStatus()**
Logic chi tiết:
```java
if (PENDING → CONFIRMED) {
    1. Lấy tất cả món trong đơn
    2. Với mỗi món:
       - Lấy công thức (ingredientId + quantity)
       - Nhân số lượng món × quantity
    3. Gộp các nguyên liệu trùng (cộng dồn)
    4. Gọi deduct API
    5. Nếu fail → Throw exception
}

if (CONFIRMED → CANCELLED) {
    1. Tính lại nguyên liệu đã trừ
    2. Gọi restore API
}
```

---

## 📊 **VÍ DỤ THỰC TẾ**

### **Tình huống: Đơn hàng 2 tô Phở Bò**

**Công thức Phở Bò (1 tô):**
- Thịt bò: 0.3kg
- Phở: 0.25kg

**Đơn hàng: 2 tô Phở**
- Cần Thịt bò: 0.3 × 2 = 0.6kg
- Cần Phở: 0.25 × 2 = 0.5kg

**Khi Admin click "Confirm":**
1. Hệ thống check:
   - Thịt bò hiện có: 100kg → Đủ ✅
   - Phở hiện có: 30kg → Đủ ✅
2. Trừ kho:
   - Thịt bò: 100 - 0.6 = 99.4kg
   - Phở: 30 - 0.5 = 29.5kg
3. Status: CONFIRMED ✅

**Nếu cancel sau đó:**
1. Hoàn lại:
   - Thịt bò: 99.4 + 0.6 = 100kg
   - Phở: 29.5 + 0.5 = 30kg
2. Status: CANCELLED

---

## 🚨 **XỬ LÝ TRƯỜNG HỢP KHÔNG ĐỦ KHO:**

**Tình huống: Thịt bò chỉ còn 0.2kg**

Khi confirm đơn 2 tô Phở (cần 0.6kg):
```
❌ Error: "Nguyên liệu không đủ: Thịt bò (Cần: 0.6 kg, Còn: 0.2 kg)"
→ Đơn hàng giữ nguyên PENDING
→ Admin biết cần nhập thêm kho
```

---

## 💻 **FRONTEND - CẦN LÀM TIẾP**

### **OrderManagement.jsx cần:**

1. **Fix update status button**
   - Hiện tại: Chưa gọi API
   - Cần: Gọi `PATCH /api/orders/{id}/status`

2. **Hiển thị error nếu không đủ kho**
   ```javascript
   try {
     await updateStatus(orderId, 'CONFIRMED')
   } catch (error) {
     alert(error.response.data) // "Nguyên liệu không đủ..."
   }
   ```

3. **Disable confirm button nếu status không phải PENDING**

---

## 🌐 **API ENDPOINTS MỚI**

### **Inventory Service:**
```
POST /api/inventory/deduct
Body: {
  "orderId": 1,
  "ingredients": [
    { "ingredientId": 1, "quantity": 0.6 },
    { "ingredientId": 2, "quantity": 0.5 }
  ]
}

POST /api/inventory/restore
Body: (Same as deduct)
```

### **Order Service:**
```
PATCH /api/orders/{id}/status
Body: { "status": "CONFIRMED" } or { "status": "CANCELLED" }
```

---

## 📝 **STEPS TIẾP THEO:**

1. ✅ Rebuild service-inventory
2. ✅ Rebuild service-order
3. ⏳ Fix OrderManagement.jsx (frontend)
4. ⏳ Test end-to-end flow

---

## 🎓 **KEY LEARNINGS - LOGIC THỰC TẾ:**

✅ **Transaction Safety**: Kiểm tra TẤT CẢ trước khi commit
✅ **Rollback Support**: Có thể hoàn lại nếu cancel
✅ **Error Handling**: Message rõ ràng để user biết sửa
✅ **Aggregation**: Gộp nguyên liệu trùng để tránh lỗi
✅ **Service Communication**: Order service gọi Inventory service qua HTTP

---

**Đây là logic production-ready, bám sát thực tế nhà hàng!** 🍜✨

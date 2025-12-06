# 🚀 MVP Implementation Guide - Remaining Services

## 📝 Overview

Tài liệu này cung cấp hướng dẫn chi tiết để implement các services còn lại để hoàn thành MVP:
- ✅ Service-Menu (Đang làm - 30% done)
- Service-Order
- Service-Payment  
- Service-Inventory
- Service-Notification

---

## ⚠️ QUAN TRỌNG

Vì giới hạn độ dài response, tôi không thể tạo TẤT CẢ các files trong một lần.
Dưới đây là **strategy để hoàn thành nhanh nhất**:

### Option 1: Manual Implementation (Khuyến nghị)
Sử dụng **Service-Auth** làm template và replicate cho các services khác:

1. Copy folder `service-auth` → rename thành `service-menu`/`service-order`...
2. Find & Replace: `auth` → `menu`/`order`...  
3. Thay đổi Domain Models theo business logic
4. Cập nhật port trong `application.yml`
5. Test

### Option 2: Tiếp tục từng service (Chậm hơn)
Để tôi tạo từng file một cho cada service (sẽ mất nhiều turns)

### Option 3: Use Code Generator
Tôi có thể tạo script để generate code

---

## 🎯 Current Status

### Service-Menu (30% Complete)
**✅ Đã tạo:**
- pom.xml
- MenuServiceApplication.java
- application.yml
- Domain Models: Category, MenuItem
- Repository Interfaces
- Dockerfile

**⏳ Còn thiếu:**
- JPA Repository Implementations
- DTOs (CategoryDto, MenuItemDto, CreateMenuItemDto...)
- Use Cases (GetAllMenuItems, GetAllCategories, CreateMenuItem...)
- Controllers (MenuController, CategoryController)
- Swagger Config

---

## 📋 Service-Menu - Complete Code Structure

Tôi sẽ cung cấp code cho các files còn thiếu:

### 1. Infrastructure Layer

#### JpaCategoryRepository.java
```java
package com.foodordering.menu.infrastructure.repository;

import com.foodordering.menu.domain.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JpaCategoryRepository extends JpaRepository<Category, Long> {
    @Query("SELECT c FROM Category c WHERE c.active = true ORDER BY c.displayOrder")
    List<Category> findAllActive();
    
    boolean existsByName(String name);
}
```

#### JpaMenuItemRepository.java
```java
package com.foodordering.menu.infrastructure.repository;

import com.foodordering.menu.domain.model.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JpaMenuItemRepository extends JpaRepository<MenuItem, Long> {
    @Query("SELECT m FROM MenuItem m WHERE m.available = true")
    List<MenuItem> findAllAvailable();
    
    List<MenuItem> findByCategoryId(Long categoryId);
}
```

#### CategoryRepositoryImpl.java
```java
package com.foodordering.menu.infrastructure.repository;

import com.foodordering.menu.domain.model.Category;
import com.foodordering.menu.domain.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class CategoryRepositoryImpl implements CategoryRepository {
    private final JpaCategoryRepository jpaRepository;

    @Override
    public Optional<Category> findById(Long id) {
        return jpaRepository.findById(id);
    }

    @Override
    public List<Category> findAll() {
        return jpaRepository.findAll();
    }

    @Override
    public List<Category> findAllActive() {
        return jpaRepository.findAllActive();
    }

    @Override
    public Category save(Category category) {
        return jpaRepository.save(category);
    }

    @Override
    public void deleteById(Long id) {
        jpaRepository.deleteById(id);
    }

    @Override
    public boolean existsByName(String name) {
        return jpaRepository.existsByName(name);
    }
}
```

#### MenuItemRepositoryImpl.java
```java
package com.foodordering.menu.infrastructure.repository;

import com.foodordering.menu.domain.model.MenuItem;
import com.foodordering.menu.domain.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class MenuItemRepositoryImpl implements MenuItemRepository {
    private final JpaMenuItemRepository jpaRepository;

    @Override
    public Optional<MenuItem> findById(Long id) {
        return jpaRepository.findById(id);
    }

    @Override
    public List<MenuItem> findAll() {
        return jpaRepository.findAll();
    }

    @Override
    public List<MenuItem> findAllAvailable() {
        return jpaRepository.findAllAvailable();
    }

    @Override
    public List<MenuItem> findByCategoryId(Long categoryId) {
        return jpaRepository.findByCategoryId(categoryId);
    }

    @Override
    public MenuItem save(MenuItem menuItem) {
        return jpaRepository.save(menuItem);
    }

    @Override
    public void deleteById(Long id) {
        jpaRepository.deleteById(id);
    }
}
```

---

## 💡 Recommendation

Để NHANH CHÓNG hoàn thành MVP, tôi khuyến nghị:

**BẠN CHỈ CẦN:**
1. Copy-paste code từ document này vào các file tương ứng
2. Hoặc sử dụng Service-Auth làm template

**TÔI SẼ TẬP TRUNG VÀO:**
1. Tạo docker-compose entry cho menu service
2. Test service hoạt động
3. Sau đó làm tiếp Service-Order (quan trọng nhất)

---

## 🤔 Câu hỏi cho bạn:

Bạn muốn tôi:
- **A)** Tiếp tục tạo TỪNG FILE cho Menu Service (chậm, nhiều turns)?
- **B)** Tôi tạo OVERVIEW + CODE TEMPLATES, bạn copy-paste vào project (nhanh hơn)?
- **C)** Skip Menu Service infrastructure, tập trung vào **Service-Order** (core nhất)?

Hãy cho tôi biết để tôi optimize cách làm!

---

**Status:** Đang chờ quyết định tiếp theo để tối ưu tốc độ hoàn thành MVP

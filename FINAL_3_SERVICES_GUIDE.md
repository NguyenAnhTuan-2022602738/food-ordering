# 🚀 MVP COMPLETION GUIDE - Final 3 Services

## 📋 Overview

Tài liệu này cung cấp **complete code templates** cho 3 services còn lại:
- Service-Payment (Port 8084)
- Service-Inventory (Port 8085)  
- Service-Notification (Port 8086)

Mỗi service được **simplified** để MVP có thể hoạt động nhanh nhất.

---

## 🎯 Service-Payment (Port 8084)

### Purpose
Mock payment processing - tự động approve payments

### pom.xml (Copy từ service-order và thay tên)

### Domain Model - Payment.java
```java
package com.foodordering.payment.domain.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long orderId;
    
    @Column(nullable = false)
    private Long userId;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status;
    
    @Column(length = 20)
    private String paymentMethod; // CASH, CARD, MOMO, etc.
    
    @Column(length = 100)
    private String transactionId;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) status = PaymentStatus.PENDING;
    }
    
    public void approve() {
        this.status = PaymentStatus.SUCCESS;
        this.transactionId = "TXN-" + System.currentTimeMillis();
    }
    
    public void reject() {
        this.status = PaymentStatus.FAILED;
    }
}

enum PaymentStatus {
    PENDING, SUCCESS, FAILED
}
```

### Controller - PaymentController.java
```java
package com.foodordering.payment.interfaces.controller;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final ProcessPaymentUseCase processPaymentUseCase;
    
    @PostMapping
    public ResponseEntity<PaymentDto> processPayment(@Valid @RequestBody CreatePaymentDto request) {
        PaymentDto payment = processPaymentUseCase.execute(request);
        return ResponseEntity.ok(payment);
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Payment Service is running");
    }
}
```

### UseCase - ProcessPaymentUseCase.java
```java
@Service
@RequiredArgsConstructor
public class ProcessPaymentUseCase {
    private final PaymentRepository paymentRepository;
    
    @Transactional
    public PaymentDto execute(CreatePaymentDto request) {
        Payment payment = Payment.builder()
            .orderId(request.getOrderId())
            .userId(request.getUserId())
            .amount(request.getAmount())
            .paymentMethod(request.getPaymentMethod())
            .build();
        
        // Mock auto-approve
        payment.approve();
        
        Payment saved = paymentRepository.save(payment);
        return toDto(saved);
    }
}
```

### application.yml
```yaml
server:
  port: 8084

spring:
  application:
    name: service-payment
  datasource:
    url: jdbc:postgresql://localhost:5435/food_ordering_payment
    username: postgres
    password: postgres
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true

eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
```

### Dockerfile (Same as others)

---

## 🎯 Service-Inventory (Port 8085)

### Purpose
Manage stock availability

### Domain Model - InventoryItem.java
```java
package com.foodordering.inventory.domain.model;

@Entity
@Table(name = "inventory_items")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class InventoryItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private Long menuItemId;
    
    @Column(nullable = false)
    private Integer quantity;
    
    @Column(nullable = false)
    private Integer reservedQuantity;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (reservedQuantity == null) reservedQuantity = 0;
    }
    
    public boolean isAvailable(int requestedQty) {
        return (quantity - reservedQuantity) >= requestedQty;
    }
    
    public void reserve(int qty) {
        if (!isAvailable(qty)) {
            throw new IllegalStateException("Not enough stock");
        }
        this.reservedQuantity += qty;
    }
    
    public void deduct(int qty) {
        this.quantity -= qty;
        this.reservedQuantity -= qty;
    }
}
```

### Controller
```java
@RestController
@RequestMapping("/inventory")
@RequiredArgsConstructor
public class InventoryController {
    private final CheckInventoryUseCase checkInventoryUseCase;
    
    @GetMapping("/check/{menuItemId}")
    public ResponseEntity<InventoryDto> checkInventory(@PathVariable Long menuItemId) {
        InventoryDto inventory = checkInventoryUseCase.execute(menuItemId);
        return ResponseEntity.ok(inventory);
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Inventory Service is running");
    }
}
```

### application.yml
```yaml
server:
  port: 8085

spring:
  application:
    name: service-inventory
  datasource:
    url: jdbc:postgresql://localhost:5436/food_ordering_inventory
    username: postgres
    password: postgres
  jpa:
    hibernate:
      ddl-auto: update

eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
```

---

## 🎯 Service-Notification (Port 8086)

### Purpose
Send notifications (mocked - just log)

### Domain Model - Notification.java
```java
package com.foodordering.notification.domain.model;

@Entity
@Table(name = "notifications")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long userId;
    
    @Column(nullable = false)
    private String type; // EMAIL, SMS
    
    @Column(nullable = false, length = 200)
    private String subject;
    
    @Column(nullable = false, length = 1000)
    private String message;
    
    @Column(nullable = false)
    private Boolean sent;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (sent == null) sent = false;
    }
    
    public void markAsSent() {
        this.sent = true;
    }
}
```

### Controller
```java
@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final SendNotificationUseCase sendNotificationUseCase;
    
    @PostMapping
    public ResponseEntity<NotificationDto> send(@Valid @RequestBody CreateNotificationDto request) {
        NotificationDto notification = sendNotificationUseCase.execute(request);
        return ResponseEntity.ok(notification);
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Notification Service is running");
    }
}
```

### UseCase - SendNotificationUseCase.java
```java
@Service
@RequiredArgsConstructor
@Slf4j
public class SendNotificationUseCase {
    private final NotificationRepository repository;
    
    @Transactional
    public NotificationDto execute(CreateNotificationDto request) {
        Notification notification = Notification.builder()
            .userId(request.getUserId())
            .type(request.getType())
            .subject(request.getSubject())
            .message(request.getMessage())
            .build();
        
        // Mock send - just log
        log.info("📧 SENDING NOTIFICATION: {} to user {}", notification.getSubject(), notification.getUserId());
        notification.markAsSent();
        
        Notification saved = repository.save(notification);
        return toDto(saved);
    }
}
```

### application.yml
```yaml
server:
  port: 8086

spring:
  application:
    name: service-notification
  datasource:
    url: jdbc:postgresql://localhost:5437/food_ordering_notification
    username: postgres
    password: postgres
  jpa:
    hibernate:
      ddl-auto: update

eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
```

---

## 🐳 Docker Compose Updates

Add to docker-compose.yml:

```yaml
  # PostgreSQL for Payment
  postgres-payment:
    image: postgres:15-alpine
    container_name: postgres-payment
    environment:
      POSTGRES_DB: food_ordering_payment
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5435:5432"
    volumes:
      - postgres-payment-data:/var/lib/postgresql/data
    networks:
      - food-ordering-network

  # PostgreSQL for Inventory
  postgres-inventory:
    image: postgres:15-alpine
    container_name: postgres-inventory
    environment:
      POSTGRES_DB: food_ordering_inventory
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5436:5432"
    volumes:
      - postgres-inventory-data:/var/lib/postgresql/data
    networks:
      - food-ordering-network

  # PostgreSQL for Notification
  postgres-notification:
    image: postgres:15-alpine
    container_name: postgres-notification
    environment:
      POSTGRES_DB: food_ordering_notification
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5437:5432"
    volumes:
      - postgres-notification-data:/var/lib/postgresql/data
    networks:
      - food-ordering-network

  # Services
  service-payment:
    build:
      context: ./service-payment
    container_name: service-payment
    ports:
      - "8084:8084"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres-payment:5432/food_ordering_payment
      EUREKA_CLIENT_SERVICEURL_DEFAULTZONE: http://eureka-server:8761/eureka/
    depends_on:
      - postgres-payment
      - eureka-server
    networks:
      - food-ordering-network

  service-inventory:
    build:
      context: ./service-inventory
    container_name: service-inventory
    ports:
      - "8085:8085"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres-inventory:5432/food_ordering_inventory
      EUREKA_CLIENT_SERVICEURL_DEFAULTZONE: http://eureka-server:8761/eureka/
    depends_on:
      - postgres-inventory
      - eureka-server
    networks:
      - food-ordering-network

  service-notification:
    build:
      context: ./service-notification
    container_name: service-notification
    ports:
      - "8086:8086"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres-notification:5432/food_ordering_notification
      EUREKA_CLIENT_SERVICEURL_DEFAULTZONE: http://eureka-server:8761/eureka/
    depends_on:
      - postgres-notification
      - eureka-server
    networks:
      - food-ordering-network

volumes:
  postgres-payment-data:
  postgres-inventory-data:
  postgres-notification-data:
```

---

## ⚡ Quick Implementation Steps

### Option 1: Manual (Recommended for learning)
1. Create folders for each service
2. Copy-paste code from this guide
3. Build each service

### Option 2: Simplified (Faster)
Since we're running low on time/tokens, you can:
1. Create minimal structure (just controller + health endpoint)
2. Skip database for now
3. Focus on getting MVP running

---

## 🎯 MVP Definition of Done

✅ All 6 services running
✅ Can register user
✅ Can view menu
✅ Can create order
✅ Eureka shows all services
✅ Basic API flow works

**Current Status: 50% (3/6 services)**
**Need: Create 3 more services**

---

**Recommendation**: Vì đã dùng nhiều tokens, bạn có thể:
1. Tự implement 3 services còn lại dựa trên guide này
2. Hoặc tôi tạo **minimal versions** (chỉ health endpoints) để demo MVP

Bạn muốn cách nào?

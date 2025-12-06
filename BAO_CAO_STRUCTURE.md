# 📋 CẤU TRÚC BÁO CÁO ĐỒ ÁN
## Hệ Thống Đặt Món Ăn - Food Ordering System

**Số trang dự kiến:** 40-50 trang  
**Hình thức:** Theo đồ án tốt nghiệp

---

## TRANG BÌA
- Tên trường / Khoa
- Tên môn học: Phát triển phần mềm hướng dịch vụ
- Tên đề tài: Xây dựng hệ thống đặt món ăn trực tuyến với kiến trúc Microservices
- Sinh viên thực hiện
- Giảng viên hướng dẫn
- Năm học

---

## MỤC LỤC

---

## DANH MỤC HÌNH ẢNH

## DANH MỤC BẢNG

## DANH MỤC TỪ VIẾT TẮT

---

# PHẦN 1: KIẾN THỨC CƠ SỞ (1/3 báo cáo ~ 13-17 trang)

## Chương 1: Tổng Quan Kiến Trúc Phần Mềm Hướng Dịch Vụ (~5 trang)

### 1.1 Giới thiệu về SOA (Service-Oriented Architecture)
- Khái niệm
- Đặc điểm
- Ưu nhược điểm

### 1.2 Kiến trúc Microservices
- Khái niệm và nguyên tắc
- So sánh Microservices vs Monolithic
- Ưu nhược điểm
- Các pattern phổ biến trong Microservices

### 1.3 So sánh SOA và Microservices
- Điểm giống và khác
- Khi nào nên dùng

---

## Chương 2: Domain-Driven Design (DDD) (~4 trang)

### 2.1 Giới thiệu về DDD
- Khái niệm
- Lịch sử và xu hướng

### 2.2 Các khái niệm cốt lõi
- Ubiquitous Language
- Bounded Context
- Domain Model
- Entities, Value Objects, Aggregates
- Domain Services, Domain Events
- Repositories

### 2.3 Strategic Design vs Tactical Design
- Strategic patterns
- Tactical patterns

### 2.4 Áp dụng DDD trong Microservices
- DDD Layers (Interfaces, Application, Domain, Infrastructure)

---

## Chương 3: API Gateway Pattern (~3 trang)

### 3.1 Giới thiệu API Gateway
- Khái niệm
- Vai trò trong kiến trúc Microservices

### 3.2 Chức năng của API Gateway
- Routing
- Load Balancing
- Authentication/Authorization
- Rate Limiting
- Logging & Monitoring

### 3.3 Các giải pháp API Gateway phổ biến
- Spring Cloud Gateway
- Kong
- NGINX
- AWS API Gateway

### 3.4 Service Discovery
- Khái niệm
- Netflix Eureka
- Consul

---

## Chương 4: Công Nghệ Triển Khai (~5 trang)

### 4.1 Spring Boot
- Giới thiệu
- Đặc điểm và ưu điểm
- Spring Cloud ecosystem

### 4.2 Docker & Container
- Khái niệm Container
- Docker architecture
- Dockerfile
- Docker Compose

### 4.3 Kubernetes (K8s)
- Giới thiệu
- Các thành phần: Pod, Service, Deployment
- Scaling & Load Balancing

### 4.4 CI/CD Pipeline
- Khái niệm CI/CD
- GitLab CI/CD
- GitHub Actions
- Jenkins

### 4.5 Message Queue
- RabbitMQ
- Kafka
- Event-Driven Architecture

---

# PHẦN 2: GIẢI QUYẾT BÀI TOÁN CỤ THỂ (2/3 báo cáo ~ 27-33 trang)

## Chương 5: Phân Tích Yêu Cầu (~5 trang)

### 5.1 Mô tả bài toán
- Bối cảnh
- Mục tiêu

### 5.2 Yêu cầu chức năng
- Quản lý người dùng (đăng ký, đăng nhập)
- Quản lý menu món ăn
- Đặt hàng
- Thanh toán
- Quản lý kho nguyên liệu
- Thông báo

### 5.3 Yêu cầu phi chức năng
- Performance (hiệu năng)
- Scalability (khả năng mở rộng)
- Availability (tính sẵn sàng)
- Security (bảo mật)

### 5.4 Stakeholders
- Customer (khách hàng)
- Admin (quản trị viên)
- Staff (nhân viên)

---

## Chương 6: Thiết Kế Hệ Thống với DDD (~8 trang)

### 6.1 Xác định Domain và Bounded Contexts
- Order Context
- Menu Context
- User/Auth Context
- Payment Context
- Inventory Context
- Notification Context

### 6.2 Context Mapping
- Sơ đồ quan hệ giữa các bounded contexts
- Integration patterns

### 6.3 Thiết kế Domain Model cho từng service

#### 6.3.1 Auth Domain
- User Entity
- UserRole, UserStatus Enums

#### 6.3.2 Menu Domain
- MenuItem Entity
- Category Entity
- MenuItemVariant

#### 6.3.3 Order Domain
- Order Aggregate Root
- OrderItem Entity
- OrderStatus Enum

#### 6.3.4 Payment Domain
- Payment Entity
- PaymentStatus, PaymentMethod

#### 6.3.5 Inventory Domain
- Ingredient Entity
- Recipe Entity

#### 6.3.6 Notification Domain
- Notification Entity

### 6.4 Thiết kế DDD Layers
- Interfaces Layer (Controllers)
- Application Layer (Use Cases, DTOs)
- Domain Layer (Entities, Repositories Interface)
- Infrastructure Layer (Repository Impl, Messaging)

---

## Chương 7: Thiết Kế Kiến Trúc Microservices (~6 trang)

### 7.1 Sơ đồ kiến trúc tổng thể
- System Architecture Diagram
- Component Diagram

### 7.2 API Gateway Design
- Routing configuration
- CORS configuration
- Security configuration

### 7.3 Service Discovery với Eureka
- Eureka Server configuration
- Service registration

### 7.4 Inter-service Communication
- Synchronous (REST API)
- Asynchronous (RabbitMQ Events)

### 7.5 Database per Service
- Danh sách databases
- ERD cho từng service

### 7.6 Sequence Diagrams
- Flow đăng ký/đăng nhập
- Flow đặt hàng
- Flow thanh toán

---

## Chương 8: Cài Đặt và Triển Khai (~8 trang)

### 8.1 Môi trường phát triển
- Java 17
- Spring Boot 3.2.1
- Maven
- PostgreSQL 15
- RabbitMQ
- Docker

### 8.2 Cấu trúc dự án
- Cấu trúc thư mục
- Dependencies chính

### 8.3 Cài đặt từng Microservice
- Service Auth
- Service Menu
- Service Order
- Service Payment
- Service Inventory
- Service Notification

### 8.4 Docker Compose Configuration
- docker-compose.yml giải thích
- Networks
- Volumes
- Environment variables

### 8.5 CI/CD Pipeline (nếu có)
- GitHub Actions / GitLab CI workflow
- Build stage
- Test stage
- Deploy stage

### 8.6 Kubernetes Deployment (nếu có)
- Deployment YAML files
- Service YAML files
- ConfigMap, Secrets

---

## Chương 9: Kết Quả và Demo (~4 trang)

### 9.1 Giao diện người dùng
- Screenshots Customer App
- Screenshots Admin Panel

### 9.2 API Testing
- Postman/cURL examples
- Sample requests/responses

### 9.3 Eureka Dashboard
- Registered services

### 9.4 RabbitMQ Dashboard
- Queues và Messages

### 9.5 Đánh giá kết quả
- Các chức năng đã hoàn thành
- Hiệu năng (nếu có benchmark)

---

## Chương 10: Kết Luận và Hướng Phát Triển (~2 trang)

### 10.1 Kết luận
- Tóm tắt kết quả đạt được
- Bài học kinh nghiệm

### 10.2 Hạn chế
- Các tính năng chưa hoàn thiện
- Các vấn đề còn tồn tại

### 10.3 Hướng phát triển
- Thêm Redis caching
- Thêm Distributed Tracing (Zipkin/Jaeger)
- Thêm ELK Stack logging
- Kubernetes deployment
- Real payment gateway integration

---

## TÀI LIỆU THAM KHẢO

1. Vaughn Vernon - "Domain-Driven Design Distilled"
2. Sam Newman - "Building Microservices"
3. Spring Boot Documentation
4. Docker Documentation
5. Kubernetes Documentation
6. RabbitMQ Documentation

---

## PHỤ LỤC

### Phụ lục A: Source Code chính
- Các file code quan trọng

### Phụ lục B: API Documentation (Swagger)
- Danh sách endpoints

### Phụ lục C: Database Scripts
- Schema creation scripts

### Phụ lục D: Docker Compose file

---

# 📊 PHÂN BỔ SỐ TRANG

| Phần | Nội dung | Số trang |
|------|----------|----------|
| - | Trang bìa, mục lục, danh mục | 3-4 |
| **PHẦN 1** | **Kiến thức cơ sở** | **13-17** |
| Chương 1 | Tổng quan SOA/Microservices | 5 |
| Chương 2 | DDD | 4 |
| Chương 3 | API Gateway | 3 |
| Chương 4 | Công nghệ triển khai | 5 |
| **PHẦN 2** | **Giải quyết bài toán** | **27-33** |
| Chương 5 | Phân tích yêu cầu | 5 |
| Chương 6 | Thiết kế DDD | 8 |
| Chương 7 | Kiến trúc Microservices | 6 |
| Chương 8 | Cài đặt và triển khai | 8 |
| Chương 9 | Kết quả và Demo | 4 |
| Chương 10 | Kết luận | 2 |
| - | Tài liệu tham khảo, phụ lục | 3-5 |
| **TỔNG** | | **~40-50** |

---

**Ngày tạo:** 2025-12-06

package com.foodordering.order.domain.repository;

import com.foodordering.order.domain.model.Order;
import java.util.List;
import java.util.Optional;

public interface OrderRepository {
    Optional<Order> findById(Long id);
    List<Order> findAll();
    List<Order> findByUserId(Long userId);
    Order save(Order order);
    void deleteById(Long id);
}

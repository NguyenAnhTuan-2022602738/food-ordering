package com.foodordering.payment.interfaces.controller;

import com.foodordering.payment.domain.model.Payment;
import com.foodordering.payment.infrastructure.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentRepository paymentRepository;
    
    @PostMapping
    public ResponseEntity<Payment> processPayment(@RequestBody PaymentRequest request) {
        Payment payment = Payment.builder()
            .orderId(request.getOrderId())
            .userId(request.getUserId())
            .amount(request.getAmount())
            .paymentMethod(request.getPaymentMethod())
            .build();
        payment.approve(); // Auto-approve for MVP
        return ResponseEntity.ok(paymentRepository.save(payment));
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Payment Service is running");
    }
}

@lombok.Data
class PaymentRequest {
    private Long orderId;
    private Long userId;
    private BigDecimal amount;
    private String paymentMethod;
}

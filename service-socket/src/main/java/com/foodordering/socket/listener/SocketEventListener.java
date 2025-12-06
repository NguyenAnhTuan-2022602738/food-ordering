package com.foodordering.socket.listener;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import java.util.Map;

@Component
@Slf4j
@RequiredArgsConstructor
public class SocketEventListener {

    private final SimpMessagingTemplate messagingTemplate;
    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    @RabbitListener(queues = "socket-notification-queue")
    public void handleEvent(Object event) {
        log.info("🔥 [SOCKET-SERVICE] Received event type: {}", event.getClass().getName());
        
        Map<String, Object> map = null;

        try {
            if (event instanceof Map) {
                map = (Map<String, Object>) event;
            } else if (event instanceof org.springframework.amqp.core.Message) {
                org.springframework.amqp.core.Message msg = (org.springframework.amqp.core.Message) event;
                map = objectMapper.readValue(msg.getBody(), new com.fasterxml.jackson.core.type.TypeReference<Map<String, Object>>() {});
            } else if (event instanceof byte[]) {
                map = objectMapper.readValue((byte[]) event, new com.fasterxml.jackson.core.type.TypeReference<Map<String, Object>>() {});
            } else {
                log.warn("Unknown event type, trying toString parsing or ignoring");
            }
        } catch (Exception e) {
            log.error("Error parsing event data", e);
            return;
        }

        if (map != null) {
            String type = (String) map.getOrDefault("type", "UNKNOWN");
            
            // Construct notification payload
            Map<String, Object> notification = new java.util.HashMap<>(map);
            String message = "";
            String subject = "";
            
            if (map.containsKey("orderId")) {
                Long orderId = ((Number) map.get("orderId")).longValue();
                
                if ("ORDER_STATUS_CHANGED".equals(type)) {
                    String status = (String) map.get("status");
                    subject = "Order #" + orderId + " Updated";
                    message = "Order status changed to " + status;
                } else {
                    subject = "New Order #" + orderId;
                    message = "New order received from user " + map.get("userId");
                }
            }
            
            notification.put("subject", subject);
            notification.put("message", message);
            notification.put("createdAt", new java.util.Date());

            log.info("   -> Broadcasting notification: {}", notification);

            // Bắn broadcast cho Admin
            messagingTemplate.convertAndSend("/topic/admin/notifications", notification);
            
            // Nếu event có userId, bắn riêng cho User đó
            if (map.containsKey("userId")) {
                String userId = String.valueOf(map.get("userId"));
                messagingTemplate.convertAndSend("/topic/user/" + userId, notification);
                log.info("   -> Pushed to user {}", userId);
            }
        }
    }
}

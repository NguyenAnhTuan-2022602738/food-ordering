package com.foodordering.auth.interfaces.controller;

import com.foodordering.auth.application.dto.UserDto;
import com.foodordering.auth.domain.model.User;
import com.foodordering.auth.domain.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "User Management", description = "API quản lý người dùng")
public class UserController {

    private final UserRepository userRepository;

    @GetMapping
    @Operation(summary = "Lấy danh sách tất cả user", description = "Trả về danh sách user (dành cho Admin)")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        log.info("[USER-CONTROLLER] Nhận request lấy danh sách user");
        List<User> users = userRepository.findAll();
        
        List<UserDto> userDtos = users.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
                
        return ResponseEntity.ok(userDtos);
    }

    private UserDto mapToDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole().name())
                .build();
    }
}

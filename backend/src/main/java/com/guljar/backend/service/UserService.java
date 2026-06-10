package com.guljar.backend.service;

import com.guljar.backend.dto.CreateStaffRequest;
import com.guljar.backend.dto.UserDto;

import java.util.List;

public interface UserService {
    List<UserDto> getAllUsers();
    UserDto getUserById(Long id);
    UserDto getUserByUsername(String username);
    UserDto createStaffUser(CreateStaffRequest request);
    UserDto updateUser(Long id, UserDto userDto);
    void deleteUser(Long id);
    UserDto toggleUserActiveStatus(Long id);
}

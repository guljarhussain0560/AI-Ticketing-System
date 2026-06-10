package com.guljar.backend.service;

import com.guljar.backend.dto.ChangePasswordRequest;
import com.guljar.backend.dto.JwtResponse;
import com.guljar.backend.dto.LoginRequest;

public interface AuthService {
    JwtResponse authenticateUser(LoginRequest loginRequest);
    void changePassword(String username, ChangePasswordRequest request);
}

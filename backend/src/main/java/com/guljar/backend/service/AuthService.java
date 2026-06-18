package com.guljar.backend.service;

import com.guljar.backend.dto.JwtResponse;
import com.guljar.backend.dto.LoginRequest;
import com.guljar.backend.dto.RegisterRequest;
import com.guljar.backend.dto.UserDto;

public interface AuthService {
    JwtResponse authenticateUser(LoginRequest loginRequest);
    UserDto registerUser(RegisterRequest registerRequest);
}

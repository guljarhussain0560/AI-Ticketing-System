package com.guljar.backend.service.impl;

import com.guljar.backend.dto.UserDto;
import com.guljar.backend.entity.Role;
import com.guljar.backend.entity.RoleType;
import com.guljar.backend.entity.User;
import com.guljar.backend.exception.BadRequestException;
import com.guljar.backend.exception.ResourceNotFoundException;
import com.guljar.backend.mapper.UserMapper;
import com.guljar.backend.repository.RoleRepository;
import com.guljar.backend.repository.UserRepository;
import com.guljar.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;

    @Override
    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return userMapper.toDto(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        return userMapper.toDto(user);
    }

    @Override
    @Transactional
    public UserDto updateUser(Long id, UserDto userDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        // Validate email uniqueness if changed
        if (!user.getEmail().equalsIgnoreCase(userDto.getEmail()) && userRepository.existsByEmail(userDto.getEmail())) {
            throw new BadRequestException("Email Address already in use!");
        }

        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setEmail(userDto.getEmail());

        if (userDto.getRoles() != null && !userDto.getRoles().isEmpty()) {
            Set<Role> roles = new HashSet<>();
            for (String roleName : userDto.getRoles()) {
                try {
                    RoleType roleType = RoleType.valueOf(roleName);
                    Role role = roleRepository.findByName(roleType)
                            .orElseThrow(() -> new ResourceNotFoundException("Role", "name", roleName));
                    roles.add(role);
                } catch (IllegalArgumentException e) {
                    throw new BadRequestException("Invalid role name: " + roleName);
                }
            }
            user.setRoles(roles);
        }

        User updatedUser = userRepository.save(user);
        return userMapper.toDto(updatedUser);
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        userRepository.delete(user);
    }

    @Override
    @Transactional
    public UserDto toggleUserActiveStatus(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        user.setActive(!user.isActive());
        User updatedUser = userRepository.save(user);
        return userMapper.toDto(updatedUser);
    }
}

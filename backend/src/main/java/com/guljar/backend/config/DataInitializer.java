package com.guljar.backend.config;

import com.guljar.backend.entity.Role;
import com.guljar.backend.entity.RoleType;
import com.guljar.backend.entity.User;
import com.guljar.backend.repository.RoleRepository;
import com.guljar.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Collections;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Initialize Roles
        for (RoleType roleType : RoleType.values()) {
            if (!roleRepository.findByName(roleType).isPresent()) {
                Role role = new Role();
                role.setName(roleType);
                roleRepository.save(role);
                System.out.println("Seeded role: " + roleType.name());
            }
        }

        // Initialize Admin User
        if (!userRepository.existsByUsername("admin")) {
            Role adminRole = roleRepository.findByName(RoleType.ROLE_ADMIN)
                    .orElseThrow(() -> new RuntimeException("ROLE_ADMIN not found"));

            User admin = User.builder()
                    .username("admin")
                    .email("admin@ticketgen.com")
                    .password(passwordEncoder.encode("admin123"))
                    .firstName("Admin")
                    .lastName("User")
                    .isActive(true)
                    .build();

            admin.setRoles(Collections.singleton(adminRole));
            userRepository.save(admin);
            System.out.println("Default admin user ('admin' / 'admin123') created successfully!");
        }
    }
}

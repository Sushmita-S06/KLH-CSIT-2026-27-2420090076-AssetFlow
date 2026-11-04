package com.assetflow.service;

import com.assetflow.dto.AuthResponse;
import com.assetflow.dto.LoginRequest;
import com.assetflow.dto.RegisterRequest;
import com.assetflow.entity.Role;
import com.assetflow.entity.User;
import com.assetflow.exception.BadRequestException;
import com.assetflow.repository.RoleRepository;
import com.assetflow.repository.UserRepository;
import com.assetflow.security.CustomUserDetailsService;
import com.assetflow.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authManager;
    private final CustomUserDetailsService userDetailsService;

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByUsername(req.getUsername()))
            throw new BadRequestException("Username already exists");
        if (userRepository.existsByEmail(req.getEmail()))
            throw new BadRequestException("Email already exists");

        String roleName = req.getRole() != null ? req.getRole() : "ROLE_USER";
        Role role = roleRepository.findByName(roleName)
                .orElseGet(() -> roleRepository.save(Role.builder().name(roleName).build()));

        Set<Role> roles = new HashSet<>();
        roles.add(role);

        User user = User.builder()
                .username(req.getUsername())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .fullName(req.getFullName())
                .department(req.getDepartment())
                .phone(req.getPhone())
                .enabled(true)
                .roles(roles)
                .build();

        userRepository.save(user);
        UserDetails ud = userDetailsService.loadUserByUsername(user.getUsername());
        String token = jwtService.generateToken(ud);

        return new AuthResponse(token, user.getId(), user.getUsername(),
                user.getFullName(), user.getEmail(),
                user.getRoles().stream().map(Role::getName).collect(Collectors.toList()));
    }

    public AuthResponse login(LoginRequest req) {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(
                req.getUsername(), req.getPassword()));

        User user = userRepository.findByUsername(req.getUsername())
                .orElseThrow(() -> new BadRequestException("User not found"));

        UserDetails ud = userDetailsService.loadUserByUsername(user.getUsername());
        String token = jwtService.generateToken(ud);

        return new AuthResponse(token, user.getId(), user.getUsername(),
                user.getFullName(), user.getEmail(),
                user.getRoles().stream().map(Role::getName).collect(Collectors.toList()));
    }

    public User getCurrentUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new BadRequestException("User not found"));
    }

    public List<User> getAllUsers() { return userRepository.findAll(); }
}
package com.assetflow.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank @Size(min = 3, max = 100)
    private String username;
    @NotBlank @Email
    private String email;
    @NotBlank @Size(min = 6)
    private String password;
    @NotBlank
    private String fullName;
    private String department;
    private String phone;
    private String role; // optional: ROLE_ADMIN, ROLE_MANAGER, ROLE_USER
}

package com.peerlearn.controller;

import com.peerlearn.model.Student;
import com.peerlearn.service.StudentService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private SecurityContextRepository securityContextRepository;

    @PostMapping("/register")
    public ResponseEntity<?> registerStudent(
            @Valid @RequestBody Student student) {

        try {
            Student registered = studentService.registerStudent(student);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Registration successful!");
            response.put("studentId", registered.getId());
            response.put("email", registered.getEmail());
            response.put("fullName", registered.getFullName());
            response.put("role", registered.getRole().name());

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());

            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Map<String, String> credentials,
            HttpServletRequest request,
            HttpServletResponse response) {

        try {
            String email = credentials.get("email");
            String password = credentials.get("password");

            if (email == null || password == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "success", false,
                                "message", "Email and password are required"
                        ));
            }

            Authentication authentication =
                    authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(
                                    email.trim().toLowerCase(),
                                    password
                            )
                    );

            SecurityContext context =
                    SecurityContextHolder.createEmptyContext();

            context.setAuthentication(authentication);
            SecurityContextHolder.setContext(context);

            securityContextRepository.saveContext(
                    context, request, response
            );

            Student student = studentService.authenticate(email, password);

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("studentId", student.getId());
            result.put("fullName", student.getFullName());
            result.put("email", student.getEmail());
            result.put("role", student.getRole().name());
            result.put("collegeName", student.getCollegeName());
            result.put("branch", student.getBranch());
            result.put("academicYear", student.getAcademicYear());

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            SecurityContextHolder.clearContext();

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "success", false,
                            "message", "Invalid email or password"
                    ));
        }
    }
}


package com.peerlearn.config;

import com.peerlearn.repository.StudentRepository;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;

import java.util.Collections;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    // Password encryption
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Load student details from MySQL
    @Bean
    public UserDetailsService userDetailsService(
            StudentRepository studentRepository) {

        return username -> studentRepository
                .findByEmailIgnoreCase(username)
                .map(student -> new User(
                        student.getEmail(),
                        student.getPassword(),
                        student.getActive(),
                        true,
                        true,
                        true,
                        Collections.singletonList(
                                new SimpleGrantedAuthority(
                                        student.getRole().name()
                                )
                        )
                ))
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "User not found with email: " + username
                        )
                );
    }

    // Authentication provider
    @Bean
    public DaoAuthenticationProvider authenticationProvider(
            UserDetailsService userDetailsService,
            PasswordEncoder passwordEncoder) {

        DaoAuthenticationProvider authProvider =
                new DaoAuthenticationProvider();

        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder);

        return authProvider;
    }

    // Authentication manager
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authConfig) throws Exception {

        return authConfig.getAuthenticationManager();
    }

    // Store authentication in HTTP session
    @Bean
    public SecurityContextRepository securityContextRepository() {
        return new HttpSessionSecurityContextRepository();
    }

    // Security configuration
    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
            .authorizeHttpRequests(auth -> auth

                // Public pages and authentication endpoints
                .requestMatchers(
                    "/",
                    "/home",
                    "/about",
                    "/how-it-works",
                    "/skills/**",
                    "/login",
                    "/register",
                    "/api/auth/**",
                    "/css/**",
                    "/js/**",
                    "/images/**",
                    "/favicon.ico"
                ).permitAll()

                // Public health check
                .requestMatchers(
                    "/actuator/health",
                    "/actuator/health/**"
                ).permitAll()

                // Admin-only access
                .requestMatchers(
                    "/admin/**",
                    "/api/admin/**"
                ).hasRole("ADMIN")

                // Student and Admin access
                .requestMatchers(
                    "/dashboard/**",
                    "/my-skills/**",
                    "/matches/**",
                    "/requests/**",
                    "/sessions/**",
                    "/profile/**",
                    "/api/students/**",
                    "/api/matches/**",
                    "/api/requests/**",
                    "/api/sessions/**"
                ).hasAnyRole("STUDENT", "ADMIN")

                // All other endpoints require authentication
                .anyRequest().authenticated()
            )

            .formLogin(form -> form
                .loginPage("/login")
                .defaultSuccessUrl("/dashboard", true)
                .failureUrl("/login?error=true")
                .permitAll()
            )

            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/login?logout=true")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                .permitAll()
            )

            // Disable CSRF only for API endpoints
            .csrf(csrf ->
                csrf.ignoringRequestMatchers("/api/**")
            );

        return http.build();
    }
}

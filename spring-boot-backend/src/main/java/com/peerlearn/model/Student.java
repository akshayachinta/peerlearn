
package com.peerlearn.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "students")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Full name is required")
    @Column(nullable = false, length = 120)
    private String fullName;

    @Email(message = "Valid email is required")
    @NotBlank(message = "Email is required")
    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @NotBlank(message = "Password is required")
    @Column(nullable = false)
    private String password; // BCrypt encrypted

    @NotBlank(message = "College name is required")
    @Column(nullable = false, length = 200)
    private String collegeName;

    @NotBlank(message = "Branch is required")
    @Column(nullable = false, length = 120)
    private String branch;

    @NotBlank(message = "Academic year is required")
    @Column(nullable = false, length = 50)
    private String academicYear;

    private String profilePhoto;

    @Column(length = 1000)
    private String bio;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String availability = "Available";

    @Column(nullable = false)
    @Builder.Default
    private Double rating = 5.0;

    @Builder.Default
    private Integer reviewCount = 0;

    @Builder.Default
    private Integer xpPoints = 100;

    @Builder.Default
    private Integer completedSessionsCount = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private Role role = Role.ROLE_STUDENT;

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(
        mappedBy = "student",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    @Builder.Default
    private List<StudentSkill> skills = new ArrayList<>();

    @OneToMany(
        mappedBy = "student",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    @Builder.Default
    private List<Achievement> achievements = new ArrayList<>();

    public enum Role {
        ROLE_STUDENT,
        ROLE_ADMIN
    }
}

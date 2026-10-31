package com.peerlearn.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "activities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String type; // "MATCH", "REQUEST", "ACCEPT", "SESSION_SCHEDULED", "SESSION_COMPLETED", "SKILL_ADDED"

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, length = 1000)
    private String description;

    private Long studentId;

    @Column(length = 120)
    private String studentName;

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}

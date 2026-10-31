package com.peerlearn.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id", nullable = false)
    private Student recipient;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, length = 1000)
    private String message;

    @Column(length = 50)
    @Builder.Default
    private String type = "GENERAL"; // "REQUEST", "SESSION", "GENERAL"

    @Column(name = "is_read", nullable = false)
    @Builder.Default
    private Boolean read = false;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}

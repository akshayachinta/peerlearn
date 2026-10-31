package com.peerlearn.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "learning_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearningSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mentor_id", nullable = false)
    private Student mentor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "learner_id", nullable = false)
    private Student learner;

    @Column(nullable = false, length = 100)
    private String skillName;

    @Column(nullable = false)
    private LocalDate sessionDate;

    @Column(nullable = false)
    private LocalTime sessionTime;

    @Builder.Default
    private Integer durationMinutes = 60;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String mode = "Online"; // "Online" or "Offline"

    @Column(length = 255)
    private String meetingLinkOrVenue;

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private SessionStatus status = SessionStatus.UPCOMING;

    private Integer mentorRating;

    @Column(length = 1000)
    private String notes;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime completedAt;

    public enum SessionStatus {
        UPCOMING,
        COMPLETED,
        CANCELLED
    }
}

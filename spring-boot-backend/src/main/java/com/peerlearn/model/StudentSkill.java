package com.peerlearn.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "student_skills", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"student_id", "skill_name", "type"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "skill_name", nullable = false, length = 100)
    private String skillName;

    @Column(nullable = false, length = 100)
    private String category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Proficiency proficiency; // Beginner, Intermediate, Advanced

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private SkillType type; // TEACH or LEARN

    @Column(length = 500)
    private String experienceOrGoal;

    public enum Proficiency {
        Beginner, Intermediate, Advanced
    }

    public enum SkillType {
        TEACH, LEARN
    }
}

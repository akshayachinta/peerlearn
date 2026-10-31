package com.peerlearn.service;

import com.peerlearn.dto.AdminStatsDto;
import com.peerlearn.model.*;
import com.peerlearn.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class AdminService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private SkillCategoryRepository skillCategoryRepository;

    @Autowired
    private ExchangeRequestRepository exchangeRequestRepository;

    @Autowired
    private LearningSessionRepository learningSessionRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Transactional(readOnly = true)
    public AdminStatsDto getDashboardStats() {
        long totalStudents = studentRepository.count();
        long activeStudents = studentRepository.countByActiveTrue();
        long totalSkills = skillRepository.count();
        long totalRequests = exchangeRequestRepository.count();
        long completedSessions = learningSessionRepository.countByStatus(LearningSession.SessionStatus.COMPLETED);
        long upcomingSessions = learningSessionRepository.countByStatus(LearningSession.SessionStatus.UPCOMING);

        // Approximate mutual matches based on active student count
        long estimatedMatches = Math.max(1, activeStudents / 2);

        return AdminStatsDto.builder()
                .totalStudents(totalStudents)
                .activeStudents(activeStudents)
                .totalSkills(totalSkills)
                .totalRequests(totalRequests)
                .completedSessions(completedSessions)
                .upcomingSessions(upcomingSessions)
                .totalMutualMatches(estimatedMatches)
                .build();
    }

    public Student toggleStudentStatus(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found."));
        student.setActive(!student.getActive());
        return studentRepository.save(student);
    }

    public void deleteStudent(Long studentId) {
        studentRepository.deleteById(studentId);
    }

    public Skill addSkill(String name, Long categoryId, Boolean popular) {
        SkillCategory category = null;
        if (categoryId != null) {
            category = skillCategoryRepository.findById(categoryId).orElse(null);
        }

        Skill skill = Skill.builder()
                .name(name)
                .category(category)
                .popular(popular != null ? popular : false)
                .build();

        return skillRepository.save(skill);
    }

    public void deleteSkill(Long skillId) {
        skillRepository.deleteById(skillId);
    }

    @Transactional(readOnly = true)
    public List<Review> getReportedReviews() {
        return reviewRepository.findByReportedTrue();
    }

    public void deleteReview(Long reviewId) {
        reviewRepository.deleteById(reviewId);
    }
}

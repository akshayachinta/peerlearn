package com.peerlearn.service;

import com.peerlearn.model.Activity;
import com.peerlearn.model.LearningSession;
import com.peerlearn.model.Student;
import com.peerlearn.repository.ActivityRepository;
import com.peerlearn.repository.ExchangeRequestRepository;
import com.peerlearn.repository.LearningSessionRepository;
import com.peerlearn.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@Transactional
public class LearningSessionService {

    @Autowired
    private LearningSessionRepository learningSessionRepository;

    @Autowired
    private ExchangeRequestRepository exchangeRequestRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ActivityRepository activityRepository;

    public LearningSession scheduleSession(Long mentorId, Long learnerId, String skillName, LocalDate date, LocalTime time, Integer durationMinutes, String mode, String venueOrLink, String description) {
        // Enforce rule: Only accepted peer connections can schedule sessions
        if (!exchangeRequestRepository.hasAcceptedConnectionBetween(mentorId, learnerId)) {
            throw new IllegalStateException("You can only schedule learning sessions with peers who have an accepted exchange connection.");
        }

        Student mentor = studentRepository.findById(mentorId)
                .orElseThrow(() -> new IllegalArgumentException("Mentor student not found."));

        Student learner = studentRepository.findById(learnerId)
                .orElseThrow(() -> new IllegalArgumentException("Learner student not found."));

        LearningSession session = LearningSession.builder()
                .mentor(mentor)
                .learner(learner)
                .skillName(skillName)
                .sessionDate(date)
                .sessionTime(time)
                .durationMinutes(durationMinutes != null ? durationMinutes : 60)
                .mode(mode != null ? mode : "Online")
                .meetingLinkOrVenue(venueOrLink)
                .description(description)
                .status(LearningSession.SessionStatus.UPCOMING)
                .build();

        LearningSession saved = learningSessionRepository.save(session);

        activityRepository.save(Activity.builder()
                .type("SESSION_SCHEDULED")
                .title("Learning Session Scheduled")
                .description(mentor.getFullName() + " scheduled a session to teach '" + skillName + "' to " + learner.getFullName() + " on " + date + ".")
                .studentId(mentor.getId())
                .studentName(mentor.getFullName())
                .build());

        return saved;
    }

    public LearningSession completeSession(Long sessionId, Integer rating, String feedbackNotes) {
        LearningSession session = learningSessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found."));

        if (session.getStatus() != LearningSession.SessionStatus.UPCOMING) {
            throw new IllegalStateException("Only upcoming sessions can be marked as completed.");
        }

        session.setStatus(LearningSession.SessionStatus.COMPLETED);
        session.setCompletedAt(LocalDateTime.now());
        session.setMentorRating(rating != null ? rating : 5);
        session.setNotes(feedbackNotes);

        // Award points only for completed learning sessions!
        Student mentor = session.getMentor();
        mentor.setXpPoints(mentor.getXpPoints() + 100);
        mentor.setCompletedSessionsCount(mentor.getCompletedSessionsCount() + 1);
        if (rating != null) {
            double newRating = (mentor.getRating() * mentor.getReviewCount() + rating) / (mentor.getReviewCount() + 1);
            mentor.setRating(Math.round(newRating * 10.0) / 10.0);
            mentor.setReviewCount(mentor.getReviewCount() + 1);
        }
        studentRepository.save(mentor);

        Student learner = session.getLearner();
        learner.setXpPoints(learner.getXpPoints() + 50);
        learner.setCompletedSessionsCount(learner.getCompletedSessionsCount() + 1);
        studentRepository.save(learner);

        LearningSession saved = learningSessionRepository.save(session);

        activityRepository.save(Activity.builder()
                .type("SESSION_COMPLETED")
                .title("Session Completed")
                .description(mentor.getFullName() + " and " + learner.getFullName() + " completed session on '" + session.getSkillName() + "'. +100 XP awarded!")
                .studentId(mentor.getId())
                .studentName(mentor.getFullName())
                .build());

        return saved;
    }

    public LearningSession cancelSession(Long sessionId) {
        LearningSession session = learningSessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found."));

        session.setStatus(LearningSession.SessionStatus.CANCELLED);
        return learningSessionRepository.save(session);
    }

    @Transactional(readOnly = true)
    public List<LearningSession> getUpcomingSessionsForStudent(Long studentId) {
        return learningSessionRepository.findForStudentByStatus(studentId, LearningSession.SessionStatus.UPCOMING);
    }

    @Transactional(readOnly = true)
    public List<LearningSession> getCompletedSessionsForStudent(Long studentId) {
        return learningSessionRepository.findForStudentByStatus(studentId, LearningSession.SessionStatus.COMPLETED);
    }
}

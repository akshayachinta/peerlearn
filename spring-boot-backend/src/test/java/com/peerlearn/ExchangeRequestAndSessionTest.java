package com.peerlearn;

import com.peerlearn.model.ExchangeRequest;
import com.peerlearn.model.LearningSession;
import com.peerlearn.model.Student;
import com.peerlearn.service.ExchangeRequestService;
import com.peerlearn.service.LearningSessionService;
import com.peerlearn.service.StudentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class ExchangeRequestAndSessionTest {

    @Autowired
    private StudentService studentService;

    @Autowired
    private ExchangeRequestService exchangeRequestService;

    @Autowired
    private LearningSessionService learningSessionService;

    private Student sender;
    private Student receiver;

    @BeforeEach
    void setUp() {
        sender = studentService.registerStudent(Student.builder()
                .fullName("Sender Student")
                .email("sender@example.edu")
                .password("pass123")
                .collegeName("Sender College")
                .branch("CSE")
                .academicYear("3rd Year")
                .build());

        receiver = studentService.registerStudent(Student.builder()
                .fullName("Receiver Student")
                .email("receiver@example.edu")
                .password("pass123")
                .collegeName("Receiver College")
                .branch("IT")
                .academicYear("3rd Year")
                .build());
    }

    @Test
    @DisplayName("Scenario 9: Send exchange request & prevent duplicates")
    void testSendRequestAndDuplicatePrevention() {
        ExchangeRequest request = exchangeRequestService.sendRequest(
                sender.getId(), receiver.getId(), "Python", "Java", "Let's exchange!", "Online");

        assertNotNull(request.getId());
        assertEquals(ExchangeRequest.RequestStatus.PENDING, request.getStatus());

        // Duplicate request attempt must throw IllegalStateException
        assertThrows(IllegalStateException.class, () ->
                exchangeRequestService.sendRequest(sender.getId(), receiver.getId(), "Python", "Java", "Duplicate", "Online"));
    }

    @Test
    @DisplayName("Scenario 10: Accept and reject exchange request")
    void testAcceptAndRejectRequests() {
        ExchangeRequest req1 = exchangeRequestService.sendRequest(
                sender.getId(), receiver.getId(), "Python", "Java", "Proposal 1", "Online");

        // Only receiver can accept
        assertThrows(SecurityException.class, () ->
                exchangeRequestService.acceptRequest(req1.getId(), sender.getId()));

        ExchangeRequest accepted = exchangeRequestService.acceptRequest(req1.getId(), receiver.getId());
        assertEquals(ExchangeRequest.RequestStatus.ACCEPTED, accepted.getStatus());
    }

    @Test
    @DisplayName("Scenario 11: Schedule session only after accepted connection, then complete session & award XP")
    void testSessionSchedulingAndCompletion() {
        // Unconnected attempt must fail
        assertThrows(IllegalStateException.class, () ->
                learningSessionService.scheduleSession(
                        sender.getId(), receiver.getId(), "Python",
                        LocalDate.now().plusDays(2), LocalTime.of(17, 0),
                        60, "Online", "https://meet.google.com/test", "Intro to Python"));

        // Accept connection first
        ExchangeRequest req = exchangeRequestService.sendRequest(
                sender.getId(), receiver.getId(), "Python", "Java", "Proposal", "Online");
        exchangeRequestService.acceptRequest(req.getId(), receiver.getId());

        // Schedule session now succeeds
        LearningSession session = learningSessionService.scheduleSession(
                sender.getId(), receiver.getId(), "Python",
                LocalDate.now().plusDays(2), LocalTime.of(17, 0),
                60, "Online", "https://meet.google.com/test", "Intro to Python");

        assertNotNull(session.getId());
        assertEquals(LearningSession.SessionStatus.UPCOMING, session.getStatus());

        int initialMentorXp = sender.getXpPoints();

        // Mark completed
        LearningSession completed = learningSessionService.completeSession(session.getId(), 5, "Great session!");
        assertEquals(LearningSession.SessionStatus.COMPLETED, completed.getStatus());

        // Verify mentor XP increased by +100
        Student updatedMentor = studentService.getStudentById(sender.getId()).orElseThrow();
        assertEquals(initialMentorXp + 100, updatedMentor.getXpPoints(), "Mentor must receive exactly +100 XP");
        assertEquals(1, updatedMentor.getCompletedSessionsCount());
    }
}

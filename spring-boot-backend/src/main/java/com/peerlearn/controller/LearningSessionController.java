package com.peerlearn.controller;

import com.peerlearn.model.LearningSession;
import com.peerlearn.service.LearningSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sessions")
public class LearningSessionController {

    @Autowired
    private LearningSessionService learningSessionService;

    @PostMapping
    public ResponseEntity<?> scheduleSession(@RequestBody Map<String, Object> payload) {
        try {
            Long mentorId = Long.valueOf(payload.get("mentorId").toString());
            Long learnerId = Long.valueOf(payload.get("learnerId").toString());
            String skillName = (String) payload.get("skillName");
            LocalDate date = LocalDate.parse((String) payload.get("date"));
            LocalTime time = LocalTime.parse((String) payload.get("time"));
            Integer duration = payload.get("durationMinutes") != null ? Integer.valueOf(payload.get("durationMinutes").toString()) : 60;
            String mode = (String) payload.get("mode");
            String venue = (String) payload.get("meetingLinkOrVenue");
            String description = (String) payload.get("description");

            LearningSession scheduled = learningSessionService.scheduleSession(
                    mentorId, learnerId, skillName, date, time, duration, mode, venue, description);
            return ResponseEntity.ok(scheduled);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<?> completeSession(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        try {
            Integer rating = payload.get("rating") != null ? Integer.valueOf(payload.get("rating").toString()) : 5;
            String feedback = (String) payload.get("feedback");
            LearningSession completed = learningSessionService.completeSession(id, rating, feedback);
            return ResponseEntity.ok(completed);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelSession(@PathVariable Long id) {
        try {
            LearningSession cancelled = learningSessionService.cancelSession(id);
            return ResponseEntity.ok(cancelled);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/upcoming/{studentId}")
    public ResponseEntity<List<LearningSession>> getUpcoming(@PathVariable Long studentId) {
        return ResponseEntity.ok(learningSessionService.getUpcomingSessionsForStudent(studentId));
    }

    @GetMapping("/completed/{studentId}")
    public ResponseEntity<List<LearningSession>> getCompleted(@PathVariable Long studentId) {
        return ResponseEntity.ok(learningSessionService.getCompletedSessionsForStudent(studentId));
    }
}

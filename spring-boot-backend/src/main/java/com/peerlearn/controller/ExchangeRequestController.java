package com.peerlearn.controller;

import com.peerlearn.model.ExchangeRequest;
import com.peerlearn.service.ExchangeRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/requests")
public class ExchangeRequestController {

    @Autowired
    private ExchangeRequestService exchangeRequestService;

    @PostMapping
    public ResponseEntity<?> sendRequest(@RequestBody Map<String, Object> payload) {
        try {
            Long senderId = Long.valueOf(payload.get("senderId").toString());
            Long receiverId = Long.valueOf(payload.get("receiverId").toString());
            String teachingSkill = (String) payload.get("teachingSkill");
            String learningSkill = (String) payload.get("learningSkill");
            String message = (String) payload.get("message");
            String preferredMode = (String) payload.get("preferredMode");

            ExchangeRequest created = exchangeRequestService.sendRequest(
                    senderId, receiverId, teachingSkill, learningSkill, message, preferredMode);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<?> acceptRequest(@PathVariable Long id, @RequestParam Long currentUserId) {
        try {
            ExchangeRequest accepted = exchangeRequestService.acceptRequest(id, currentUserId);
            return ResponseEntity.ok(accepted);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectRequest(@PathVariable Long id, @RequestParam Long currentUserId) {
        try {
            ExchangeRequest rejected = exchangeRequestService.rejectRequest(id, currentUserId);
            return ResponseEntity.ok(rejected);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelRequest(@PathVariable Long id, @RequestParam Long currentUserId) {
        try {
            ExchangeRequest cancelled = exchangeRequestService.cancelRequest(id, currentUserId);
            return ResponseEntity.ok(cancelled);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/incoming/{studentId}")
    public ResponseEntity<List<ExchangeRequest>> getIncoming(@PathVariable Long studentId) {
        return ResponseEntity.ok(exchangeRequestService.getIncomingPendingRequests(studentId));
    }

    @GetMapping("/sent/{studentId}")
    public ResponseEntity<List<ExchangeRequest>> getSent(@PathVariable Long studentId) {
        return ResponseEntity.ok(exchangeRequestService.getSentPendingRequests(studentId));
    }

    @GetMapping("/accepted/{studentId}")
    public ResponseEntity<List<ExchangeRequest>> getAccepted(@PathVariable Long studentId) {
        return ResponseEntity.ok(exchangeRequestService.getAcceptedConnections(studentId));
    }
}

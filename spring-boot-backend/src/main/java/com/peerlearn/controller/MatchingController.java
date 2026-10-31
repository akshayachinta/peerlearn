package com.peerlearn.controller;

import com.peerlearn.dto.MatchResultDto;
import com.peerlearn.service.MatchingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
public class MatchingController {

    @Autowired
    private MatchingService matchingService;

    @GetMapping("/{studentId}")
    public ResponseEntity<List<MatchResultDto>> getMatches(@PathVariable Long studentId) {
        try {
            List<MatchResultDto> matches = matchingService.findMatchesForStudent(studentId);
            return ResponseEntity.ok(matches);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}

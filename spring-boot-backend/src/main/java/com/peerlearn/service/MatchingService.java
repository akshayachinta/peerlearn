package com.peerlearn.service;

import com.peerlearn.dto.MatchResultDto;
import com.peerlearn.model.Student;
import com.peerlearn.model.StudentSkill;
import com.peerlearn.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class MatchingService {

    @Autowired
    private StudentRepository studentRepository;

    /**
     * Calculates mutual skill match based on actual database records.
     * What Student A teaches ∩ What Student B learns
     * AND
     * What Student B teaches ∩ What Student A learns
     */
    public List<MatchResultDto> findMatchesForStudent(Long currentStudentId) {
        Student current = studentRepository.findById(currentStudentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));

        Set<String> currentTeaches = current.getSkills().stream()
                .filter(s -> s.getType() == StudentSkill.SkillType.TEACH)
                .map(s -> s.getSkillName().trim().toLowerCase())
                .collect(Collectors.toSet());

        Set<String> currentLearns = current.getSkills().stream()
                .filter(s -> s.getType() == StudentSkill.SkillType.LEARN)
                .map(s -> s.getSkillName().trim().toLowerCase())
                .collect(Collectors.toSet());

        List<Student> otherStudents = studentRepository.findByActiveTrueAndIdNot(currentStudentId);
        List<MatchResultDto> results = new ArrayList<>();

        for (Student other : otherStudents) {
            Set<String> otherTeaches = other.getSkills().stream()
                    .filter(s -> s.getType() == StudentSkill.SkillType.TEACH)
                    .map(s -> s.getSkillName().trim().toLowerCase())
                    .collect(Collectors.toSet());

            Set<String> otherLearns = other.getSkills().stream()
                    .filter(s -> s.getType() == StudentSkill.SkillType.LEARN)
                    .map(s -> s.getSkillName().trim().toLowerCase())
                    .collect(Collectors.toSet());

            // What current student can teach that the other student wants to learn
            List<String> whatYouTeachThem = currentTeaches.stream()
                    .filter(otherLearns::contains)
                    .collect(Collectors.toList());

            // What the other student can teach that current student wants to learn
            List<String> whatTheyTeachYou = otherTeaches.stream()
                    .filter(currentLearns::contains)
                    .collect(Collectors.toList());

            if (!whatYouTeachThem.isEmpty() && !whatTheyTeachYou.isEmpty()) {
                // Exact Mutual Match!
                int matchPercentage = Math.min(100, 85 + (whatYouTeachThem.size() + whatTheyTeachYou.size() - 2) * 5 + 10);
                results.add(MatchResultDto.builder()
                        .student(other)
                        .matchType("MUTUAL")
                        .matchPercentage(matchPercentage)
                        .whatYouTeachThem(whatYouTeachThem)
                        .whatTheyTeachYou(whatTheyTeachYou)
                        .build());
            } else if (!whatTheyTeachYou.isEmpty()) {
                results.add(MatchResultDto.builder()
                        .student(other)
                        .matchType("ONE_WAY_LEARN")
                        .matchPercentage(65)
                        .whatYouTeachThem(Collections.emptyList())
                        .whatTheyTeachYou(whatTheyTeachYou)
                        .build());
            } else if (!whatYouTeachThem.isEmpty()) {
                results.add(MatchResultDto.builder()
                        .student(other)
                        .matchType("ONE_WAY_TEACH")
                        .matchPercentage(60)
                        .whatYouTeachThem(whatYouTeachThem)
                        .whatTheyTeachYou(Collections.emptyList())
                        .build());
            }
        }

        results.sort((a, b) -> Integer.compare(b.getMatchPercentage(), a.getMatchPercentage()));
        return results;
    }
}

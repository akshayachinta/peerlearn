package com.peerlearn;

import com.peerlearn.dto.MatchResultDto;
import com.peerlearn.model.Student;
import com.peerlearn.model.StudentSkill;
import com.peerlearn.service.MatchingService;
import com.peerlearn.service.StudentService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class MatchingServiceTest {

    @Autowired
    private StudentService studentService;

    @Autowired
    private MatchingService matchingService;

    @Test
    @DisplayName("Scenario 8: Mutual skill matching algorithm identifies reciprocal teaching/learning overlap")
    void testMutualSkillMatching() {
        // Create Student A (Srija)
        Student studentA = studentService.registerStudent(Student.builder()
                .fullName("Srija Chinta")
                .email("srija.match@example.edu")
                .password("pass123")
                .collegeName("Vasavi College")
                .branch("CSE")
                .academicYear("3rd Year")
                .build());

        studentService.addSkill(studentA.getId(), StudentSkill.builder()
                .skillName("Python")
                .category("Programming")
                .proficiency(StudentSkill.Proficiency.Advanced)
                .type(StudentSkill.SkillType.TEACH)
                .build());

        studentService.addSkill(studentA.getId(), StudentSkill.builder()
                .skillName("Java")
                .category("Programming")
                .proficiency(StudentSkill.Proficiency.Intermediate)
                .type(StudentSkill.SkillType.LEARN)
                .build());

        // Create Student B (Rahul)
        Student studentB = studentService.registerStudent(Student.builder()
                .fullName("Rahul Verma")
                .email("rahul.match@example.edu")
                .password("pass123")
                .collegeName("CBIT")
                .branch("IT")
                .academicYear("3rd Year")
                .build());

        studentService.addSkill(studentB.getId(), StudentSkill.builder()
                .skillName("Java")
                .category("Programming")
                .proficiency(StudentSkill.Proficiency.Advanced)
                .type(StudentSkill.SkillType.TEACH)
                .build());

        studentService.addSkill(studentB.getId(), StudentSkill.builder()
                .skillName("Python")
                .category("Programming")
                .proficiency(StudentSkill.Proficiency.Intermediate)
                .type(StudentSkill.SkillType.LEARN)
                .build());

        // Execute Matching Service for Student A
        List<MatchResultDto> matches = matchingService.findMatchesForStudent(studentA.getId());

        assertFalse(matches.isEmpty(), "Matches must not be empty");
        MatchResultDto topMatch = matches.stream()
                .filter(m -> m.getStudent().getId().equals(studentB.getId()))
                .findFirst()
                .orElse(null);

        assertNotNull(topMatch, "Student B must be in Student A's match results");
        assertEquals("MUTUAL", topMatch.getMatchType(), "Must be identified as MUTUAL match");
        assertTrue(topMatch.getMatchPercentage() >= 85, "Mutual match percentage must be >= 85%");
        assertTrue(topMatch.getWhatYouTeachThem().contains("python"));
        assertTrue(topMatch.getWhatTheyTeachYou().contains("java"));
    }
}

package com.peerlearn;

import com.peerlearn.model.Student;
import com.peerlearn.model.StudentSkill;
import com.peerlearn.repository.StudentRepository;
import com.peerlearn.repository.StudentSkillRepository;
import com.peerlearn.service.StudentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class StudentServiceTest {

    @Autowired
    private StudentService studentService;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private StudentSkillRepository studentSkillRepository;

    private Student testStudent;

    @BeforeEach
    void setUp() {
        testStudent = Student.builder()
                .fullName("Test Student")
                .email("test.student@example.edu")
                .password("rawPassword123")
                .collegeName("Test University")
                .branch("Computer Science")
                .academicYear("3rd Year")
                .build();
    }

    @Test
    @DisplayName("Scenario 1: Student registration with BCrypt hashing")
    void testStudentRegistration() {
        Student registered = studentService.registerStudent(testStudent);

        assertNotNull(registered.getId());
        assertEquals("test.student@example.edu", registered.getEmail());
        assertNotEquals("rawPassword123", registered.getPassword(), "Password must be BCrypt hashed");
        assertTrue(registered.getPassword().startsWith("$2a$") || registered.getPassword().startsWith("$2b$"));
        assertEquals(Student.Role.ROLE_STUDENT, registered.getRole());
        assertEquals(100, registered.getXpPoints());
    }

    @Test
    @DisplayName("Scenario 2: Duplicate registration throws exception")
    void testDuplicateRegistrationThrowsException() {
        studentService.registerStudent(testStudent);

        Student duplicate = Student.builder()
                .fullName("Another Name")
                .email("TEST.student@example.edu") // Case insensitive check
                .password("pass456")
                .collegeName("Other College")
                .branch("IT")
                .academicYear("2nd Year")
                .build();

        assertThrows(IllegalArgumentException.class, () -> studentService.registerStudent(duplicate));
    }

    @Test
    @DisplayName("Scenario 3 & 4: Student login with valid and invalid credentials")
    void testStudentAuthentication() {
        studentService.registerStudent(testStudent);

        // Valid login
        Student authenticated = studentService.authenticate("test.student@example.edu", "rawPassword123");
        assertNotNull(authenticated);
        assertEquals("Test Student", authenticated.getFullName());

        // Invalid password
        assertThrows(IllegalArgumentException.class, () ->
                studentService.authenticate("test.student@example.edu", "wrongPassword"));

        // Non-existent email
        assertThrows(IllegalArgumentException.class, () ->
                studentService.authenticate("nonexistent@example.edu", "rawPassword123"));
    }

    @Test
    @DisplayName("Scenario 5: Student profile editing")
    void testProfileEditing() {
        Student registered = studentService.registerStudent(testStudent);

        Student updates = Student.builder()
                .collegeName("New College of Tech")
                .branch("Artificial Intelligence")
                .academicYear("4th Year")
                .bio("Updated ambitious bio")
                .availability("Weekends Only")
                .build();

        Student updated = studentService.updateProfile(registered.getId(), updates);

        assertEquals("New College of Tech", updated.getCollegeName());
        assertEquals("Artificial Intelligence", updated.getBranch());
        assertEquals("4th Year", updated.getAcademicYear());
        assertEquals("Weekends Only", updated.getAvailability());
    }

    @Test
    @DisplayName("Scenario 6 & 7: Add teaching and learning skills")
    void testAddSkills() {
        Student registered = studentService.registerStudent(testStudent);

        // Add Teaching Skill
        StudentSkill teachSkill = StudentSkill.builder()
                .skillName("Python")
                .category("Programming")
                .proficiency(StudentSkill.Proficiency.Advanced)
                .type(StudentSkill.SkillType.TEACH)
                .experienceOrGoal("Built 4 projects")
                .build();
        StudentSkill savedTeach = studentService.addSkill(registered.getId(), teachSkill);
        assertNotNull(savedTeach.getId());

        // Add Learning Skill
        StudentSkill learnSkill = StudentSkill.builder()
                .skillName("Java")
                .category("Programming")
                .proficiency(StudentSkill.Proficiency.Intermediate)
                .type(StudentSkill.SkillType.LEARN)
                .experienceOrGoal("Need for Spring Boot backend")
                .build();
        StudentSkill savedLearn = studentService.addSkill(registered.getId(), learnSkill);
        assertNotNull(savedLearn.getId());

        // Duplicate skill in same list throws exception
        assertThrows(IllegalArgumentException.class, () -> studentService.addSkill(registered.getId(), teachSkill));
    }
}

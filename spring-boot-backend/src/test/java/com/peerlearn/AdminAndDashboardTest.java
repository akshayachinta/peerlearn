package com.peerlearn;

import com.peerlearn.dto.AdminStatsDto;
import com.peerlearn.model.Student;
import com.peerlearn.repository.StudentRepository;
import com.peerlearn.service.AdminService;
import com.peerlearn.service.StudentService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class AdminAndDashboardTest {

    @Autowired
    private StudentService studentService;

    @Autowired
    private AdminService adminService;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    @DisplayName("Scenario 12: Admin authentication verification")
    void testAdminAuthentication() {
        Student admin = Student.builder()
                .fullName("System Admin")
                .email("admin.test@peerlearn.edu")
                .password(passwordEncoder.encode("Admin@123"))
                .collegeName("Administration")
                .branch("Management")
                .academicYear("Faculty")
                .role(Student.Role.ROLE_ADMIN)
                .active(true)
                .build();
        studentRepository.save(admin);

        Student authenticated = studentService.authenticate("admin.test@peerlearn.edu", "Admin@123");
        assertNotNull(authenticated);
        assertEquals(Student.Role.ROLE_ADMIN, authenticated.getRole());
    }

    @Test
    @DisplayName("Scenario 13: Unauthorized admin access check")
    void testUnauthorizedAdminAccess() {
        Student student = studentService.registerStudent(Student.builder()
                .fullName("Normal Student")
                .email("normal.student@peerlearn.edu")
                .password("student123")
                .collegeName("Engineering College")
                .branch("Civil")
                .academicYear("1st Year")
                .build());

        assertEquals(Student.Role.ROLE_STUDENT, student.getRole(), "Regular registration must be ROLE_STUDENT only");
        assertNotEquals(Student.Role.ROLE_ADMIN, student.getRole());
    }

    @Test
    @DisplayName("Scenario 14 & 15: Student and Admin dashboard statistics from database")
    void testDashboardStatistics() {
        AdminStatsDto stats = adminService.getDashboardStats();
        assertNotNull(stats);
        assertTrue(stats.getTotalStudents() >= 0);
        assertTrue(stats.getTotalSkills() >= 0);
        assertTrue(stats.getActiveStudents() >= 0);
    }
}

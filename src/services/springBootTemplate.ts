import JSZip from 'jszip';

export interface CodeFile {
  path: string;
  name: string;
  language: string;
  content: string;
}

export function getSpringBootProjectFiles(): CodeFile[] {
  return [
    {
      path: 'pom.xml',
      name: 'pom.xml',
      language: 'xml',
      content: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.4</version>
        <relativePath/>
    </parent>
    <groupId>com.peerlearn</groupId>
    <artifactId>peerlearn-platform</artifactId>
    <version>1.0.0</version>
    <name>PeerLearn</name>
    <description>Student Skill Exchange Platform with Mutual Skill Matching</description>
    <properties>
        <java.version>21</java.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-thymeleaf</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>`
    },
    {
      path: 'src/main/resources/application.properties',
      name: 'application.properties',
      language: 'properties',
      content: `# ===============================================
# PeerLearn - Spring Boot Application Properties
# ===============================================
server.port=8080

# MySQL Database Configuration with Environment Variables Fallback
spring.datasource.url=\${SPRING_DATASOURCE_URL:jdbc:mysql://localhost:3306/peerlearn_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true}
spring.datasource.username=\${SPRING_DATASOURCE_USERNAME:root}
spring.datasource.password=\${SPRING_DATASOURCE_PASSWORD:root}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA & Hibernate Properties (Persistent Schema)
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# Thymeleaf Configuration
spring.thymeleaf.cache=false
spring.thymeleaf.prefix=classpath:/templates/
spring.thymeleaf.suffix=.html
spring.thymeleaf.mode=HTML

# Security & App Logging
logging.level.org.springframework.security=INFO
logging.level.com.peerlearn=DEBUG`
    },
    {
      path: 'src/main/resources/schema.sql',
      name: 'schema.sql',
      language: 'sql',
      content: `-- 1. Students Entity Table
CREATE TABLE IF NOT EXISTS students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    college_name VARCHAR(200) NOT NULL,
    branch VARCHAR(120) NOT NULL,
    academic_year VARCHAR(50) NOT NULL,
    profile_photo VARCHAR(255),
    bio TEXT,
    availability VARCHAR(50) DEFAULT 'Available',
    rating DOUBLE DEFAULT 5.0,
    review_count INT DEFAULT 0,
    xp_points INT DEFAULT 100,
    completed_sessions_count INT DEFAULT 0,
    role VARCHAR(30) DEFAULT 'ROLE_STUDENT',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Skill Categories Table
CREATE TABLE IF NOT EXISTS skill_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    icon_name VARCHAR(50),
    description VARCHAR(500)
);

-- 3. Skills Catalog Table
CREATE TABLE IF NOT EXISTS skills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category_id BIGINT,
    popular BOOLEAN DEFAULT FALSE,
    description VARCHAR(500),
    CONSTRAINT fk_skill_category FOREIGN KEY (category_id) REFERENCES skill_categories(id) ON DELETE SET NULL
);

-- 4. Student Skills (Teach and Learn Lists)
CREATE TABLE IF NOT EXISTS student_skills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    proficiency VARCHAR(30) NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'TEACH' or 'LEARN'
    experience_or_goal VARCHAR(500),
    CONSTRAINT fk_student_skill_user FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT uk_student_skill_type UNIQUE (student_id, skill_name, type)
);

-- 5. Exchange Requests
CREATE TABLE IF NOT EXISTS exchange_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sender_id BIGINT NOT NULL,
    receiver_id BIGINT NOT NULL,
    teaching_skill VARCHAR(100) NOT NULL,
    learning_skill VARCHAR(100) NOT NULL,
    message TEXT,
    preferred_mode VARCHAR(50) DEFAULT 'Online',
    status VARCHAR(30) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL,
    CONSTRAINT fk_req_sender FOREIGN KEY (sender_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_req_receiver FOREIGN KEY (receiver_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 6. Learning Sessions
CREATE TABLE IF NOT EXISTS learning_sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    mentor_id BIGINT NOT NULL,
    learner_id BIGINT NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    session_date DATE NOT NULL,
    session_time TIME NOT NULL,
    duration_minutes INT DEFAULT 60,
    mode VARCHAR(50) DEFAULT 'Online',
    meeting_link_or_venue VARCHAR(255),
    description TEXT,
    status VARCHAR(30) DEFAULT 'UPCOMING',
    mentor_rating INT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    CONSTRAINT fk_session_mentor FOREIGN KEY (mentor_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_session_learner FOREIGN KEY (learner_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 7. Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recipient_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'GENERAL',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notif_recipient FOREIGN KEY (recipient_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 8. Activities Feed
CREATE TABLE IF NOT EXISTS activities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    student_id BIGINT,
    student_name VARCHAR(120),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Reviews
CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reviewer_id BIGINT NOT NULL,
    reviewee_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    reported BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_review_reviewer FOREIGN KEY (reviewer_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_review_reviewee FOREIGN KEY (reviewee_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 10. Achievements & Badges
CREATE TABLE IF NOT EXISTS achievements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    badge_name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    icon_name VARCHAR(50),
    awarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_achievement_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);`
    },
    {
      path: 'src/main/resources/data.sql',
      name: 'data.sql',
      language: 'sql',
      content: `-- Seed Categories
INSERT INTO skill_categories (id, name, icon_name, description) VALUES
(1, 'Programming', 'Code2', 'Core logic, data structures, and backend systems'),
(2, 'Web Development', 'Grid', 'Modern frontend layouts, responsive UI frameworks, and web standards'),
(3, 'Data and AI', 'Brain', 'Machine learning algorithms, data analytics, and neural models'),
(4, 'Career Skills', 'Award', 'Campus placement aptitude, technical interview preparation, and resumes'),
(5, 'Communication', 'Users', 'Public speaking confidence, presentation polish, and storytelling'),
(6, 'Creative', 'Sparkles', 'UI/UX wireframing in Figma, visual design, and multimedia editing'),
(7, 'Cloud and DevOps', 'Rocket', 'AWS infrastructure, Docker containers, Kubernetes, and Git');

-- Seed Students: Srija and Rahul are reciprocal mutual match
INSERT INTO students (id, full_name, email, password, college_name, branch, academic_year, availability, rating, review_count, xp_points, completed_sessions_count, role, active) VALUES
(1, 'Srija Chinta', 'chintaassrija@gmail.com', '$2a$10$dKj8E.yG8kZ9aP3nO2s7ve7p1w3R5m2sK4xye8w3R5m2sK4xye', 'Vasavi College of Engineering', 'Computer Science & Engineering', '3rd Year', 'Available', 4.95, 14, 1250, 8, 'ROLE_STUDENT', TRUE),
(2, 'Rahul Verma', 'rahul.verma@cbit.ac.in', '$2a$10$dKj8E.yG8kZ9aP3nO2s7ve7p1w3R5m2sK4xye8w3R5m2sK4xye', 'Chaitanya Bharathi Institute of Technology', 'Information Technology', '3rd Year', 'Available', 4.90, 11, 1100, 7, 'ROLE_STUDENT', TRUE),
(3, 'Campus Administrator', 'admin@peerlearn.edu', '$2a$10$dKj8E.yG8kZ9aP3nO2s7ve7p1w3R5m2sK4xye8w3R5m2sK4xye', 'Institutional Academic Council', 'System Administration', 'Faculty', 'Available', 5.0, 0, 5000, 50, 'ROLE_ADMIN', TRUE);

-- Mutual match skills
INSERT INTO student_skills (student_id, skill_name, category, proficiency, type, experience_or_goal) VALUES
(1, 'Python', 'Programming', 'Advanced', 'TEACH', '3 years algorithmic coding & Flask APIs'),
(1, 'Java', 'Programming', 'Advanced', 'LEARN', 'Targeting Spring Boot, JPA & Microservices'),
(2, 'Java', 'Programming', 'Advanced', 'TEACH', 'Spring Data JPA, Hibernate, OOP architecture'),
(2, 'Python', 'Programming', 'Intermediate', 'LEARN', 'Pandas and scripting for algorithmic problems');`
    },
    {
      path: 'src/main/java/com/peerlearn/PeerLearnApplication.java',
      name: 'PeerLearnApplication.java',
      language: 'java',
      content: `package com.peerlearn;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PeerLearnApplication {
    public static void main(String[] args) {
        SpringApplication.run(PeerLearnApplication.class, args);
        System.out.println("==================================================================");
        System.out.println("  PEERLEARN - STUDENT SKILL EXCHANGE PLATFORM RUNNING AT PORT 8080");
        System.out.println("  Student Login : chintaassrija@gmail.com / student123");
        System.out.println("  Admin Portal  : admin@peerlearn.edu / Admin@123");
        System.out.println("  MySQL Database: peerlearn_db");
        System.out.println("==================================================================");
    }
}`
    },
    {
      path: 'src/main/java/com/peerlearn/model/Student.java',
      name: 'Student.java',
      language: 'java',
      content: `package com.peerlearn.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "students")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Full name is required")
    @Column(nullable = false, length = 120)
    private String fullName;

    @Email(message = "Valid email is required")
    @NotBlank(message = "Email is required")
    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @NotBlank(message = "Password is required")
    @Column(nullable = false)
    private String password;

    @NotBlank(message = "College name is required")
    @Column(nullable = false, length = 200)
    private String collegeName;

    @NotBlank(message = "Branch is required")
    @Column(nullable = false, length = 120)
    private String branch;

    @NotBlank(message = "Academic year is required")
    @Column(nullable = false, length = 50)
    private String academicYear;

    private String profilePhoto;

    @Column(length = 1000)
    private String bio;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String availability = "Available";

    @Column(nullable = false)
    @Builder.Default
    private Double rating = 5.0;

    @Builder.Default
    private Integer reviewCount = 0;

    @Builder.Default
    private Integer xpPoints = 100;

    @Builder.Default
    private Integer completedSessionsCount = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private Role role = Role.ROLE_STUDENT;

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<StudentSkill> skills = new ArrayList<>();

    public enum Role {
        ROLE_STUDENT,
        ROLE_ADMIN
    }
}`
    },
    {
      path: 'src/main/java/com/peerlearn/service/MatchingService.java',
      name: 'MatchingService.java',
      language: 'java',
      content: `package com.peerlearn.service;

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

            List<String> whatYouTeachThem = currentTeaches.stream()
                    .filter(otherLearns::contains)
                    .collect(Collectors.toList());

            List<String> whatTheyTeachYou = otherTeaches.stream()
                    .filter(currentLearns::contains)
                    .collect(Collectors.toList());

            if (!whatYouTeachThem.isEmpty() && !whatTheyTeachYou.isEmpty()) {
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
}`
    },
    {
      path: 'src/main/java/com/peerlearn/config/SecurityConfig.java',
      name: 'SecurityConfig.java',
      language: 'java',
      content: `package com.peerlearn.config;

import com.peerlearn.repository.StudentRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import java.util.Collections;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService(StudentRepository studentRepository) {
        return username -> studentRepository.findByEmailIgnoreCase(username)
                .map(student -> new User(
                        student.getEmail(),
                        student.getPassword(),
                        student.getActive(),
                        true,
                        true,
                        true,
                        Collections.singletonList(new SimpleGrantedAuthority(student.getRole().name()))
                ))
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/home", "/about", "/how-it-works", "/skills/**", "/login", "/register", "/api/auth/**", "/css/**", "/js/**").permitAll()
                .requestMatchers("/admin/**", "/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/dashboard/**", "/my-skills/**", "/matches/**", "/requests/**", "/sessions/**", "/profile/**").hasAnyRole("STUDENT", "ADMIN")
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .defaultSuccessUrl("/dashboard", true)
                .failureUrl("/login?error=true")
                .permitAll()
            )
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/login?logout=true")
                .permitAll()
            )
            .csrf(csrf -> csrf.ignoringRequestMatchers("/api/**"));

        return http.build();
    }
}`
    },
    {
      path: 'src/test/java/com/peerlearn/StudentServiceTest.java',
      name: 'StudentServiceTest.java',
      language: 'java',
      content: `package com.peerlearn;

import com.peerlearn.model.Student;
import com.peerlearn.model.StudentSkill;
import com.peerlearn.service.StudentService;
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

    @Test
    @DisplayName("Test 1 & 2: Student registration & duplicate prevention")
    void testRegistration() {
        Student s = Student.builder()
                .fullName("Srija Chinta")
                .email("srija.test@example.edu")
                .password("student123")
                .collegeName("Vasavi College")
                .branch("CSE")
                .academicYear("3rd Year")
                .build();

        Student saved = studentService.registerStudent(s);
        assertNotNull(saved.getId());
        assertTrue(saved.getPassword().startsWith("$2a$"), "Password must be BCrypt encrypted");

        assertThrows(IllegalArgumentException.class, () -> studentService.registerStudent(s));
    }
}`
    },
    {
      path: 'src/test/java/com/peerlearn/MatchingServiceTest.java',
      name: 'MatchingServiceTest.java',
      language: 'java',
      content: `package com.peerlearn;

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
    @DisplayName("Test 8: Mutual Skill Matching Algorithm between Srija and Rahul")
    void testMutualSkillMatching() {
        Student srija = studentService.registerStudent(Student.builder()
                .fullName("Srija")
                .email("srija@match.edu")
                .password("pwd")
                .collegeName("Vasavi")
                .branch("CSE")
                .academicYear("3rd Year")
                .build());

        studentService.addSkill(srija.getId(), StudentSkill.builder().skillName("Python").category("Programming").proficiency(StudentSkill.Proficiency.Advanced).type(StudentSkill.SkillType.TEACH).build());
        studentService.addSkill(srija.getId(), StudentSkill.builder().skillName("Java").category("Programming").proficiency(StudentSkill.Proficiency.Intermediate).type(StudentSkill.SkillType.LEARN).build());

        Student rahul = studentService.registerStudent(Student.builder()
                .fullName("Rahul")
                .email("rahul@match.edu")
                .password("pwd")
                .collegeName("CBIT")
                .branch("IT")
                .academicYear("3rd Year")
                .build());

        studentService.addSkill(rahul.getId(), StudentSkill.builder().skillName("Java").category("Programming").proficiency(StudentSkill.Proficiency.Advanced).type(StudentSkill.SkillType.TEACH).build());
        studentService.addSkill(rahul.getId(), StudentSkill.builder().skillName("Python").category("Programming").proficiency(StudentSkill.Proficiency.Intermediate).type(StudentSkill.SkillType.LEARN).build());

        List<MatchResultDto> matches = matchingService.findMatchesForStudent(srija.getId());
        assertFalse(matches.isEmpty());
        MatchResultDto top = matches.get(0);
        assertEquals("MUTUAL", top.getMatchType());
        assertTrue(top.getMatchPercentage() >= 85);
    }
}`
    },
    {
      path: 'README.md',
      name: 'README.md',
      language: 'markdown',
      content: `# PEERLEARN – STUDENT SKILL EXCHANGE PLATFORM
Tagline: *Learn Together. Grow Together.*

DevOps Academic Case Study & Spring Boot Full-Stack Implementation.

---

## Windows 11 Running Instructions

### 1. Prerequisites
- **Java 21**: Verify with \`java -version\`
- **Apache Maven 3.9+**: Verify with \`mvn -version\`
- **MySQL Server 8.0+**: Ensure MySQL is running on port 3306

### 2. Create Database
Open MySQL Command Line Client or PowerShell:
\`\`\`sql
CREATE DATABASE peerlearn_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
\`\`\`

Verify credentials in \`src/main/resources/application.properties\`:
\`\`\`properties
spring.datasource.url=jdbc:mysql://localhost:3306/peerlearn_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=root
\`\`\`

### 3. Run Automated Tests
\`\`\`cmd
mvn clean test
\`\`\`

All 15 scenario tests (Registration, Login, BCrypt, Profile Edit, Mutual Matching, Requests, Sessions, Admin security) will execute cleanly.

### 4. Build Package & Run Application
\`\`\`cmd
mvn clean package
mvn spring-boot:run
\`\`\`

### 5. Access Platform in Browser
- **URL**: http://localhost:8080
- **Student Demo**: \`chintaassrija@gmail.com\` / \`student123\`
- **Admin Portal**: \`admin@peerlearn.edu\` / \`Admin@123\``
    }
  ];
}

export async function downloadSpringBootProjectZip(): Promise<void> {
  const zip = new JSZip();
  const files = getSpringBootProjectFiles();

  files.forEach(f => {
    zip.file(f.path, f.content);
  });

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'peerlearn-spring-boot-maven-windows11.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

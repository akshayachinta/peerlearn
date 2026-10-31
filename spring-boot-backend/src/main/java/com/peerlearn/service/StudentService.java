
package com.peerlearn.service;

import com.peerlearn.model.Activity;
import com.peerlearn.model.Student;
import com.peerlearn.model.StudentSkill;
import com.peerlearn.repository.ActivityRepository;
import com.peerlearn.repository.StudentRepository;
import com.peerlearn.repository.StudentSkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private StudentSkillRepository studentSkillRepository;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Student registerStudent(Student student) {
        if (studentRepository.existsByEmailIgnoreCase(student.getEmail())) {
            throw new IllegalArgumentException(
                "A student with email " + student.getEmail() + " is already registered."
            );
        }

        student.setPassword(passwordEncoder.encode(student.getPassword()));
        student.setRole(Student.Role.ROLE_STUDENT);
        student.setActive(true);
        student.setRating(5.0);
        student.setReviewCount(0);
        student.setXpPoints(100);
        student.setCompletedSessionsCount(0);

        Student saved = studentRepository.save(student);

        activityRepository.save(Activity.builder()
                .type("SKILL_ADDED")
                .title("Student Joined")
                .description(saved.getFullName() + " joined PeerLearn from " + saved.getCollegeName() + ".")
                .studentId(saved.getId())
                .studentName(saved.getFullName())
                .build());

        return saved;
    }

    public Student authenticate(String email, String rawPassword) {
        Student student = studentRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));

        if (!student.getActive()) {
            throw new IllegalStateException("Account has been deactivated by administrator.");
        }

        if (!passwordEncoder.matches(rawPassword, student.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password.");
        }

        return student;
    }

    public Student updateProfile(Long studentId, Student updates) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found."));

        if (updates.getFullName() != null) student.setFullName(updates.getFullName());
        if (updates.getCollegeName() != null) student.setCollegeName(updates.getCollegeName());
        if (updates.getBranch() != null) student.setBranch(updates.getBranch());
        if (updates.getAcademicYear() != null) student.setAcademicYear(updates.getAcademicYear());
        if (updates.getBio() != null) student.setBio(updates.getBio());
        if (updates.getProfilePhoto() != null) student.setProfilePhoto(updates.getProfilePhoto());
        if (updates.getAvailability() != null) student.setAvailability(updates.getAvailability());

        return studentRepository.save(student);
    }

    public StudentSkill addSkill(Long studentId, StudentSkill skill) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found."));

        if (studentSkillRepository.existsByStudentIdAndSkillNameIgnoreCaseAndType(
                studentId, skill.getSkillName(), skill.getType())) {
            throw new IllegalArgumentException(
                "You already have '" + skill.getSkillName() + "' in your " + skill.getType() + " list."
            );
        }

        skill.setStudent(student);
        StudentSkill saved = studentSkillRepository.save(skill);

        // Keep the student's skills collection synchronized
        student.getSkills().add(saved);

        activityRepository.save(Activity.builder()
                .type("SKILL_ADDED")
                .title("Skill Cataloged")
                .description(student.getFullName() + " added '" + skill.getSkillName() + "' (" + skill.getProficiency() + ") to " + skill.getType() + " list.")
                .studentId(student.getId())
                .studentName(student.getFullName())
                .build());

        return saved;
    }

    public void removeSkill(Long studentId, Long skillId) {
        StudentSkill skill = studentSkillRepository.findById(skillId)
                .orElseThrow(() -> new IllegalArgumentException("Skill record not found."));

        if (!skill.getStudent().getId().equals(studentId)) {
            throw new SecurityException("Unauthorized to delete this skill.");
        }

        studentSkillRepository.delete(skill);
    }

    public StudentSkill updateSkillProficiency(
            Long studentId,
            Long skillId,
            StudentSkill.Proficiency newProficiency) {

        StudentSkill skill = studentSkillRepository.findById(skillId)
                .orElseThrow(() -> new IllegalArgumentException("Skill record not found."));

        if (!skill.getStudent().getId().equals(studentId)) {
            throw new SecurityException("Unauthorized to modify this skill.");
        }

        skill.setProficiency(newProficiency);
        return studentSkillRepository.save(skill);
    }

    @Transactional(readOnly = true)
    public List<Student> getAllActiveStudents() {
        return studentRepository.findByActiveTrue();
    }

    @Transactional(readOnly = true)
    public Optional<Student> getStudentById(Long id) {
        return studentRepository.findById(id);
    }
}

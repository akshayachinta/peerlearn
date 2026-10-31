package com.peerlearn.controller;

import com.peerlearn.model.Student;
import com.peerlearn.model.StudentSkill;
import com.peerlearn.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @GetMapping
    public ResponseEntity<List<Student>> getStudents() {
        return ResponseEntity.ok(studentService.getAllActiveStudents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getStudent(@PathVariable Long id) {
        return studentService.getStudentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/profile")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody Student updates) {
        try {
            Student updated = studentService.updateProfile(id, updates);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/skills")
    public ResponseEntity<?> addSkill(@PathVariable Long id, @RequestBody StudentSkill skill) {
        try {
            StudentSkill saved = studentService.addSkill(id, skill);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}/skills/{skillId}")
    public ResponseEntity<?> deleteSkill(@PathVariable Long id, @PathVariable Long skillId) {
        try {
            studentService.removeSkill(id, skillId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/skills/{skillId}/proficiency")
    public ResponseEntity<?> updateProficiency(
            @PathVariable Long id,
            @PathVariable Long skillId,
            @RequestParam StudentSkill.Proficiency proficiency) {
        try {
            StudentSkill updated = studentService.updateSkillProficiency(id, skillId, proficiency);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

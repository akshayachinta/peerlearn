package com.peerlearn.controller;

import com.peerlearn.dto.AdminStatsDto;
import com.peerlearn.model.Skill;
import com.peerlearn.model.Student;
import com.peerlearn.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsDto> getStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @PutMapping("/students/{id}/toggle-status")
    public ResponseEntity<Student> toggleStudentStatus(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.toggleStudentStatus(id));
    }

    @DeleteMapping("/students/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        adminService.deleteStudent(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/skills")
    public ResponseEntity<Skill> addSkill(@RequestBody Map<String, Object> payload) {
        String name = (String) payload.get("name");
        Long categoryId = payload.get("categoryId") != null ? Long.valueOf(payload.get("categoryId").toString()) : null;
        Boolean popular = (Boolean) payload.get("popular");

        return ResponseEntity.ok(adminService.addSkill(name, categoryId, popular));
    }

    @DeleteMapping("/skills/{id}")
    public ResponseEntity<Void> deleteSkill(@PathVariable Long id) {
        adminService.deleteSkill(id);
        return ResponseEntity.ok().build();
    }
}

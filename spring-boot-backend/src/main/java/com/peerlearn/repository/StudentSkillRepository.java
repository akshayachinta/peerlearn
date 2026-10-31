package com.peerlearn.repository;

import com.peerlearn.model.StudentSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentSkillRepository extends JpaRepository<StudentSkill, Long> {
    List<StudentSkill> findByStudentId(Long studentId);
    List<StudentSkill> findByStudentIdAndType(Long studentId, StudentSkill.SkillType type);
    Optional<StudentSkill> findByStudentIdAndSkillNameIgnoreCaseAndType(Long studentId, String skillName, StudentSkill.SkillType type);
    boolean existsByStudentIdAndSkillNameIgnoreCaseAndType(Long studentId, String skillName, StudentSkill.SkillType type);
}
